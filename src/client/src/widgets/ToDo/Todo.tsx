import {Container} from "../../shared/ui/Container/Container";
import React from "react";

export const Todo = () => {
  return <Container>
    <div style={{padding: '0 2rem'}}>
      <h2>Todo:</h2>
      <ul>
        <li>bug:  Speed does not return after starting a new game until you reboot</li>
        <li>nice preview of cup until game is searching</li>
        <li>optimize CupRenderer2.setCupSize</li>
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