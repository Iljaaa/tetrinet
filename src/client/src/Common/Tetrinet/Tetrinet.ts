import {WebGlGame} from "../framework/impl/WebGlGame";

// screens
import {PlayScreen, PlayScreenEventListener} from "./screens/PlayScreen";
import {WatchScreen} from "./screens/WatchScreen";
import {CupState} from "./models/CupState";

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
   * Waiting opponents
   * after this game starts
   */
  prepareToGame (eventListener: PlayScreenEventListener)
  {
    // get current screen
    let scr = this.getCurrentScreen() as PlayScreen;


    if (!scr)
    {
      // we get current screen
      // and if it is not a play screen create new one
      scr = new PlayScreen(this);

      // bind event listener
      scr.setGameEventListener(eventListener)

      // write as current
      this.setScreen(scr);
    }

    // clear sup from previous game
    scr.cleanUpCup();

    // start request
    window.requestAnimationFrame(this.update)
  }
  
  /**
   * Play game
   * the game starts automaticly when we receive the message from socket
   */
  playGame()
  {
    // we get current screen
    // and if it is not a play screen create new one
    // let currentScreen:PlayScreen = new PlayScreen(this);

    // init screen
    // currentScreen.init()
    
    // bind event listener
    // currentScreen.setGameEventListener(eventListener)
    
    // start game
    const s = this.getCurrentScreen() as PlayScreen
    s.startNewGame()
  }
  
  /**
   * Pause game
   */
  pauseGame() {
    const currentScreen:PlayScreen = this.getCurrentScreen() as PlayScreen;
    currentScreen.pause()
  }


  /**
   * Show game
   */
  watchGame()
  {
    console.log ('start watch');
    // let currentScreen:PlayScreen = this.getCurrentScreen() as PlayScreen;
    this.setScreen(new WatchScreen(this))

    // start request
    window.requestAnimationFrame(this.update)
  }

  /**
   *
   * @param cup
   */
  setOpponentCup (cup:CupState)
  {
    const s = this.getCurrentScreen();
    if (s instanceof  PlayScreen) {
      s.setOpponentCup(cup)
    }
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
