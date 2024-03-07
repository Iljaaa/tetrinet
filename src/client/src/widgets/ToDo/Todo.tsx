import {Container} from "../../shared/ui/Container/Container";
import React from "react";


export const Todo = () => {
  return <Container>
    <div style={{padding: '0 2rem'}}>
      <h2>Todo:</h2>
      <ul>
        <li>display cup index</li>
        <li>pause in just play mode</li>
        <li>feed back modal</li>
        <li>there bug: if we first just play tetris and then click find game </li>
        <li>nice help</li>
        <li>remove special blocks from just play cup</li>
        <li>bug: if figure to long and it upper than cup, it drw some strange</li>
        <li>pauses limit</li>
        <li>set nice player name</li>
        <li>nice message when player leave a game and when connection lost</li>
        <li>when some one live or lost connection check end of the game</li>
        <li>when some one live or lost connection write on cup suck information???</li>
        <li>rebalance special blocks</li>
      </ul>
      <h2>Back log</h2>
      <ul>
        <li>watch</li>
        <li>make party</li>
      </ul>

    </div>
  </Container>
}