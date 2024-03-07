import {Container} from "../../shared/ui/Container/Container";
import React from "react";


export const Todo = () => {
  return <Container>
    <div style={{padding: '0 2rem'}}>
      <h2>Todo:</h2>
      <ul>
        <li>display cup index</li>
        <li>pause in just play mode</li>
        <li>there bug: if we first just play tetris and then click find game </li>
        <li>remove special blocks from just play cup</li>
        <li>bug: if figure to long and it upper than cup, it draw some strange</li>
        <li>pauses limit</li>
        <li>when some one live or lost connection check end of the game</li>
        <li>when some one live or lost connection write on cup suck information???</li>
        <li>nice preview of cup until game is searching</li>
      </ul>
      <h2>Back log</h2>
      <ul>
        <li>watch</li>
        <li>make party</li>
      </ul>

    </div>
  </Container>
}