import React from 'react';

import {Canvas} from "./widgets/Canvas/Canvas";
import {JoinButtons} from "./widgets/JoinButtons/JoinButtons";
import {Help} from "./widgets/Help/Help";

import './App.css';
import {StateRow} from "./widgets/StateRow/StateRow";
import SocketsEventsAndModals from "./widgets/SocketEventsAndModals/SocketsEventsAndModals";
import {Chat} from "./widgets/Chat/Chat";
import {Container} from "./shared/ui/Container/Container";
import {PlayerNameModal} from "./widgets/PlayerNameModal/PlayerNameModal";

function App()
{

  return (
    <div className="App">
      <div className="container">
        <div className="App-header">Tetrinet</div>
        <div className="App-body">
          <div><JoinButtons/></div>
          <hr style={{background: "#53adae", height: "1px", border: "none"}}/>
          <div><StateRow/></div>
          <div><Canvas/></div>
          <div><Chat/></div>
          <div><Help/></div>
          <div>
            <Container>
              <h2>Road map:</h2>
              <ul>
                <li>refactor get message from network layer to play game screen</li>
                <li>refactor ConnectionInterface to other interface to resolve this warning: Warning:(100, 102) Property 'socketId' not found in \Ratchet\ConnectionInterface</li>
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
                <li>player name</li>
                <li>buttons event on input player name</li>
                <li>bug in chat: when we type in chat figures moving, we need manipulate with focus</li>
                <li>send in chat with enter</li>
              </ul>
              <h2>Back log</h2>
              <ul>
                <li>watch</li>
              </ul>
            </Container>
          </div>

          <SocketsEventsAndModals/>
          <PlayerNameModal />


        </div>
    </div>
</div>
)
  ;
}

export default App;
