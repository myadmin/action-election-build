import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';

// import installExtension, { REACT_DEVELOPER_TOOLS } from "electron-devtools-installer";
import { autoUpdater } from 'electron-updater';
const isDev = require('electron-is-dev');

let mainWindow: any;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    if (!isDev) {
        // 'build/index.html'
        mainWindow.loadURL(`file://${__dirname}/../index.html`);
    } else {
        mainWindow.loadURL('http://localhost:3000');

        mainWindow.webContents.openDevTools();

        // Hot Reloading on 'node_modules/.bin/electronPath'
        require('electron-reload')(__dirname, {
            electron: path.join(
                __dirname,
                '..',
                '..',
                'node_modules',
                '.bin',
                'electron' + (process.platform === 'win32' ? '.cmd' : '')
            ),
            forceHardReset: true,
            hardResetMethod: 'exit',
        });
    }
    return mainWindow;
}

app.on('ready', createWindow);

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

function sendStatusToWindow(text: string) {
    // log.info(text);
    mainWindow.webContents.send('message', text);
}

const message = {
    error: '检查更新出错',
    checking: '正在检查更新……',
    updateAva: '检测到新版本，正在下载……',
    updateNotAva: '现在使用的就是最新版本，不用更新',
};

if (isDev) {
    autoUpdater.updateConfigPath = path.join(__dirname, 'dev-app-update.yml');
}
autoUpdater.autoDownload = false;
// autoUpdater.checkForUpdates();
autoUpdater.on('error', (error) => {
    // dialog.showErrorBox('Error', err === null ? 'unknown' : err);
    sendStatusToWindow(`${message.error}:${error}`);
});
autoUpdater.on('checking-for-update', () => {
    console.log('Checking for update...');
    // mainWindow.webContents.send('checking-for-update', 'Checking for update...');
    sendStatusToWindow(message.checking);
});
autoUpdater.on('update-available', () => {
    sendStatusToWindow(message.updateAva);
    autoUpdater.downloadUpdate();
});
autoUpdater.on('update-not-available', () => {
    // dialog.showMessageBox({
    //     title: '没有新版本',
    //     message: '当前已经是最新版本'
    // });
    // mainWindow.webContents.send('update-not-available', '没有新版本');
    sendStatusToWindow(message.updateNotAva);
});
autoUpdater.on('download-progress', (progress) => {
    let logMessage = `Download speed: ${progress.bytesPerSecond}`;
    logMessage = logMessage + ' - Download ' + progress.percent + '%';
    logMessage = logMessage + ' (' + progress.transferred + '/' + progress.total + ')';
    console.log(logMessage);
    mainWindow.webContents.send('downloadProgress', progress);
    mainWindow.setProgressBar(progress.percent / 100);
});
autoUpdater.on('update-downloaded', () => {
    console.log('更新完成')
    ipcMain.on('isUpdateNow', (e, arg) => {
        console.log("开始更新");
        //some code here to handle event
        autoUpdater.quitAndInstall();
    });
    mainWindow.webContents.send('isUpdateNow')
});

ipcMain.on("checkForUpdate", () => {
    //放外面的话启动客户端执行自动更新检查
    autoUpdater.checkForUpdates();
});

ipcMain.on("checkAppVersion", () => {
    mainWindow.webContents.send('version', app.getVersion());
});
