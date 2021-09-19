# TP-Link Smarthome Local Server

This command serves Web API for TP-Link Smarthome in the LAN.

## How to Use It

`tplink-smarthome-local-server` is a Node executable script of a web server. 

```sh
npx tplink-smarthome-local-server
```

The web server is listening port 3030 as default.

This command accepts port number for listening as a command-line argument like following.

```sh
npx tplink-smarthome-local-server 3031
```

`ctrl-c` to stop this service.

## API

### Discovery

`GET /discovery`

Discover TP-Link Smarthome devices on the network.
Returns array of object with these properties in JSON.
- `host` : IP address of the device
- `type` : type of the device ["Plug" | "Bulb"]
- `name` : alias which named by Kasa app of TP-Link

### Set Power State

`POST /power` with JSON `{ host:<IP address>, power:<boolean> }`

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
