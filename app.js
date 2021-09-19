const { Client } = require('tplink-smarthome-api');
const express = require("express");

const args = process.argv.slice(2);
const port = args[0] ? parseInt(args[0], 10): 3030;

const app = express();
app.use(express.urlencoded( { extended:true } ));
app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    } else {
        return next();
    }
});

const server = app.listen(port, () => {
    console.log(`TP-Link Smart Home Web is listening to PORT:${server.address().port}`);
});

const powerStateCache = {};
const sendOptions = {timeout: 1000};

const getCachedPowerState = host => powerStateCache[host];

const updateCachedPowerState = newState => {
    let entry = powerStateCache[newState.host];
    if (!entry) {
        entry = newState;
        powerStateCache[entry.host] = entry;
    } else {
        Object.assign(entry, newState);
    }
    entry.update = Date.now();
    return entry;
}

const deleteCachedPowerState = host => {
    const entry = powerStateCache[host];
    if (entry) {
        delete powerStateCache[host];
    }
    return entry;
}

app.get('/discovery', (req, res, next) => {
    const client = new Client();
    const info = [];
    client.on('device-new', device => {
        info.push({host: device.host, type: device.deviceType, name: device.name});
        device.getSysInfo().then(sysInfo => {
            console.log(sysInfo);
        });
    });
    client.startDiscovery({discoveryInterval: 400, discoveryTimeout: 0});
    setTimeout(() => {
        client.stopDiscovery();
        res.json(info);
        return next();
    }, 1200);
});

app.post('/power', (req, res, next) => {
    const client = new Client();
    const report = {host: req.body.host, power: req.body.power === true}
    client.getDevice({ host: report.host }, sendOptions)
        .then(device => {
            report.type = device.deviceType;
            report.name = device.name;
            return device.setPowerState(report.power);
        })
        .then(result => {
            report.result = result;
            updateCachedPowerState(report);
        })
        .catch(error => {
            deleteCachedPowerState(report.host);
            report.result = 'error';
            report.detail = error.message;
            console.error(error);
        })
        .finally(() => {
            res.send(report);
            console.log(report);
            return next();
        })
});


app.get('/state', (req, res, next) => {
    const client = new Client();
    const report = {host: req.query.host};
    const cachedState = getCachedPowerState(report.host);
    if (cachedState && ((Date.now() - cachedState.update) < 200)) {
        report.type = cachedState.deviceType;
        report.name = cachedState.name;
        report.result = true;
        report.power = cachedState.power;
        res.send(report);
        return next();
    }
    client.getDevice({ host: report.host }, sendOptions)
        .then(device => {
            report.type = device.deviceType;
            report.name = device.name;
            return device.getPowerState(sendOptions);
        })
        .then(powerState => {
            report.result = true;
            report.power = powerState;
            updateCachedPowerState(report);
        })
        .catch(error => {
            deleteCachedPowerState(report.host);
            report.result = 'error';
            report.detail = error.message;
            console.error(error);
        })
        .finally(() => {
            res.send(report);
            console.log(report);
            return next();
        })
});