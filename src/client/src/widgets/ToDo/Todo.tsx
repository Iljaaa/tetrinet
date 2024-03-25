import {Container} from "../../shared/ui/Container/Container";
import React from "react";

export const Todo = () => {
  return <Container>
    <div style={{padding: '0 2rem'}}>
      <h2>Todo:</h2>
      <ul>
        <li>nice preview of cup until game is searching</li>
        <li>stop timer wen game ends</li>
        <li>optimize CupRenderer2.setCupSize</li>
        <li>make speed up</li>
        <li>big message search</li>
        <li>when game end stop timer</li>
        <li>Fix chat input style</li>
        <li>Timer in just play</li>
        <li>Move socket url to config</li>
        <li>Write instruction start and install process</li>
        <li>????Wrong player buttons and cups</li>
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