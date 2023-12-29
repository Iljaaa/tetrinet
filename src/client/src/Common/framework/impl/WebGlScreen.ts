import {GameScreen} from "../interfaces/GameScreen";
import {WebGlGame} from "./WebGlGame";

/**
 * @version 0.0.1
 */
export abstract class WebGlScreen implements GameScreen
{
  protected game: WebGlGame;
  
  protected constructor(game:WebGlGame) {
    this.game = game;
  }
  
  present(): void {
  }
  
  update(deltaTime: number): void {
  }
}
