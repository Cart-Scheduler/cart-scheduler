import { useEffect, useState } from 'react';

import logo from './logo.svg';
import './App.css';

import { getTestDocs } from './services/firebase';

function App() {
  const [text, setText] = useState('');
  useEffect(() => {
    const run = async () => {
      const data = await getTestDocs();
      setText(JSON.stringify(data));
    };
    run();
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>{text}</p>
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
