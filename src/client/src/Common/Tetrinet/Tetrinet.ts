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
import {GamePartyType} from "./types/GamePartyType";

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
   * @deprecated
   * Listener of tetrinet events
   */
  protected _gameDataEventListener:TetrinetEventListener | undefined = undefined

  /**
   * this callback for buttons search
   */
  protected _onStateChangeForButton?:(gameState:GameState) => void
  
  // if it comments all stop working
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
   *
   */
  setOnGameStateChangeForButtons (f:(gameState:GameState) => void){
    this._onStateChangeForButton = f;
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
  prepareToGame (eventListener: PlayScreenEventListener, partyType:GamePartyType, initCup:Cup|null = null)
  {
    // get current screen
    let scr = this.getCurrentScreen() as PlayScreen;

    if (!scr)
    {
      // we get current screen
      // and if it is not a play screen create new one
      scr = new PlayScreen(this, (newGameSate:GameState) =>
      {
        // trow trough change status event
        this._gameDataEventListener?.onGameStateChange(newGameSate)
        if (this._onStateChangeForButton) this._onStateChangeForButton(newGameSate)
      });

      // bind event listener
      scr.setGameEventListener(eventListener)

      // write as current
      this.setScreen(scr);
    }

    scr.setPartyType(partyType)

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
    // this._gameDataEventListener?.onGameStateChange(GameState.paused)
  }

  /**
   * Resume paused game
   */
  processResumeGame()
  {
    //
    (this.getCurrentScreen() as PlayScreen)?.resume();

    //
    // this._gameDataEventListener?.onGameStateChange(GameState.running)
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
   * this method update opponents cup
   * @param data
   */
  updateCups (data:CupsDataCollection)
  {
    const s =  this.getCurrentScreen()
    if (s && s instanceof PlayScreen) {
      s.updateCups(data)
    }
  }

  enableInput ()
  {
    // bind this to input listener
    const s = this.getCurrentScreen()
    // this is shit
    if (s && (s instanceof PlayScreen || s instanceof JustPlayScreen)) {
      this.getInput().setListener(s);
    }
  }

  disableInput (){
    this.getInput().clearListener()
  }


}
