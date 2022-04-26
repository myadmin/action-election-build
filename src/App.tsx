import React, { useEffect, useState } from 'react';
const { ipcRenderer } = window.electron;

function App() {
    const [version, setVersion] = useState('0.0.0');

    useEffect(() => {
        ipcRenderer.on('message', (event: any, msg: string) => {
            console.log('msg', msg);
        });
    }, []);

    return (
        <div className="App">
            {version}
        </div>
    );
}

export default App;
