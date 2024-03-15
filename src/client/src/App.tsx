import React, {useEffect} from 'react';

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

// eslint-disable-next-line import/no-webpack-loader-syntax
import Worker from "worker-loader!./worker.ts"

function App()
{

  useEffect(() => {
    // Создайте новый экземпляр Web Worker
    const worker = new Worker();

    // Отправьте сообщение в Web Worker
    worker.postMessage(5);

    // Получите результат от Web Worker
    worker.onmessage = (event: MessageEvent) => {
      const { data } = event;

      // Обработайте результат
      console.log(data, 'webworker message');
    };

    // Завершите Web Worker после использования
    return () => {
      worker.terminate();
    };
  }, []);

  return (
    <div className="App">
        <Header />
        <div className="App-body">
          <div><JoinButtons/></div>
          <hr style={{background: "#53adae", height: "1px", border: "none"}}/>
          {/*<div><StateRow/></div>*/}
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
