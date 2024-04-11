import {WebGlScreen} from "../../framework/impl/WebGlScreen";
import {Tetrinet} from "../Tetrinet";
import {WebGlProgramManager} from "../../framework/impl/WebGlProgramManager";
import {CupRenderer2, CupSize} from "../CupRenderer2";

import {CupWithFigure} from "../models/CupWithFigure";
import {CupWithFigureImpl} from "../models/CupWithFigureImpl";
import {GenerateNewFigure} from "../process/GenerateNewFigure";
import {GenerateRandomColor} from "../process/GenerateRandomColor";
import {CupState} from "../types/CupState";
import {Assets} from "../Assets";
import {PlayScreenTexts} from "../textures/PlayScreenTexts";
import {GameState} from "../types";
import {Vertices} from "../../framework/Vertices";
import {CupEventListener} from "../models/CupImpl";
import {WorkerEventListener, WorkerSingleton} from "../../WorkerSingleton";

/**
 * Count lines that we should clear to next level
 */
const linesToNextLevel:number = 2;

/**
 * Max level of speed
 */
const maxSpeed = 15;

/**
 * Minimal delay to drop down
 */
const minimalDelay = 200;

/**
 * @version 0.0.2
 */
export class JustPlayScreen extends WebGlScreen implements CupEventListener, WorkerEventListener
{

  /**
   * Here we use only two states
   * pause and running
   * @private
   */
  private _state: GameState  = GameState.running;

  /**
   * Cup object
   * @private
   */
  private readonly _cup: CupWithFigure;
  
  /**
   * Render
   * @private
   */
  private readonly _cupRenderer: CupRenderer2 | null = null;

  /**
   * Texture with text and player names
   * @private
   */
  private textTexture: PlayScreenTexts;

  /**
   * Count line to speedup
   * @private
   */
  private _linesToSpeedup:number = linesToNextLevel;

  /**
   * Vertices for pause block
   * @private
   */
  private _pauseTextVertices: Vertices;

  /**
   * In this constructor we create cup
   */
  constructor(game:Tetrinet)
  {
    super(game)

    // this._block = new Vertices(false, true);
    
    // create cup object
    this._cup =  new CupWithFigureImpl(this);
    
    // init renderer
    this._cupRenderer  = new CupRenderer2(game.getGLGraphics(), this._cup.getWidthInCells(), this._cup.getHeightInCells())

    // bind this to input listener
    this.game.getInput().setListener(this);

    // init texture programm
    const gl = this.game.getGLGraphics().getGl();
    WebGlProgramManager.sUseTextureProgram(gl);

    // init texture
    Assets.sprite.init(gl, gl.TEXTURE0)

    // texture with texts
    this.textTexture = new PlayScreenTexts();
    this.textTexture.render();
    this.textTexture.init(gl, gl.TEXTURE1)

    // this.initExperimentalTexture (gl)

    // init experimantal texture
    // this._experimentalTexture = new Experimental(300, 150);
    // this._experimentalTexture.init(gl, gl.TEXTURE1);

    this._pauseTextVertices = new Vertices();
    this._pauseTextVertices.setVertices(Vertices.createTextureVerticesArray(
      30, 100, 260, 64,
      20, PlayScreenTexts.pauseTopPosition, 260, PlayScreenTexts.lineHeight
    ));

    // set timer listener
    WorkerSingleton.setListener(this)

    //
    // this.startNewGame ()
  }

  startNewGame ()
  {
    //
    this._cup.cleanBeforeNewGame();

    //
    this._cup.setState(CupState.online)

    // create new figure
    const f = GenerateNewFigure(this._cup, GenerateRandomColor());
    this._cup.setFigureToDropPoint(f);

    // generate new next figure
    this._cup.generateNextFigure()

    // finally set run status
    this.setGameRunning()

    //
    this._cup.resetSpeed();

    // start drop timer
    WorkerSingleton.startTimer()
  }
  
  /**
   * Update cup
   * @param deltaTime
   */
  update (deltaTime:number):void
  {
    // if (this._state === GameState.running){
    //   this._cup.updateFigureDownTimer(deltaTime);
    // }
  }
  
  present(): void
  {
    const gl = this.game.getGLGraphics().getGl();

    // Clear the screen.
    gl.clear(gl.COLOR_BUFFER_BIT)

    Assets.sprite.bind(gl)

    // render cup
    WebGlProgramManager.setUpIntoTextureProgramTranslation(gl, 232, 32);
    this._cupRenderer?.setCupSize(CupSize.normal32);
    this._cupRenderer?.renderCupWithFigure(this._cup, this.textTexture);

    // render next figure
    WebGlProgramManager.setUpIntoTextureProgramTranslation(gl, 570, 32)
    this.presentNextFigure(gl);

    // render test text
    // this.presentExperiment(gl)

    if (this._state === GameState.paused){
      this.presentPaused(gl);
    }
  }

