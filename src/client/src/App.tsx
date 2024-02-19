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
        <div className="App-header">Tetrinet</div>
        <div className="App-body">
          <div><JoinButtons/></div>
          <div><Canvas/></div>
          <div>
            <Help/>
          </div>
          <h2>Road map:</h2>
          <ul>
            <li>Prepare eight people party</li>
            <li>extend Super blocks</li>
            <li>Display bonuses nice</li>
            <li>Create party for many peoples</li>
            <li>stop game when connection is lost</li>
            <li>stop game when focus is lost</li>
            <li>party search a game</li>
            <li>watch</li>
            <li>client alert when connection lost</li>
            <li>save lost connection into store</li>
            <li>pretty message that the we cannot connect to server</li>
            <li>There the bug: if you send bonus to not existing opponent, the bonus just disappear. We should first check that opponent exists and only then send bonus</li>
            <li>Count bonus fields according cleared lines</li>
            <li>Player name</li>
            <li>When one play lost connection and second click pause server has error</li>
            <li>bug: The A froze on the opponent cup</li>
            <li>bug: If any player game is over you still can throw him a special block</li>
            <li>bug: on small cup background draws incorrect</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
