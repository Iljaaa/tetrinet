import React from 'react';

import {Canvas} from "./Canvas";
import {JoinButtons} from "./widgets/JoinButtons/JoinButtons";
import {Help} from "./widgets/Help/Help";

import './App.css';
import {StateRow} from "./widgets/StateRow/StateRow";
import SocketsEventsAndModals from "./widgets/SocketEventsAndModals/SocketsEventsAndModals";
import {InputNameModal} from "./widgets/InputNameModal/InputNameModal";

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
              <li>drop player when connection is lost</li>
              <li>stop game when focus is lost</li>
              <li>error on socket connect</li>
              <li>watch</li>
              <li>client alert when connection lost</li>
              <li>pretty message that the we cannot connect to server</li>
              <li>There the bug: if you send bonus to not existing opponent, the bonus just disappear. We should first
                check that opponent exists and only then send bonus
              </li>
              <li>Player name</li>
              <li>chat</li>
              <li>When one play lost connection and second click pause server has error</li>
              <li>bug: If any player game is over you still can throw him a special block</li>
              <li>extend block bomb</li>
              <li>duel cups size</li>
              <li>bug: when connection is open and you press join throw exception about lost connection</li>
              <li>display cup index</li>
              <li>bug: when figure drops reset timer</li>
              <li>pause in just play</li>
            </ul>
          </div>

          <SocketsEventsAndModals />

          <InputNameModal isOpen={true} onCancel={()=>{}} onSubmit={()=>{}} />

        </div>
      </div>
    </div>
  );
}

export default App;