  /**
   * Draw next figure
   * @param gl
   * @private
   */
  private presentNextFigure(gl: WebGL2RenderingContext)
  {
    // const nextFigure = this._cup.getNextFigure();
    // if (!nextFigure) return

    //
    this._cupRenderer?.renderNextFigure(gl, this._cup.getNextFigure())
  }

  private presentPaused (gl: WebGL2RenderingContext)
  {
    this.textTexture.bind(gl)
    // WebGlProgramManager.setUpIntoTextureProgramImageSize(gl, this.textTexture.getWidth(), this.textTexture.getHeight());
    WebGlProgramManager.setUpIntoTextureProgramTranslation(gl, 232, 32);


    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._pauseTextVertices.vertices), gl.STATIC_DRAW)
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  setGameRunning()
  {
    this._state = GameState.running
  }

  onFigureDrop(): void {
    WorkerSingleton.resetTimer()
  }

  onFigureMovedToCup(): void {
    // when cup became to game over we should stop timer
    if (this._cup.getState() === CupState.over) {
      WorkerSingleton.stopTimer();
    }
  }

  onLineCleared(clearData: { countLines: number; bonuses: Array<number> }): void
  {
    console.info("line(s) cleared", clearData.countLines)

    // calculate speed up
    this._linesToSpeedup -= clearData.countLines
    if (this._linesToSpeedup <= 0)
    {

      // increase speed
      this._cup.increaseSpeed();

      //
      let newSpeed = this._cup.getSpeed();

      if (newSpeed > maxSpeed) newSpeed = maxSpeed

      let newDelay = (600 -  (newSpeed / maxSpeed) * 600) + 200;
      if (newDelay < minimalDelay) newDelay = minimalDelay;

      console.info ('set new speed and delay', newSpeed, newDelay)

      // reset lines count to nex level
      this._linesToSpeedup = linesToNextLevel

      WorkerSingleton.setDelay(newDelay)
    }
  }

  /**
   * Event from worker, that this id time to drop line
   */
  onTickDown(): void {
    if (this._state === GameState.running) {
      this._cup.moveFigureDown();
    }
  }

  pauseOrResume ()
  {
    if (this._state === GameState.running){
      this._state = GameState.paused
    }
    else if (this._state === GameState.paused){
      this._state = GameState.running
    }
  }

  /**
   * @param code
   */
  onKeyDown(code:string): void
  {
    switch (code) {
      case "KeyP": this.pauseOrResume(); break;
      case "KeyD": this.onRight(); break;
      case "KeyA": this.onLeft(); break;
      case "KeyQ": this.onRotateCounterClockwise(); break;
      case "KeyE": this.onRotateClockwise(); break;
      case "KeyS": this.onDown(); break;
      case "Space": this.onDrop(); break;
      // case "Backquote": this.sendBonusToMe(); break;
      // case "Digit1": this.sendBonusToOpponent(1); break;
      // case "Digit2": this.sendBonusToOpponent(2); break;
      // case "Digit3": this.sendBonusToOpponent(3); break;
      // case "Digit4": this.sendBonusToOpponent(4); break;
      // case "Digit5": this.sendBonusToOpponent(5); break;
      // case "Digit6": this.sendBonusToOpponent(6); break;
      // case "Digit7": this.sendBonusToOpponent(7); break;
      // case "Digit8": this.sendBonusToOpponent(8); break;
      // case "Digit9": this.sendBonusToOpponent(9); break;
    }
  }

  onKeyUp(code:string): void {

  }

  onRight(){
    if (this._state === GameState.running) {
      this._cup.moveFigureRight();
    }
  }

  onLeft() {
    if (this._state === GameState.running) {
      this._cup.moveFigureLeft();
    }
  }

  /**
   * Down figure
   */
  onDown(){
    if (this._state === GameState.running) {
      this._cup.moveFigureDown();
    }
  }

  /**
   * Drop it almost as down but to the bottom
   */
  onDrop(){
    if (this._state === GameState.running) {
      this._cup.dropFigureDown();
    }
  }

  onRotateClockwise (){
    if (this._state === GameState.running) {
      this._cup.rotateClockwise();
    }
  }

  onRotateCounterClockwise (){
    if (this._state === GameState.running) {
      this._cup.rotateCounterClockwise();
    }
  }
  
}
