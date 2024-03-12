import {Container} from "../../shared/ui/Container/Container";
import React from "react";


export const Todo = () => {
  return <Container>
    <div style={{padding: '0 2rem'}}>
      <h2>Todo:</h2>
      <ul>
        <li>Service Worker and Web worker</li>
        <li>pause in just play mode</li>
        <li>there bug: if we first just play tetris and then click find game</li>
        <li>nice preview of cup until game is searching</li>
        <li>before game starts do not display next figure</li>
        <li>optimize CupRenderer2.setCupSize</li>
        <li>there is the bug when player name no input and we click find game not started auto</li>
        <li>when game end and we start new game something goes wrong</li>
        <li>when clear more then 1 row special block can not appears</li>
        <li>remove special blocks from just play cup</li>
        <li>big paused message</li>
        <li>big message search</li>
      </ul>
      <h2>I am not sure</h2>
      <ul>
        <li>extend cup information when player leave a game or connection was lost</li>
      </ul>
      <h2>Back log</h2>
      <ul>
        <li>watch</li>
        <li>make party</li>
      </ul>

    </div>
  </Container>
}