import React from 'react';
import logo from './logo.svg';
import './App.css';
import PWAInitailizer from './PwaInit';
const hasPush = ('PushManager' in window);
function App() {
  return (
    <div className="App">
      <PWAInitailizer />
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <div>
          {hasPush ? 'Yes' : 'No'}
          <br />
          {Date.now()}
        </div>
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
