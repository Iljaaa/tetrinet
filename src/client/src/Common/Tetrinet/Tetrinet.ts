import {WebGlGame} from "../framework/impl/WebGlGame";
import {PlayScreen, PlayScreenEventListener} from "./screens/PlayScreen";
import {WatchScreen} from "./screens/WatchScreen";
import {CupState} from "./types/CupState";
import {CupsDataCollection} from "../../widgets/Canvas/Canvas";
import {GetBonusMessage} from "./types/messages/GetBonusMessage";
import {Cup} from "./models/Cup";
import {JustPlayScreen} from "./screens/JustPlayScreen";
import {TetrinetEventListener} from "../TetrinetNetworkLayer";
import {GameState} from "./types";

/**
 * @version 0.1.0
 */
export class Tetrinet extends WebGlGame
{

  /**
   * Flag that window.requestAnimationFrame(this.update)
   * already was called
   */
  private isAnimationRequested:boolean = false

  /**
   * Listener of tetrinet events
   */
  protected _gameDataEventListener:TetrinetEventListener | undefined = undefined
  
  // if it comments al stop working
  constructor() {
    super();
  }

  /**
   * Listener of game events
   * @param listener
   */
  setGameDataEventListener(listener: TetrinetEventListener) {
    this._gameDataEventListener = listener
  }

  /**
   * Just play tetris
   * without opponents and external connection
   */
  justPlayTetris ()
  {
    let scr = this.getCurrentScreen();

    if (!scr || !(scr instanceof JustPlayScreen)) {
      scr = new JustPlayScreen(this)
      this.setScreen(scr)
    }

    // we start new game
    (scr as JustPlayScreen).startNewGame();

    // start animation
    if (!this.isAnimationRequested) {
      this.isAnimationRequested = true
      window.requestAnimationFrame(this.update)
    }
  }

  /**
   * Waiting opponents
   * initCup: cup with start condition
   * after this game starts
   */
  prepareToGame (eventListener: PlayScreenEventListener, initCup:Cup|null = null)
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
    // scr.cleanUpCup();

    // start request
    if (!this.isAnimationRequested) {
      this.isAnimationRequested = true
      window.requestAnimationFrame(this.update)
    }

  }
  
  /**
   * Play game
   * the game starts automatically when we receive the message from socket
   */
  playGame() {
    // start game
    (this.getCurrentScreen() as PlayScreen)?.startNewGame()
  }
  
  /**
   * After receive pause message from server
   */
  protected processSetPause()
  {
    // pause game
    (this.getCurrentScreen() as PlayScreen)?.pause();

    //
    this._gameDataEventListener?.onGameStateChange(GameState.paused)
  }

  /**
   * Resume paused game
   */
  processResumeGame()
  {
    //
    (this.getCurrentScreen() as PlayScreen)?.resume();

    //
    this._gameDataEventListener?.onGameStateChange(GameState.running)
  }

  /**
   * Set game over
   */
  setGameOver()
  {
    // throw game over in the cup
    (this.getCurrentScreen() as PlayScreen)?.gameOver();
  }

  /**
   * @param countLineToAdd
   */
  addRowsToCup(countLineToAdd:number) {
    (this.getCurrentScreen() as PlayScreen)?.addRows(countLineToAdd);
  }

  /**
   * Process bonus from request
   * @param data
   */
  protected processGetBonusMessage(data:GetBonusMessage) {
    (this.getCurrentScreen() as PlayScreen)?.realiseBonus(data.bonus, data)
  }

  /**
   * Show game
   */
  watchGame()
  {
    // let currentScreen:PlayScreen = this.getCurrentScreen() as PlayScreen;
    this.setScreen(new WatchScreen(this))

    // start request
    if (!this.isAnimationRequested) {
      this.isAnimationRequested = true
      window.requestAnimationFrame(this.update)
    }
  }

  setCupState (state:CupState){
    (this.getCurrentScreen() as PlayScreen)?.setCupState(state)
  }

  /**
   * this method update opponent cup
   * @param data
   */
  updateCups (data:CupsDataCollection) {
    (this.getCurrentScreen() as PlayScreen)?.updateCups(data)
  }

}
