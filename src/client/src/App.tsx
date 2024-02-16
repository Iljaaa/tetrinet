import React from 'react';
import './App.css';
import {Canvas} from "./Canvas";
import {JoinButtons} from "./widgets/JoinButtons/JoinButtons";
import {Help} from "./widgets/Help/Help";

function App()
{

  return (
    <div className="App">
      <div className="container">
        <div><JoinButtons/></div>
        <div><Canvas/></div>
        <div>
          <Help/>
        </div>
        <h2>Road map:</h2>
        <ul>
          <li>Prepare eight people party</li>
          <li>Winner text</li>
          <li>Super blocks</li>
          <li>Show loader until socket connecting</li>
          <li>Super blocks help</li>
          <li>Set bonuses nice</li>
        </ul>
      </div>
    </div>
  );
}

export default App;
