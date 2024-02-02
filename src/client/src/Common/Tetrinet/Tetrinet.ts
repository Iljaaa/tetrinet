import {WebGlGame} from "../framework/impl/WebGlGame";

// screens
import {PlayScreen, PlayScreenEventListener} from "./screens/PlayScreen";
import {WatchScreen} from "./screens/WatchScreen";

export class Tetrinet extends WebGlGame
{
  
  // if it comments al stop working
  constructor() {
    super();
  }
  
  /**
   * Through init graphycs method
   * @param canvas
   */
  public initGraphic(canvas:HTMLCanvasElement) {
    super.initGraphic(canvas);
  }
  
  /**
   * Show game
   */
  watchGame()
  {
    console.log ('start watch');
    let currentScreen:PlayScreen = this.getCurrentScreen() as PlayScreen;
  }
  
  /**
   * Play game
   */
  playGame(eventListener: PlayScreenEventListener)
  {
    // we get current screen
    // and if it is not a play screen create new one
    let currentScreen:PlayScreen = this.getCurrentScreen() as PlayScreen;
    if (currentScreen === null)
    {
      currentScreen = new PlayScreen(this);
      
      // init screen
      currentScreen.init()
      
      // bind event listener
      currentScreen.setGameEventListener(eventListener)
      
      // write as current
      this.setScreen(currentScreen);
    }
    
    // start game
    currentScreen.start()
    
    // start request
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
  // setGameEventListener(eventListener: PlayScreenEventListener) {
  //   let s:PlayScreen|null = this.getCurrentScreen() as PlayScreen
  //   s?.setGameEventListener(eventListener)
  // }
}
