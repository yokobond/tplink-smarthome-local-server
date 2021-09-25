# TP-Link Smarthome Local Server

This command serves Web API for TP-Link Smarthome in the LAN.

This uses [plasticrake/tplink-smarthome-api: TP-Link Smarthome WiFi API](https://github.com/plasticrake/tplink-smarthome-api) to control devices. Supporting devices are according to the tplink-smarthome-api.

## How to Use It

`tplink-smarthome-local-server` starts a web server with REST Web API.

```sh
npx tplink-smarthome-local-server
```

This web server is listening port 3030 and access only allowed from local machine as default.

This command accepts these arguments.

<dl>
  <dt>--port(-p) number</dt>
    <dd>port number to listening, default `3030`</dd>
  <dt>--allow(-a) IPs</dt>
    <dd>access allowed IPs separated spaces like `--allow 127.0.0.1 ::1 ::ffff:192.168.0.0/16`, default `127.0.0.1" "::1`</dd>
  <dt>--verbose</dt>
    <dd>output more logs, default `false`</dd>
</dl>

To lookup the devices on the LAN, access the following link.

[http://localhost:3030/discovery](
http://localhost:3030/discovery
)

To stop this service, push `ctrl-c` on the executed command line.

## API

### Discovery

`GET /discovery`

Discover TP-Link Smarthome devices on the network.
Returns array of object with these properties in JSON.
- `host` : IP address of the device
- `type` : type of the device ["Plug" | "Bulb"]
- `name` : alias which named by Kasa app of TP-Link

### Set Power State

`POST /state` with JSON `{ host:<IP address>, power:<boolean> }`

Turns Plug or Bulb relay ON when the power is `true` or OFF for others.
Returns report of the call with these properties in JSON.
- `host` : IP address of the device
- `type` : type of the device ["Plug" | "Bulb"]
- `name` : alias which named by Kasa app of TP-Link
- `power` : power state of the device
- `result` : true when the request success or "error"
- `detail` : error message when it is needed


### Get State

`GET /state?host=<IP address>`

Returns the state object of the device in JSON.
- `host` : IP address of the device
- `type` : type of the device ["Plug" | "Bulb"]
- `name` : alias which named by Kasa app of TP-Link
- `power` : power state of the device
- `result` : true when the request success or "error"
- `detail` : error message when it is needed


## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/yokobond/tplink-smarthome-local-server/issues). 
## Show your support

Give a ⭐️ if this project helped you!


## 📝 License

Copyright © 2021 [Koji Yokokawa](https://github.com/yokobond).<br />
This project is [MIT](https://github.com/yokobond/tplink-smarthome-local-server/blob/master/LICENSE) licensed.
