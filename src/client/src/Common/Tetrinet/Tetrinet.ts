import {WebGlGame} from "../framework/impl/WebGlGame";
import {PlayScreen} from "./PlayScreen";

/**
 * Listener of game events
 */
export interface GameEventListener
{
  onLineCleared: (numberOfLines:number) => void
}

export class Tetrinet extends WebGlGame
{
  
  constructor() {
    super();
  }
  
  /**
   * Throw init graphycs
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
    // we get current screen
    // and if it is not a play screen create new one
    let currentScreen:PlayScreen = this.getCurrentScreen() as PlayScreen;
    console.log (currentScreen, 'currentScreen')
    if (currentScreen === null)
    {
      currentScreen = new PlayScreen(this);
      
      // init screen
      currentScreen.init()
      
      this.setScreen(currentScreen);
    }
    
    // start game
    currentScreen.start()
    
    // start start request
    window.requestAnimationFrame(this.update)
  }
  
  /**
   * Pause game
   */
  pauseGame() {
    const currentScreen:PlayScreen = this.getCurrentScreen() as PlayScreen;
    currentScreen.pause()
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
