import React from 'react';

import {Canvas} from "./widgets/Canvas/Canvas";
import {JoinButtons} from "./widgets/JoinButtons/JoinButtons";
import {Help} from "./widgets/Help/Help";

import './App.css';
import SocketsEventsAndModals from "./widgets/SocketEventsAndModals/SocketsEventsAndModals";
import {Chat} from "./widgets/Chat/Chat";
import {PlayerNameModal} from "./widgets/PlayerNameModal/PlayerNameModal";
import {Header} from "./widgets/Header/Header";
import {Todo} from "./widgets/ToDo/Todo";
import {Footer} from "./widgets/Footer/Footer";
import {Container} from "./shared/ui/Container/Container";

function App()
{
  return (
    <div className="App">
      <div className="App-body">
        <Header />
        <JoinButtons />
        <Container style={{padding: "0"}}>
          <hr style={{background: "#53adae", height: "1px", border: "none", margin: 0}}/>
          {/*<div><StateRow/></div>*/}
          <Canvas/>
        </Container>
        <div><Chat/></div>
        <div><Help/></div>
        <div><Todo /></div>
        <Footer />
        <SocketsEventsAndModals/>
        <PlayerNameModal />
      </div>
</div>
)
  ;
}

export default App;
