import {WebGlGame} from "../framework/impl/WebGlGame";
import {PlayScreen, PlayScreenEventListener} from "./screens/PlayScreen";
import {WatchScreen} from "./screens/WatchScreen";
import {Bonus} from "./types/Bonus";
import {CupState} from "./types/CupState";
import {CupsDataCollection} from "../../Canvas";

/**
 * @version 0.1.0
 */
export class Tetrinet extends WebGlGame
{
  
  // if it comments al stop working
  constructor() {
    super();
  }
  
  /**
   * Through init graphics method
   * @param canvas
   */
  // initGraphic(canvas:HTMLCanvasElement) {
  //   super.initGraphic(canvas);
  // }
  
  /**
   * Waiting opponents
   * after this game starts
   */
  prepareToGame (eventListener: PlayScreenEventListener)
  {
    console.log ('Tetrinet.prepareToGame');
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
    // todo: move it to start game
    scr.cleanUpCup();

    // start request
    window.requestAnimationFrame(this.update)
  }
  
  /**
   * Play game
   * the game starts automatically when we receive the message from socket
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
    (this.getCurrentScreen() as PlayScreen)?.startNewGame()
  }
  
  /**
   * Pause game
   */
  pauseGame() {
    (this.getCurrentScreen() as PlayScreen)?.pause();
  }

  /**
   * Resume paused game
   */
  resumeGame(){
    (this.getCurrentScreen() as PlayScreen)?.resume();
  }

  /**
   * Set game over
   */
  setGameOver() {
    (this.getCurrentScreen() as PlayScreen)?.gameOver();
  }

  /**
   * @param countLineToAdd
   */
  addRowsToCup(countLineToAdd:number) {
    (this.getCurrentScreen() as PlayScreen)?.addRows(countLineToAdd);
  }

  /**
   * @param bonus
   */
  realiseBonus(bonus:Bonus)  {
    (this.getCurrentScreen() as PlayScreen)?.realiseBonus(bonus)
  }

  /**
   * Show game
   */
  watchGame()
  {
    // let currentScreen:PlayScreen = this.getCurrentScreen() as PlayScreen;
    this.setScreen(new WatchScreen(this))

    // start request
    window.requestAnimationFrame(this.update)
  }

  setCupState (state:CupState){
    (this.getCurrentScreen() as PlayScreen)?.setCupState(state)
  }

  /*
   * this method update opponent cup
   * @param cup
   */
  // setOpponentCup (cup:CupData) {
  //   (this.getCurrentScreen() as PlayScreen)?.setOpponentCup(cup)
  // }

  /**
   * this method update opponent cup
   * @param data
   */
  updateCups (data:CupsDataCollection) {
    (this.getCurrentScreen() as PlayScreen)?.updateCups(data)
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
