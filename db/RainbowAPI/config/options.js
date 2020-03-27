// Define your configuration
module.exports = options = {
    rainbow: {
        host: "sandbox"
    },
    credentials: {
        login: "gabrielrulz@live.com.sg", // To replace by your developer credendials
        password: "Longpassword!1" // To replace by your developer credentials
    },
    // Application identifier
    application: {
        appID: "dcb692b0564b11eabb3887f44e39165a",
        appSecret: "BrxZMv6ThPI1ZfdSRvpWhj6BZudBtQzI6dxHMmqV6uDEGmwO6WuvSpkfmA64cEhS"
    },
    // Logs options
    logs: {
        enableConsoleLogs: true,
        enableFileLogs: false,
        "color": true,
        "level": 'debug',
        "customLabel": "vincent01",
        "system-dev": {
            "internals": false,
            "http": false,
        }, 
        file: {
            path: "/var/tmp/rainbowsdk/",
            customFileName: "R-SDK-Node-Sample2",
            level: "debug",
            zippedArchive : false/*,
            maxSize : '10m',
            maxFiles : 10 // */
        }
    },
    // IM options
    im: {
        sendReadReceipt: true
    }
};