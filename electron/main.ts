import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import installExtension, { REACT_DEVELOPER_TOOLS } from "electron-devtools-installer";
// import { autoUpdater } from 'electron-updater';

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            // contextIsolation: false,
            preload: path.join(__dirname, 'preload.js')
        }
    })

    if (app.isPackaged) {
        // 'build/index.html'
        win.loadURL(`file://${__dirname}/../index.html`);
    } else {
        win.loadURL('http://localhost:3000/index.html');

        win.webContents.openDevTools();

        // Hot Reloading on 'node_modules/.bin/electronPath'
        require('electron-reload')(__dirname, {
            electron: path.join(__dirname,
                '..',
                '..',
                'node_modules',
                '.bin',
                'electron' + (process.platform === "win32" ? ".cmd" : "")),
            forceHardReset: true,
            hardResetMethod: 'exit'
        });
    }
}

function sendStatusToWindow(text: string) {
    // log.info(text);
    // win.webContents.send('message', text);
    console.log('text', text);
    ipcMain.on('message', async (event, someArgument) => {
        console.log('someArgument', text);
        return event.returnValue = text;
    });
}

// autoUpdater.on('checking-for-update', () => {
//     sendStatusToWindow('Checking for update...');
// })
// autoUpdater.on('update-available', (info) => {
//     sendStatusToWindow('Update available.');
// })
// autoUpdater.on('update-not-available', (info) => {
//     sendStatusToWindow('Update not available.');
// })
// autoUpdater.on('error', (err) => {
//     sendStatusToWindow('Error in auto-updater. ' + err);
// })
// autoUpdater.on('download-progress', (progressObj) => {
//     let log_message = "Download speed: " + progressObj.bytesPerSecond;
//     log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
//     log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
//     sendStatusToWindow(log_message);
// })
// autoUpdater.on('update-downloaded', (info) => {
//     sendStatusToWindow('Update downloaded');
// });

app.whenReady().then(() => {
    // DevTools
    installExtension(REACT_DEVELOPER_TOOLS)
        .then((name) => console.log(`Added Extension:  ${name}`))
        .catch((err) => console.log('An error occurred: ', err));

    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });

    app.on('ready', function () {
        // autoUpdater.checkForUpdatesAndNotify();
        sendStatusToWindow('ready');
    });
});

