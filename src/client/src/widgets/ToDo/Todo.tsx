import {Container} from "../../shared/ui/Container/Container";
import React from "react";


export const Todo = () => {
  return <Container>
    <div style={{padding: '0 2rem'}}>
      <h2>Todo:</h2>
      <ul>
        <li>Service Worker and Web worker</li>
        <li>nice preview of cup until game is searching</li>
        <li>optimize CupRenderer2.setCupSize</li>
        <li>there is the bug when player name no input and we click find game not started auto</li>
        <li>when clear more then 1 row special block can not appears</li>
        <li>remove special blocks from just play cup</li>
        <li>fix block help</li>
        <li>make speed up</li>
        <li>big message search</li>
      </ul>
      <h2>I am not sure</h2>
      <ul>
        <li>extend cup information when player leave a game or connection was lost</li>
        <li>big paused message</li>
      </ul>
      <h2>Back log</h2>
      <ul>
      <li>watch</li>
        <li>make party</li>
      </ul>

    </div>
  </Container>
}