import React from 'react';
import './App.css';
import {Canvas} from "./Canvas";
import {JoinButtons} from "./widgets/JoinButtons/JoinButtons";

function App() {
  return (
      <div className="App">
          <JoinButtons />
          <Canvas />
          <h2>todo:</h2>
          <ul>
              <li>Global game over and winner</li>
              <li>Prepare eight people party</li>
              <li>Block buttons by state</li>
              <li>Show loader until socket connecting</li>
              <li>Just play tetris</li>
          </ul>
      </div>
  );
}

export default App;
