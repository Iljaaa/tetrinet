import {Container} from "../../shared/ui/Container/Container";
import React from "react";


export const Todo = () => {
  return <Container>
    <div style={{padding: '0 2rem'}}>
      <h2>Road map:</h2>
      <ul>
        <li>drop player when connection is lost</li>
        <li>stop game when focus is lost</li>
        <li>error on socket connect</li>
        <li>client alert when connection lost</li>
        <li>When one play lost connection and second click pause server has error</li>
        <li>extend block bomb</li>
        <li>duel cups size</li>
        <li>bug: when connection is open and you press join previous game leaved</li>
        <li>display cup index</li>
        <li>bug: when figure drops timer is not reset</li>
        <li>pause in just play mode</li>
        <li>player name</li>
        <li>buttons event on input player name</li>
        <li>bug in chat: when we type in chat figures moving, we need manipulate with focus</li>
        <li>send in chat with enter</li>
        <li>bug: when session is clear and you find game and  when you input name game does not start</li>
        <li>made work example with http://delphic.me.uk/tutorials/webgl-text</li>
        <li>feed back modal</li>
        <li>modal about searching new game</li>
        <li>'b' clear blocs with play not in the cap</li>
        <li>'g' сработало но я не увидел обновление стакана</li>
      </ul>
      <h2>Back log</h2>
      <ul>
        <li>watch</li>
        <li>make party</li>
      </ul>

    </div>
  </Container>
}