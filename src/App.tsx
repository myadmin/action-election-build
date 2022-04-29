import { useState, useEffect } from 'react';
const { ipcRender } = window.electron;

const App = () => {
    const [text, setText] = useState('');
    const [version, setVersion] = useState('0.0.0');
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // console.log('ipcRender', ipcRender);
        ipcRender.receive('downloadProgress', (data: Record<string, any>) => {
            console.log('data: download-progress', data);
            // setText(data);
            const progress = parseInt(data.percent, 10);
            setProgress(progress);
        });

        ipcRender.receive("isUpdateNow", () => {
            ipcRender.send("isUpdateNow");
        });

        ipcRender.receive("version", (version: string) => {
            console.log('version', version);
            setVersion(version);
        });
        ipcRender.send('checkAppVersion');

        ipcRender.receive('message', (data: string) => {
            console.log('data: message', data);
            setText(data);
        });
        ipcRender.send('checkForUpdate');
    }, []);

    return (
        <div className="App">
            <p>current app version: {version}</p>
            <p>{text}</p>
            {progress ? <p>下载进度：{progress}%</p> : null}
        </div>
    );
}

export default App;
