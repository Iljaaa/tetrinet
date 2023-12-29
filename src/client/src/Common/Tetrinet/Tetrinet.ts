import {WebGlGame} from "../framework/impl/WebGlGame";
import {PlayScreen} from "./PlayScreen";
import {Assets} from "./Assets";

/**
 * Listener of game events
 */
export interface GameEventListener
{
  onLineCleared: (numberOfLines:number) => void
}

export class Tetrinet extends WebGlGame
{
  /**
   * Game event listner
   * @private
   */
  // private eventLitener: GameEventListener|null = null;
  
  constructor() {
    super();
  }
  
  /**
   * @param canvas
   */
  public initGraphic(canvas:HTMLCanvasElement) {
    super.initGraphic(canvas);
  }
  
  /**
   * Start game
   */
  startGame()
  {
    
    this.setScreen((new PlayScreen(this)));
    
    // this is initialization at render, i will back here later
    let s:PlayScreen|null = this.getCurrentScreen() as PlayScreen
    s?.init(Assets.sprite)
    
    // start game
    s?.start()
  }
  
  /**
   * Set event listener to screen
   * @param eventListener
   */
  setGameEventListener(eventListener: GameEventListener) {
    let s:PlayScreen|null = this.getCurrentScreen() as PlayScreen
    s?.setGameEventListener(eventListener)
  }
}
