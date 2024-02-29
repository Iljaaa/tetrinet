import React from 'react';

import {Canvas} from "./widgets/Canvas/Canvas";
import {JoinButtons} from "./widgets/JoinButtons/JoinButtons";
import {Help} from "./widgets/Help/Help";

import './App.css';
import {StateRow} from "./widgets/StateRow/StateRow";
import SocketsEventsAndModals from "./widgets/SocketEventsAndModals/SocketsEventsAndModals";

function App()
{

  return (
    <div className="App">
      <div className="container">
        <div className="App-header">Tetrinet</div>
        <div className="App-body">
          <div><JoinButtons/></div>
          <hr style={{background: "#53adae", height: "1px", border: "none"}} />
          <div><StateRow /></div>
          <div><Canvas/></div>
          <div style={{backgroundColor: "#ded9c6", padding: "4rem 0"}}>
            <Help/>
          </div>
          <div style={{backgroundColor: "#ef7f57", padding: "4rem 2rem"}}>
            <h2>Road map:</h2>
            <ul>
              <li>chat</li>
              <li>refactor get message from network layer to play game screen</li>
              <li>drop player when connection is lost</li>
              <li>stop game when focus is lost</li>
              <li>error on socket connect</li>
              <li>client alert when connection lost</li>
              <li>There the bug: if you send bonus to not existing opponent, the bonus just disappear. We should first
                check that opponent exists and only then send bonus
              </li>
              <li>When one play lost connection and second click pause server has error</li>
              <li>bug: If any player game is over you still can throw him a special block</li>
              <li>extend block bomb</li>
              <li>duel cups size</li>
              <li>bug: when connection is open and you press join throw exception about lost connection</li>
              <li>display cup index</li>
              <li>bug: when figure drops timer is not reset</li>
              <li>pause in just play mode</li>
            </ul>
            <h2>Back log</h2>
            <li>watch</li>
          </div>

          <SocketsEventsAndModals/>

        </div>
      </div>
    </div>
  );
}

export default App;
