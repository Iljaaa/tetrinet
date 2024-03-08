import React from 'react';

import {Canvas} from "./widgets/Canvas/Canvas";
import {JoinButtons} from "./widgets/JoinButtons/JoinButtons";
import {Help} from "./widgets/Help/Help";

import './App.css';
import {StateRow} from "./widgets/StateRow/StateRow";
import SocketsEventsAndModals from "./widgets/SocketEventsAndModals/SocketsEventsAndModals";
import {Chat} from "./widgets/Chat/Chat";
import {PlayerNameModal} from "./widgets/PlayerNameModal/PlayerNameModal";
import {Header} from "./widgets/Header/Header";
import {Todo} from "./widgets/ToDo/Todo";
import {Footer} from "./widgets/Footer/Footer";

function App()
{

  return (
    <div className="App">
        <Header />
        <div className="App-body">
          <div><JoinButtons/></div>
          <hr style={{background: "#53adae", height: "1px", border: "none"}}/>
          <div><StateRow/></div>
          <div><Canvas/></div>
          <div><Chat/></div>
          <div><Help/></div>
          <div><Todo /></div>

      </div>
      <Footer />

      <SocketsEventsAndModals/>
      <PlayerNameModal />
</div>
)
  ;
}

export default App;
