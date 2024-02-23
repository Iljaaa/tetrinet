import React from 'react';
import Modal from 'react-modal';

import {Canvas} from "./Canvas";
import {JoinButtons} from "./widgets/JoinButtons/JoinButtons";
import {Help} from "./widgets/Help/Help";

import './App.css';
import {StateRow} from "./widgets/StateRow/StateRow";

function App()
{

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };

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
              <li>Prepare eight people party</li>
              <li>extend Super blocks</li>
              <li>Create party for many peoples</li>
              <li>stop game when connection is lost</li>
              <li>stop game when focus is lost</li>
              <li>party search a game</li>
              <li>watch</li>
              <li>client alert when connection lost</li>
              <li>save lost connection into store</li>
              <li>pretty message that the we cannot connect to server</li>
              <li>There the bug: if you send bonus to not existing opponent, the bonus just disappear. We should first
                check that opponent exists and only then send bonus
              </li>
              <li>Count bonus fields according cleared lines</li>
              <li>Player name</li>
              <li>When one play lost connection and second click pause server has error</li>
              <li>bug: The A froze on the opponent cup</li>
              <li>bug: If any player game is over you still can throw him a special block</li>
              <li>extend block bomb</li>
              <li>split bonus</li>
              <li>duel cups size</li>
              <li>bug: when connection is open and you press join throw exception about lost connection</li>
            </ul>
          </div>

          <div>

            <Modal
              isOpen={false}
              style={customStyles}
              onRequestClose={() => {}}
              contentLabel="Example Modal"
            >
              <div>I am a modal</div>
              <form>
                <input />
                <button>tab navigation</button>
                <button>stays</button>
                <button>inside</button>
                <button>the modal</button>
              </form>
            </Modal>
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;
