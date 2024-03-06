import {Container} from "../../shared/ui/Container/Container";
import React from "react";


export const Todo = () => {
  return <Container>
    <div style={{padding: '0 2rem'}}>
      <h2>Todo:</h2>
      <ul>
        <li>drop player when connection is lost</li>
        <li>leave game event and lost connection</li>
        <li>extend block bomb</li>
        <li>bug: when connection is open and you press join previous game leaved</li>
        <li>display cup index</li>
        <li>pause in just play mode</li>
        <li>send in chat with enter</li>
        <li>feed back modal</li>
        <li>there bug: if we first just play tetris and then click find game </li>
        <li>nice help</li>
        <li>remove special blocks from just play cup</li>
        <li>bug: if figure to long and it upper than cup, it drw some strange</li>
        <li>pauses limit</li>
        <li>set nice player name</li>
      </ul>
      <h2>Back log</h2>
      <ul>
        <li>watch</li>
        <li>make party</li>
      </ul>

    </div>
  </Container>
}