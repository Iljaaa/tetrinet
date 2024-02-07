import React from 'react';
import './App.css';
import {Canvas} from "./Canvas";

function App() {
  return (
    <div className="App">
      <Canvas />
      <div>
        <ul>
          <li>start: Add connetion to temporary state</li>
          <li>when all will be ready we start the game</li>
        </ul>
      </div>
    </div>
  );
}

export default App;
