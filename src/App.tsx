const { ipcRenderer } = window.electron;

function App() {
    // const [version, setVersion] = useState('0.0.0');

    // useEffect(() => {
    //     setTimeout(() => {
    //         console.log('update');
    //         ipcRenderer.on('asynchronous-reply', (event: any, arg: string) => {
    //             console.log(arg);
    //         });
    //     }, 5 * 1000);
    // }, []);

    const handleClick = () => {
        ipcRenderer.send('update', 'check app version');
    }

    return (
        <div className="App">
            <button onClick={handleClick}>click</button>
        </div>
    );
}

export default App;
