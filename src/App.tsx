import React, { useEffect, useState } from 'react';
const { ipcRenderer } = window.electron;

function App() {
    const [version, setVersion] = useState('0.0.0');

    const initVersion = async () => {
        console.log('message', ipcRenderer);
        setVersion('1.0.2');
    };

    useEffect(() => {
        initVersion();
    }, []);

    return (
        <div className="App">
            {version}
        </div>
    );
}

export default App;
