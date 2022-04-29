const { contextBridge, ipcRenderer, shell } = require('electron');

const ipc = {
    render: {
        // From render to main.
        send: ["toMain", "render-send", "checkForUpdate", "isUpdateNow", "checkAppVersion"],
        // From main to render.
        receive: ["updateAvailable", "message", "downloadProgress", "checking-for-update", "update-not-available", "isUpdateNow", "version"],
        // From render to main and back again.
        sendReceive: []
    }
};

contextBridge.exposeInMainWorld('electron', {
    ipcRenderer,
    shell,
    'ipcRender': {
        send: (channel: string, data: any) => {
            // whitelist channels
            let validChannels: Array<string> = ipc.render.send;
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, data);
            }
        },
        receive: (channel: string, func: Function) => {
            let validChannels: Array<string> = ipc.render.receive;
            // console.log('validChannels', validChannels);
            if (validChannels.includes(channel)) {
                // Deliberately strip event as it includes `sender` 
                ipcRenderer.on(`${channel}`, (event, ...args) => func(...args));
            }
        },
        invoke: (channel: string, args: any) => {
            let validChannels: Array<string> = ipc.render.sendReceive;
            if (validChannels.includes(channel)) {
                return ipcRenderer.invoke(channel, args);
            }
        }
    }
});