import {CupWithFigureImpl} from "../models/CupWithFigureImpl";
import {WebGlScreen} from "../../framework/impl/WebGlScreen";
import {Tetrinet} from "../Tetrinet";
import {WebInputEventListener} from "../../framework/impl/WebInput";
import {Vertices} from "../../framework/Vertices";
import {WebGlProgramManager} from "../../framework/impl/WebGlProgramManager";

// import {CupRenderer} from "./CupRenderer";
import {CupRenderer2, CupSize} from "../CupRenderer2";

import {Coords} from "../math/Coords";
import {CupData} from "../models/CupData";
import {CupEventListener, CupImpl} from "../models/CupImpl";
import {GenerateRandomColor} from "../process/GenerateRandomColor";

import {GameState, RequestTypes} from "../types";
import {CupState} from "../types/CupState";
import {Bonus} from "../types/Bonus";

import {Cup} from "../models/Cup";
import {CupsDataCollection} from "../../../widgets/Canvas/Canvas";
import {SpecialBG} from "../textures/SpecialBG";
import {Field} from "../models/Field";
import {GetBonusMessage} from "../types/messages/GetBonusMessage";
import {GetSwitchBonusMessage} from "../types/messages/GetSwitchBonusMessage";
import {GenerateNewFigure} from "../process/GenerateNewFigure";
import {CupWithFigure} from "../models/CupWithFigure";
import {PauseRequest, ResumeRequest} from "../types/requests";
import {SocketSingleton} from "../../SocketSingleton";
import {TetrinetSingleton} from "../../TetrinetSingleton";
import {SendBonusRequest} from "../types/requests/SendBonusRequest";
import {GamePartyType} from "../types/GamePartyType";
import {Assets} from "../Assets";
import {OpponentsHelper} from "../../heplers/OpponentsHelper";
import {PlayScreenTexts} from "../textures/PlayScreenTexts";
import {WorkerEventListener, WorkerSingleton} from "../../WorkerSingleton";


/**
 * @deprecated
 * todo: for schore we shold use redux
 * todo: and other function we should move to play screen
 * Listener of game events
 */
export interface PlayScreenEventListener
{
  /**
   * When line is cleared
   * @param numberOfLines
   */
  // onLineCleared: (numberOfLines:number) => void

  /**
   * score update
   */
  onScoreChanged: (newScore:number) => void

  /**
   * Send bonus to some one
   */
  // onSendBonusToOpponent: (bonus:Bonus, opponentIndex:number) => void,
  
  /**
   * Summary event risen when cup data changed
   */
  onCupUpdated: (state:GameState, cupState:CupData) => void
}

/**
 * Cups collection
 */  // onSendBonusToOpponent (bonus:Bonus, opponentIndex:number)
  // {
  //
  //   // try to fine opponent socket id in the party
  //   const targetPlayerId = this.partyIndexToPlayerId[opponentIndex]
  //
  //   // when opponent not found
  //   if (!targetPlayerId) return;
  //
  //   // send command
  //   const data:SendBonusRequest = {
  //     type: RequestTypes.sendBonus,
  //     partyId: this._partyId,
  //     playerId: this._playerId,
  //     target: targetPlayerId,
  //     bonus: bonus
  //   }
  //
  //   SocketSingleton.getInstance()?.sendData(data)
  // }
export interface CupsCollection {
  [index: string]: Cup
}

interface CupsPositionInterface {
  [index: number]: {x:number, y: number}
}

/**
 * Position of cups for party play
 */
const CupsPosition:CupsPositionInterface = {
  0: {x: 576, y: 32},
  1: {x: 768, y: 32},
  2: {x: 384, y: 384},
  3: {x: 576, y: 384},
  4: {x: 768, y: 384},
}


/**
 * @vaersion 0.0.1
 */
export class PlayScreen extends WebGlScreen implements CupEventListener, WebInputEventListener, WorkerEventListener
{

  /**
   * Current game state
   * @private
   */
  private _state:GameState = GameState.ready;

  /**
   * Party type
   * @private
   */
  private _partyType:GamePartyType = GamePartyType.duel;

  /**
   * Current game score
   */
  private _score:number = 0

  /**
   * Cup object
   */
  private readonly _cup: CupWithFigure;

  /**
   * this is opponent cup
   * for temp test
   * @private
   */
  private _cups: CupsCollection

  /**
   * Render
   * @private
   */
  private readonly _cupRenderer: CupRenderer2 | null = null;
  
  /**
   * Position of left bottom point of next figure
   * @private
   */
  private nextFigurePosition:Coords = new Coords(370, 32);
  
  /**
   * @private
   */
  private listener: PlayScreenEventListener|undefined;

  /**
   * Your bonunses
   * @private
   */
  private playerBonuses: Array<Bonus> = [
    // Bonus.add, Bonus.add, Bonus.clear, Bonus.clear,
    // Bonus.gravity, Bonus.gravity,
    // Bonus.switch, Bonus.switch,
    // Bonus.quake,
    // Bonus.bomb, Bonus.bomb, Bonus.bomb,
    // Bonus.randomClear,Bonus.randomClear,Bonus.randomClear,
    // Bonus.clearSpecials, // Bonus.clear,Bonus.clear
  ];

  /**
   * Temp field for draw fields
   * @private
   */
  private _block: Vertices;

  /**
   * Pause text
   * @private
   */
  private _pauseTextVertices: Vertices;

  /**
   * Ready text
   * @private
   */
  private _readyTextVertices: Vertices;

  /**
   * Position of player cup
   */
  private mainCupPosition = {
    x: 32,
    y: 32,
  }

  /**
   * Text vertical position
   */
  private textsTopPosition = 100;

  /**
   * Texture with text and player names
   * @private
   */
  private textTexture: PlayScreenTexts;

  /**
   * Callback about change game state
   * @private
   */
  private _onStateChangeCallback?: (newGameState:GameState) => void
  /**
   * In this constructor we create cup
   */
  constructor(game:Tetrinet, onChangeGameStateCallback: (newGameState:GameState) => void)
  {
    super(game)
    console.log ('PlayScreen.constructor');
    
    // create cup object
    this._cup =  new CupWithFigureImpl(this);

    // init cups collection
    this._cups = {}

    // init texture programm
    const gl = this.game.getGLGraphics().getGl();
    WebGlProgramManager.sUseTextureProgram(gl);

    // init texture
    Assets.sprite.init(gl, gl.TEXTURE0)

    // texture with texts
    this.textTexture = new PlayScreenTexts();
    this.textTexture.render([])
    this.textTexture.init(gl, gl.TEXTURE1);

    // init renderer
    this._cupRenderer  = new CupRenderer2(game.getGLGraphics(), this._cup.getWidthInCells(), this._cup.getHeightInCells())

    // in the background we use only texture
    this._block = new Vertices(false, true);
    this._block.setVertices(Vertices.createTextureVerticesArray(
      200, 200, 32, 32,
      0, 0, 200, 200
    ))

    this._pauseTextVertices = new Vertices(false, true);
    this._pauseTextVertices.setVertices(Vertices.createTextureVerticesArray(
      30, this.textsTopPosition, 260, 64,
      20, PlayScreenTexts.pauseTopPosition, 260, PlayScreenTexts.lineHeight
    ))

    // todo: ready is not seraching game
    this._readyTextVertices = new Vertices(false, true);
    this._readyTextVertices.setVertices(Vertices.createTextureVerticesArray(
      30, this.textsTopPosition, 260, 64,
      // SearchForAGame.texX, SearchForAGame.texY, SearchForAGame.texWidth, SearchForAGame.texHeight
      20, 0, 260, PlayScreenTexts.lineHeight
    ))

    // save game status change callback
    this._onStateChangeCallback = onChangeGameStateCallback

    // bind this to input listener
    this.game.getInput().setListener(this);

    // set timer listener
    WorkerSingleton.setListener(this)

    // check lost and get window focus
    window.addEventListener('blur', this.onWindowBlur);
    // window.addEventListener('focus', this.onWindowFocus);
  }

  destroy() {
    window.removeEventListener('blur', this.onWindowBlur);
    // window.removeEventListener('focus', this.onWindowFocus);
  }

  private onWindowBlur = () => {
    if (this._state === GameState.running) {
      this.sendPauseRequest('window lost focus')
    }
  }

  // private onWindowFocus = () => {
  //   if (this._state === GameState.paused) {
  //     this.sendResumeRequest('Focus resumed to window')
  //   }
  // }
  
  /**
   * Set event listener
   * @param listener
   */
  public setGameEventListener (listener:PlayScreenEventListener):PlayScreen{
    this.listener = listener;
    return this
  }

  setPartyType(value: GamePartyType): PlayScreen {
    this._partyType = value;
    return this;
  }

  clearDataBeforeNewGame ()
  {
    this._state = GameState.waiting

    // clear cups
    this._cup.cleanBeforeNewGame();

    // clear opponents
    this._cups = {};

    // clear bonuses
    this.playerBonuses = [];
  }

  /**
   * It starts the game
   * must be called after init!
   */
  startNewGame ()
  {
    // first render
    // this._cupRenderer.renderCupWithFigure(this._cup)
    console.log('PlayScreen.startNewGame')

    // generate text texture
    const gl = this.game.getGLGraphics().getGl();

    // render texture and player names
    this.textTexture.render(OpponentsHelper.getOpponentsArray())
    this.textTexture.init(gl, gl.TEXTURE1);

    // next figure random color
    // this._nextFigure = GenerateNewFigure(this._cup, GenerateRandomColor());
    this._cup.generateNextFigure();
    
    // next figure random color
    // this._nextFigureColor = GenerateRandomColor();

    // generate new figure in cup
    const f = GenerateNewFigure(this._cup, GenerateRandomColor());
    this._cup.setFigureToDropPoint(f);

    // finally set run status
    this.setGameRunning()

    // start drop timer
    WorkerSingleton.startTimer()
    
    // call first callback
    // I'm not sure that it need to be here
    this.listener?.onCupUpdated(this._state, this._cup.getData())
  }

  /**
   * Pause or resume
   */
  pauseOrResume ()
  {
    if (this._state === GameState.running){
      this.sendPauseRequest ()
    }

    if (this._state === GameState.paused){
      this.sendResumeRequest()
    }
  }

  /**
   * Send pause request
   * @param intent
   */
  private sendPauseRequest (intent?:string)
  {
    // request data
    const request:PauseRequest = {
      type: RequestTypes.pause,
      partyId: TetrinetSingleton.getInstance().getPartyId(),
      playerId: TetrinetSingleton.getInstance().getPlayerId(),
    }

    if (intent) request.intent = intent

    // send data
    SocketSingleton.getInstance()?.sendData(request);
  }

  /**
   * Send resume request
   */
  private sendResumeRequest (intent?:string)
  {
    console.log('onResumeRequest')
    // request data
    const request:ResumeRequest = {
      type: RequestTypes.resume,
      partyId: TetrinetSingleton.getInstance().getPartyId(),
      playerId: TetrinetSingleton.getInstance().getPlayerId(),
    }

    if (intent) request.intent = intent

    // send data
    SocketSingleton.getInstance()?.sendData(request);
  }

  /**
   * Pause running game
   */
  pause (){
    if (this._state !== GameState.running) return;
    this._state = GameState.paused

    WorkerSingleton.pauseTimer()

    // rise callback
    if (this._onStateChangeCallback) this._onStateChangeCallback(this._state)
  }

  /**
   * Resume paused game
   */
  resume (){
    // is game not on the pause
    if (this._state !== GameState.paused) return;
    this._state = GameState.running

    WorkerSingleton.resumeTimer()

    // rise callback
    if (this._onStateChangeCallback) this._onStateChangeCallback(this._state)
  }

  gameOver() {
    this._state = GameState.over;
    if (this._onStateChangeCallback) this._onStateChangeCallback(this._state)
  }

  /**
   * Set game running state
   */
  setGameRunning()
  {
    this._state = GameState.running
    if (this._onStateChangeCallback) this._onStateChangeCallback(this._state)
  }

  setGameSearching(){
    this._state = GameState.searching
    if (this._onStateChangeCallback) this._onStateChangeCallback(this._state)
  }

  setGameWaiting(){
    this._state = GameState.waiting
    if (this._onStateChangeCallback) this._onStateChangeCallback(this._state)
  }

  /**
   * We add empty row on bottom
   */
  addRows(countLines:number, sendState: boolean = true)
  {
    // add lines
    this.addRandomRowBellow(countLines);

    // rise update state callback
    if (sendState && this.listener) {
      this.listener.onCupUpdated(this._state, this._cup.getData())
    }
  }

  /**
   * Remove rows
   */
  private clearRows(countLines:number, sendState: boolean = true)
  {
    // add lines
    this.removeRowsBellow(countLines);

    // rise update state callback
    if (sendState && this.listener) {
      this.listener.onCupUpdated(this._state, this._cup.getData())
    }
  }

  /**
   * update our cuo state
   * @param state
   */
  setCupState(state:CupState){
    this._cup.setState(state)
  }

  /*getGameState(): GameState {
    return this._state;
  }*/

  /**
   * Update opponents cups,
   * here already filtered opponent cup
   * @param data
   */
  updateCups (data:CupsDataCollection)
  {
    Object.keys(data).forEach((playerId:string) =>
    {
      // if cup not exists we are create new
      if (!this._cups[playerId]) this._cups[playerId] = new CupImpl();

      const cd = data[playerId]
      this._cups[playerId].setFields(cd.fields)
      this._cups[playerId].setState(cd.state)
    })
  }
  
  /**
   * Update cup
   * @param deltaTime
   */
  update (deltaTime:number):void
  {
    if (this._state === GameState.running) {
      this._updateRunning(deltaTime);
    }
    // else if (this._state === GameState.over) {
    //   // this.updatePaused();
    // }
  }
  
  /**
   * @param deltaTime
   * @private
   */
  private _updateRunning(deltaTime:number)
  {

    // this._cup.updateFigureDownTimer(deltaTime);
  }

  /**
   * Event from drop worker
   */
  onTickDown(): void {
    this.moveFigureDown();
  }

  public moveFigureDown (){
    if (this._state === GameState.running) {
      this._cup.moveFigureDown();
    }
  }
  
  present(): void
  {
    //
    const gl = this.game.getGLGraphics().getGl();
    
    // Clear the screen.
    gl.clear(gl.COLOR_BUFFER_BIT)

    // render cup
    WebGlProgramManager.setUpIntoTextureProgramTranslation(gl, 32, 32);
    this._cupRenderer?.setCupSize(CupSize.normal32);
    // this._cupRenderer?.setPosition(32, 32)
    this._cupRenderer?.renderCupWithFigure(this._cup, this.textTexture);

    // bind texture
    Assets.sprite.bind(gl)

    // render next figure
    this.presentNextFigure(gl);

    // render bonus fields
    this.presentUserBonuses(gl)
    
    // render opponents cups
    this.presentOpponentsCups(gl)

    // present interface
    if (this._state === GameState.searching){
      this.presentReady(gl);
    }

    if (this._state === GameState.paused){
      this.presentPaused(gl);
    }

    // this.presentExperiment(gl)
  }

  /**
   * Ready state present
   * @param gl
   * @private
   */
  private presentReady (gl: WebGL2RenderingContext)
  {
    this.textTexture.bind(gl)

    // move position of cup
    WebGlProgramManager.setUpIntoTextureProgramTranslation(gl, this.mainCupPosition.x, this.mainCupPosition.y)

    // calc left position
    // this._cup.getWidthInCells()

    // this._block.setVertices(Vertices.createTextureVerticesArray(
    //     0, this.textsTopPosition, 320, 64,
    //     // 320, 256, 192, 64
    //     SearchForAGame.texX, SearchForAGame.texY, SearchForAGame.texWidth, SearchForAGame.texHeight
    // ))

    // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._block.vertices), gl.STATIC_DRAW)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._readyTextVertices.vertices), gl.STATIC_DRAW)

    // draw here
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  /**
   * Ready state present
   * @param gl
   * @private
   */
  private presentPaused (gl: WebGL2RenderingContext)
  {
    this.textTexture.bind(gl)
    // WebGlProgramManager.setUpIntoTextureProgramImageSize(gl, this.textTexture.getWidth(), this.textTexture.getHeight());
    WebGlProgramManager.setUpIntoTextureProgramTranslation(gl, this.mainCupPosition.x, this.mainCupPosition.y);
    // this._block.setVertices(Vertices.createTextureVerticesArray(
    //   30, this.textsTopPosition, 260, 64,`
    //   20, PlayScreenTexts.pauseTopPosition, 260, PlayScreenTexts.lineHeight
    // ))
    // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._block.vertices), gl.STATIC_DRAW)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._pauseTextVertices.vertices), gl.STATIC_DRAW)
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  private presentOpponentsCups (gl: WebGL2RenderingContext)
  {
    // todo: remove this calculation from present
    const cupSize = (this._partyType === GamePartyType.party) ? CupSize.small16 : CupSize.middle24

    // update cup blocks
    this._cupRenderer?.setCupSize(cupSize)

    Object.keys(this._cups).forEach((playerId:string, index:number) => {
      if (this._cups[playerId])
      {
        // set cup position
        WebGlProgramManager.setUpIntoTextureProgramTranslation(gl, CupsPosition[index].x, CupsPosition[index].y);

        //
        this._cupRenderer?.renderCup(this._cups[playerId], this.textTexture);

        // update player name texture position
        this._cupRenderer?.setPlayerName(cupSize, index, this.textTexture)

        // text height position
        // WebGlProgramManager.setUpIntoTextureProgramTranslation(gl, CupsPosition[index].x, CupsPosition[index].y - this.textTexture.playerLineHeight + 8);

        // render player name
        this._cupRenderer?.renderCupIndex(this.textTexture);
      }
    })
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

    // move position
    WebGlProgramManager.setUpIntoTextureProgramTranslation(gl, this.nextFigurePosition.x, this.nextFigurePosition.y)

    //
    this._cupRenderer?.renderNextFigure(gl, this._cup.getNextFigure())
  }

  /**
   * Render user bonuses
   * @param gl
   * @private
   */
  private presentUserBonuses (gl: WebGL2RenderingContext)
  {

    // move to position
    WebGlProgramManager.setUpIntoTextureProgramTranslation(gl, 32, 685)

    // draw bg
    this._block.setVertices(Vertices.createTextureVerticesArray(
      0, 0, 320, 32,
      SpecialBG.texX, SpecialBG.texY, SpecialBG.texWidth, SpecialBG.texHeight
    ))

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._block.vertices), gl.STATIC_DRAW)
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    // const fields:Array<Array<boolean>> = this._nextFigure.getPreviewFields();

    const BLOCK_SIZE = 32;
    // for (let r = 0; r < rows; r++) {
    this.playerBonuses.forEach((value:number, bonusIndex:number) =>
    {
      const spriteLeft = 320 + value * BLOCK_SIZE;
      const left = bonusIndex * BLOCK_SIZE -2;

      this._block.setVertices(Vertices.createTextureVerticesArray(
          left, -2, BLOCK_SIZE, BLOCK_SIZE,
          spriteLeft, 64, BLOCK_SIZE, BLOCK_SIZE
      ))

      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._block.vertices), gl.STATIC_DRAW)
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    })

  }


  // private presentExperiment (gl: WebGL2RenderingContext)
  // {
  //   // gl.activeTexture(1)
  //   // gl.bindTexture(gl.TEXTURE_2D, this.canvasTexture);
  //   this.textTexture.bind(gl)
  //   WebGlProgramManager.setUpIntoTextureProgramImageSize(gl, 300, 150);
  //
  //   // move to start
  //   WebGlProgramManager.setUpIntoTextureProgramTranslation(gl, this.mainCupPosition.x, this.mainCupPosition.y);
  //
  //
  //   this._block.setVertices(Vertices.createTextureVerticesArray(
  //     30, this.textsTopPosition, 260, 64,
  //     20, 0, 260, 64
  //   ))
  //
  //   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._block.vertices), gl.STATIC_DRAW)
  //   gl.drawArrays(gl.TRIANGLES, 0, 6);
  //
  //   // this._block.setVertices(Vertices.createTextureVerticesArray(
  //   //   0, 300, 300, 64,
  //   //   0, 0, 300, 64
  //   // ))
  //   // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._block.vertices), gl.STATIC_DRAW)
  //   // gl.drawArrays(gl.TRIANGLES, 0, 6);
  // }
  
  //
  // key events
  //



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
      case "Backquote": this.sendBonusToMe(); break;
      case "Digit1": this.sendBonusToOpponent(1); break;
      case "Digit2": this.sendBonusToOpponent(2); break;
      case "Digit3": this.sendBonusToOpponent(3); break;
      case "Digit4": this.sendBonusToOpponent(4); break;
      case "Digit5": this.sendBonusToOpponent(5); break;
      case "Digit6": this.sendBonusToOpponent(6); break;
      case "Digit7": this.sendBonusToOpponent(7); break;
      case "Digit8": this.sendBonusToOpponent(8); break;
      case "Digit9": this.sendBonusToOpponent(9); break;
    }
  }
  
  onKeyUp(code:string): void {
  
  }
  
  onRight()
  {
    // disable control if game is not running
    // if (this._state !== GameState.running) return
    if (!this.isControlOnline()) return
  
    // move figure right
    if (this._cup.moveFigureRight()){
    
    }
    
    // rerender cup
    // maybe it must be inside cause upper
    // if (this._cupRenderer){
    //   this._cupRenderer.renderCupWithFigure(this._cup, this.textTexture)
    // }
    
  }
  
  onLeft()
  {
    // disable control if game is not running
    // if (this._state !== GameState.running) return
    if (!this.isControlOnline()) return
    
    // move figure
    if (this._cup.moveFigureLeft()) {
    
    }
    
    // rerender cup
    // maybe it must be inside cause upper
    // if (this._cupRenderer){
    //   this._cupRenderer.renderCupWithFigure(this._cup, this.textTexture)
    // }
  }
  
  /**
   * Down figure
   */
  onDown()
  {
    // disable control if game is not running
    // if (this._state !== GameState.running) return
    if (!this.isControlOnline()) return

    // rerender cup
    // maybe it must be inside cause upper
    if (!this._cup.moveFigureDown()) {
    
    }
    
    // rerender cup
    // maybe it must be inside cause upper
    // if (this._cupRenderer){
    //   this._cupRenderer.renderCupWithFigure(this._cup, this.textTexture)
    // }
  }
  
  /**
   * Drop it almost as down but to the bottom
   */
  onDrop()
  {
    // disable control if game is not running
    // if (this._state !== GameState.running) return
    if (!this.isControlOnline()) return
    
    // if figure does not have not moved we need to create a new one
    if (!this._cup.dropFigureDown())
    {
      // clear next the down step time
      // this._downTimer = 0;
    }
    
    // rerender cup
    // maybe it must be inside cause upper
    // if (this._cupRenderer){
    //   this._cupRenderer.renderCupWithFigure(this._cup, this.textTexture)
    // }
  }
  
  /**
   */
  onRotateClockwise ()
  {
    // disable control if game is not running
    // if (this._state !== GameState.running) return
    if (!this.isControlOnline()) return
    
    // rotate figure in the cup
    if (this._cup.rotateClockwise()){
    
    }
    
    // rerender cup
    // maybe it must be inside cause upper
    // if (this._cupRenderer){
    //   this._cupRenderer.renderCupWithFigure(this._cup, this.textTexture)
    // }
  }
  
  /**
   *
   */
  onRotateCounterClockwise ()
  {
    // disable control if game is not running
    // if (this._state !== GameState.running) return
    if (!this.isControlOnline()) return
    
    // rotate figure in the cup
    if (this._cup.rotateCounterClockwise()){
    
    }
    
    // rerender cup
    // maybe it must be inside cause upper
    // if (this._cupRenderer){
    //   this._cupRenderer.renderCupWithFigure(this._cup, this.textTexture)
    // }
  }

  /**
   * Is your control online
   * @private
   */
  private isControlOnline ():boolean {
    return this._state === GameState.running && this._cup.getState() === CupState.online
  }

  /**
   *
   */
  private sendBonusToMe ()
  {
    if (this.playerBonuses.length === 0) return;
    if (this._state !== GameState.running) return;

    // check our cup state
    if (this._cup.getState() !== CupState.online) return;

    const firstBonus:Bonus|undefined = this.playerBonuses.shift();
    if (firstBonus === undefined) return;

    // ignore switch bonus
    if (firstBonus === Bonus.switch) return;

    this.realiseBonus(firstBonus)
  }

  /**
   * We send surprise to opponent
   * @private
   */
  private sendBonusToOpponent (indexOfOpponent:number)
  {
    if (this.playerBonuses.length === 0) return;
    if (this._state !== GameState.running) return;

    // check is opponent live
    // const targetPlayerId = TetrinetSingleton.getInstance().getPlayerIdByIndexInParty(indexOfOpponent)
    const targetPlayerId = OpponentsHelper.getPlayerIdByIndexInParty(indexOfOpponent)
    if (!targetPlayerId) return;

    // check target cup and state
    const targetCup = this._cups[targetPlayerId]
    if (!targetCup) return;
    if (targetCup.getState() !== CupState.online) return;


    const firstBonus:Bonus|undefined = this.playerBonuses.shift();
    if (firstBonus === undefined) return;

    // send command
    const data:SendBonusRequest = {
      type: RequestTypes.sendBonus,
      // partyId: this._partyId,
      // playerId: this._playerId,
      partyId: TetrinetSingleton.getInstance().getPartyId(),
      playerId: TetrinetSingleton.getInstance().getPlayerId(),
      target: targetPlayerId,
      bonus: firstBonus
    }

    SocketSingleton.getInstance()?.sendData(data)

  }

  /**
   * @param bonus
   * @param data
   */
  realiseBonus(bonus:Bonus, data?:GetBonusMessage)
  {
    switch (bonus) {
      case Bonus.add: this.addRows(1); break;
      case Bonus.clear: this.clearRows(1); break;
      case Bonus.clearSpecials: this.realiseClearSpecial(); break;
      case Bonus.randomClear: this.realiseRandomClear(); break;
      case Bonus.bomb: this.realiseBlockBombSpecial(); break;
      case Bonus.quake: this.realiseQuakeSpecial(); break;
      case Bonus.gravity: this.realiseGravitySpecial(); break;
      case Bonus.switch: this.realiseSwitch(data as GetSwitchBonusMessage); break;
      case Bonus.nuke: this.realiseNukeSpecial(); break;
    }
  }

  /**
   * Callback when line was cleared in the cup
   * @param data
   */
  onLineCleared(data:{countLines: number, bonuses: number[]}): void
  {
    // call event
    this._score = this._score + ((data.countLines + data.countLines - 1) * 10);

    //
    this.listener?.onScoreChanged(this._score);

    // add cleared bonuses to me
    if (data.bonuses.length > 0){
      if (this.playerBonuses.length < 10) {
        this.playerBonuses = this.playerBonuses.concat(data.bonuses.slice(0, 10 - this.playerBonuses.length));
      }
    }

    // add special block
    for (let i = 0; i < data.countLines; i++) {
      this.addSpecialBlock()
    }

  }
  
  /**
   * Place a special block in cup
   */
  addSpecialBlock ()
  {
    // collect available places
    const allFields = this._cup.getFields();
    // const bonusFields = this._cup.getFields();
    
    // find blocks with none
    let notFreeFieldsIds:Array<number> = []
    allFields.forEach((value:Field, cellId:number) =>
    {
      // if it is a clear field
      if (value.block === -1) return

      // if there is a bonus
      if (value.bonus !== undefined) return

      // clear bonus fields
      notFreeFieldsIds.push(cellId)
    });
    
    //
    if (notFreeFieldsIds.length === 0) return

    // random field index
    const randomFieldIndexInNoFreeFields:number = Math.floor(Math.random() * notFreeFieldsIds.length);
    const bonusFieldIndex = notFreeFieldsIds[randomFieldIndexInNoFreeFields];

    // todo: store in global
    const availableBonuses = [
      Bonus.add,
      Bonus.add,
      Bonus.add,
      Bonus.add,
      Bonus.add,
      Bonus.clear,
      Bonus.clear,
      Bonus.clear,
      Bonus.clear,
      Bonus.clear,
      Bonus.clearSpecials,
      Bonus.clearSpecials,
      Bonus.clearSpecials,
      Bonus.clearSpecials,
      Bonus.randomClear,
      Bonus.randomClear,
      Bonus.randomClear,
      Bonus.quake,
      Bonus.quake,
      Bonus.quake,
      Bonus.gravity,
      Bonus.gravity,
      Bonus.bomb,
      Bonus.bomb,
      Bonus.switch,
      Bonus.nuke
    ];

    // take random block
    // now we have only 3 special blocks
    const b = availableBonuses[Math.floor(Math.random() * availableBonuses.length)]

    // place it
    this._cup.addBonusFiled(bonusFieldIndex, b)
  }
  
  /**
   * Previous figure moved to cup
   * so this is important event
   * because it possible be game over
   */
  onFigureMovedToCup()
  {
    // if new stage is game over that mens game over
    // if (this._cup.getState() === CupState.over){
      // debugger
    // }
    
    // call update callback
    this.listener?.onCupUpdated(this._state, this._cup.getData());
  }

  onFigureDrop(): void {
    WorkerSingleton.resetTimer()
  }

  /**
   * Implementation of clear special blocks bonus
   */
  private realiseClearSpecial (sendState: boolean = true)
  {
    const fields = this._cup.getFields();
    fields.forEach((f:Field) => f.bonus = undefined);

    // rise update state callback
    if (sendState && this.listener) {
      this.listener.onCupUpdated(this._state, this._cup.getData())
    }
  }

  /**
   * Implementation of clear random blocks
   */
  private realiseRandomClear (sendState: boolean = true)
  {
    for(let row:number = 0; row < this._cup.getHeightInCells(); row++)
    {
      // get count not empty fields in this row
      const startIndex = row * this._cup.getWidthInCells();

      // clear 1 field
      let r = Math.floor(Math.random() * this._cup.getWidthInCells()) + startIndex
      this._cup.clearBlockByIndex(r)

      // clear 1 field
      r = Math.floor(Math.random() * this._cup.getWidthInCells()) + startIndex
      this._cup.clearBlockByIndex(r)

      // clear 1 field
      r = Math.floor(Math.random() * this._cup.getWidthInCells()) + startIndex
      this._cup.clearBlockByIndex(r)
    }

    // rise update state callback
    if (sendState && this.listener) {
      this.listener.onCupUpdated(this._state, this._cup.getData())
    }
  }

  /**
   * Implementation of block bomb bones
   */
  private realiseBlockBombSpecial (sendState: boolean = true)
  {
    // collect fields with bomb
    const fieldsIndexedWithBomb:Array<number> = []

    this._cup.getFields().forEach((f:Field, index:number) => {
      if (f.bonus === Bonus.bomb) fieldsIndexedWithBomb.push(index)
    })

    if (fieldsIndexedWithBomb.length === 0) return;

    // random files
    const randomIndex = fieldsIndexedWithBomb[Math.floor(Math.random() * fieldsIndexedWithBomb.length)];

    // get random cell
    let cob:Coords = this._cup.getCoordsByIndex(randomIndex)


    // let centerOfBlowIndex = this._cup.getCellIndex(centerOfBlow.x, centerOfBlow.y)

    // clear center block
    this._cup.clearBlockByCoords(cob.x, cob.y)

    // let pos:Coords = {x:0, y: 0}
    // let newPosition:Coords = {x:0, y: 0}

    // above
    let pos = {x: cob.x, y: cob.y - 1}
    let coords = [
      new Coords(cob.x, cob.y - 2),
      new Coords(cob.x, cob.y - 3),
      new Coords(cob.x, cob.y - 4),
      new Coords(cob.x-1, cob.y - 2),
      new Coords(cob.x-1, cob.y - 3),
      new Coords(cob.x-1, cob.y - 4),
      new Coords(cob.x+1, cob.y - 2),
      new Coords(cob.x+1, cob.y - 3),
      new Coords(cob.x+1, cob.y - 4),
    ];
    // random files
    let randomPos = coords[Math.floor(Math.random() * coords.length)];
    this._cup.copyBlockByCoords(pos.x, pos.y, randomPos.x, randomPos.y)
    this._cup.clearBlockByCoords(pos.x, pos.y)

    // above above
    pos = {x: cob.x, y: cob.y - 2}
    coords = [
      new Coords(cob.x, cob.y - 3),
      new Coords(cob.x-1, cob.y - 3),
      new Coords(cob.x+1, cob.y - 3),
      new Coords(cob.x, cob.y - 4),
      new Coords(cob.x-1, cob.y - 4),
      new Coords(cob.x+1, cob.y - 4),
    ];
    randomPos = coords[Math.floor(Math.random() * coords.length)];
    this._cup.copyBlockByCoords(pos.x, pos.y, randomPos.x, randomPos.y)
    this._cup.clearBlockByCoords(pos.x, pos.y)

    // right top
    pos = {x: cob.x + 1, y: cob.y - 1}
    coords = [
      new Coords(cob.x+2, cob.y-2),
      new Coords(cob.x+2, cob.y-3),
      new Coords(cob.x+3, cob.y-2),
      new Coords(cob.x+3, cob.y-3),
      new Coords(cob.x+3, cob.y-4),
      new Coords(cob.x+4, cob.y-3),
      new Coords(cob.x+4, cob.y-4),
    ];
    randomPos = coords[Math.floor(Math.random() * coords.length)];
    this._cup.copyBlockByCoords(pos.x, pos.y, randomPos.x, randomPos.y)
    this._cup.clearBlockByCoords(pos.x, pos.y)

    // right
    pos = {x: cob.x + 1, y: cob.y}
    coords = [
      new Coords(cob.x+2, cob.y),
      new Coords(cob.x+3, cob.y),
      new Coords(cob.x+4, cob.y),
      new Coords(cob.x+2, cob.y-1),
      new Coords(cob.x+3, cob.y-1),
      new Coords(cob.x+4, cob.y-1),
      new Coords(cob.x+2, cob.y+1),
      new Coords(cob.x+3, cob.y+1),
      new Coords(cob.x+4, cob.y+1),
    ];
    randomPos = coords[Math.floor(Math.random() * coords.length)];
    this._cup.copyBlockByCoords(pos.x, pos.y, randomPos.x, randomPos.y)
    this._cup.clearBlockByCoords(pos.x, pos.y)

    // right right
    pos = {x: cob.x + 2, y: cob.y}
    coords = [
      new Coords(cob.x+3, cob.y),
      new Coords(cob.x+3, cob.y-1),
      new Coords(cob.x+3, cob.y+1),
      new Coords(cob.x+4, cob.y),
      new Coords(cob.x+4, cob.y-1),
      new Coords(cob.x+4, cob.y+1),
    ];
    randomPos = coords[Math.floor(Math.random() * coords.length)];
    this._cup.copyBlockByCoords(pos.x, pos.y, randomPos.x, randomPos.y)
    this._cup.clearBlockByCoords(pos.x, pos.y)

    // // right bottom
    pos = {x: cob.x + 1,y: cob.y + 1}
    coords = [
      new Coords(cob.x+2, cob.y+2),
      new Coords(cob.x+2, cob.y+3),
      new Coords(cob.x+3, cob.y+2),
      new Coords(cob.x+3, cob.y+3),
      new Coords(cob.x+3, cob.y+4),
      new Coords(cob.x+4, cob.y+3),
      new Coords(cob.x+4, cob.y+4),
    ];
    randomPos = coords[Math.floor(Math.random() * coords.length)];
    this._cup.copyBlockByCoords(pos.x, pos.y, randomPos.x, randomPos.y)
    this._cup.clearBlockByCoords(pos.x, pos.y)

    // bellow
    pos = {x: cob.x, y: cob.y + 1}
    coords = [
      new Coords(cob.x, cob.y + 2),
      new Coords(cob.x, cob.y + 3),
      new Coords(cob.x, cob.y + 4),
      new Coords(cob.x-1, cob.y + 2),
      new Coords(cob.x-1, cob.y + 3),
      new Coords(cob.x-1, cob.y + 4),
      new Coords(cob.x+1, cob.y + 2),
      new Coords(cob.x+1, cob.y + 3),
      new Coords(cob.x+1, cob.y + 4),
    ];
    randomPos = coords[Math.floor(Math.random() * coords.length)];
    this._cup.copyBlockByCoords(pos.x, pos.y, randomPos.x, randomPos.y)
    this._cup.clearBlockByCoords(pos.x, pos.y)

    // below below
    pos = {x: cob.x, y: cob.y + 2}
    coords = [
      new Coords(cob.x, cob.y + 3),
      new Coords(cob.x-1, cob.y + 3),
      new Coords(cob.x+1, cob.y + 3),
      new Coords(cob.x, cob.y + 4),
      new Coords(cob.x-1, cob.y + 4),
      new Coords(cob.x+1, cob.y + 4),
    ];
    randomPos = coords[Math.floor(Math.random() * coords.length)];
    this._cup.copyBlockByCoords(pos.x, pos.y, randomPos.x, randomPos.y)
    this._cup.clearBlockByCoords(pos.x, pos.y)

    // left bottom
    pos = {x: cob.x - 1, y: cob.y + 1}
    coords = [
      new Coords(cob.x-2, cob.y+2),
      new Coords(cob.x-2, cob.y+3),
      new Coords(cob.x-3, cob.y+2),
      new Coords(cob.x-3, cob.y+3),
      new Coords(cob.x-3, cob.y+4),
      new Coords(cob.x-4, cob.y+3),
      new Coords(cob.x-4, cob.y+4),
    ];
    randomPos = coords[Math.floor(Math.random() * coords.length)];
    this._cup.copyBlockByCoords(pos.x, pos.y, randomPos.x, randomPos.y)
    this._cup.clearBlockByCoords(pos.x, pos.y)

    // left
    pos = {x: cob.x - 1, y: cob.y}
    coords = [
      new Coords(cob.x-2, cob.y),
      new Coords(cob.x-3, cob.y),
      new Coords(cob.x-4, cob.y),
      new Coords(cob.x-2, cob.y-1),
      new Coords(cob.x-3, cob.y-1),
      new Coords(cob.x-4, cob.y-1),
      new Coords(cob.x-2, cob.y+1),
      new Coords(cob.x-3, cob.y+1),
      new Coords(cob.x-4, cob.y+1),
    ];
    randomPos = coords[Math.floor(Math.random() * coords.length)];
    this._cup.copyBlockByCoords(pos.x, pos.y, randomPos.x, randomPos.y)
    this._cup.clearBlockByCoords(pos.x, pos.y)

    // left left
    pos = {x: cob.x - 2, y: cob.y}
    coords = [
      new Coords(cob.x-3, cob.y),
      new Coords(cob.x-3, cob.y+1),
      new Coords(cob.x-3, cob.y-1),
      new Coords(cob.x-4, cob.y),
      new Coords(cob.x-4, cob.y+1),
      new Coords(cob.x-4, cob.y-1),
    ];
    randomPos = coords[Math.floor(Math.random() * coords.length)];
    this._cup.copyBlockByCoords(pos.x, pos.y, randomPos.x, randomPos.y)
    this._cup.clearBlockByCoords(pos.x, pos.y)

    // left top
    pos = {x: cob.x - 1, y: cob.y - 1}
    coords = [
      new Coords(cob.x-2, cob.y-2),
      new Coords(cob.x-2, cob.y-3),
      new Coords(cob.x-3, cob.y-2),
      new Coords(cob.x-3, cob.y-3),
      new Coords(cob.x-3, cob.y-4),
      new Coords(cob.x-4, cob.y-3),
      new Coords(cob.x-4, cob.y-4),
    ];
    randomPos = coords[Math.floor(Math.random() * coords.length)];
    this._cup.copyBlockByCoords(pos.x, pos.y, randomPos.x, randomPos.y)
    this._cup.clearBlockByCoords(pos.x, pos.y)


    // rise update state callback
    if (sendState && this.listener) {
      this.listener.onCupUpdated(this._state, this._cup.getData())
    }
  }

  /**
   * Implementation of block quake bones
   */
  private realiseQuakeSpecial ()
  {
    const methods = [
      this.quakeOneRowToRight,
      this.quakeOneRowToLeft,
      () => {}
    ];
    for(let row:number = 0; row < this._cup.getHeightInCells(); row++) {
      const randomIndex = Math.floor(Math.random() * methods.length);
      methods[randomIndex](row)
    }

    // rise update state callback
    this.listener?.onCupUpdated(this._state, this._cup.getData())
  }

  private quakeOneRowToLeft = (row: number) =>
  {
    let firstCell = this._cup.getFieldByCoords(0, row)

    for (let col:number = 0; col < this._cup.getWidthInCells(); col++)
    {
      if (col === this._cup.getWidthInCells() - 1) {
        this._cup.setFieldByCoordinates(col, row, firstCell);
      }
      else {
        // move right cell to left
        this._cup.copyBlockByCoords(col + 1, row, col, row);
      }
    }
  }

  private quakeOneRowToRight = (row: number)=>
  {
    let lastCell = this._cup.getFieldByCoords(this._cup.getWidthInCells() - 1, row)

    for (let col:number = this._cup.getWidthInCells(); col >= 0; col--)
    {
      if (col === 0) {
        this._cup.setFieldByCoordinates(col, row, lastCell);
      }
      else {
        // move left cell to right
        this._cup.copyBlockByCoords(col - 1, row, col, row);
      }
    }
  }

  /**
   * Implementation of block quake bones
   */
  private realiseGravitySpecial ()
  {
    for(let col:number = 0; col < this._cup.getWidthInCells(); col++) {
      this.gravityOneColl(col);
    }

    // clear full lines
    this._cup.clearAndMoveLines();

    // send message about changed cup
    this.listener?.onCupUpdated(this._state, this._cup.getData())
  }

  private gravityOneColl (col:number)
  {

      let rowToSplit = this._cup.getHeightInCells() - 1;
      let rowToChange = rowToSplit - 1

      while (rowToSplit > 0)
      {
        const splitCell = this._cup.getFieldByCoords(col, rowToSplit)

        // if block is busy we just go to next
        if (splitCell.block !== -1){
          rowToSplit--;
          continue;
        }

        // search not empty blocks above
        rowToChange = rowToSplit - 1
        let blockAbove = this._cup.getFieldByCoords(col, rowToChange)
        while (blockAbove.block === -1 && rowToChange > 0) {
          rowToChange--
          blockAbove = this._cup.getFieldByCoords(col, rowToChange)
        }

        //
        if (blockAbove.block !== -1){
          this._cup.copyBlockByCoords(col, rowToChange, col, rowToSplit);
          this._cup.clearBlockByCoords(col, rowToChange)
        }

        rowToSplit--
      }
  }

  /**
   * Implementation of block quake bones
   */
  private realiseNukeSpecial ()
  {
    for (let row:number = 0; row < this._cup.getHeightInCells(); row++) {
      for (let col: number = 0; col < this._cup.getWidthInCells(); col++) {
        this._cup.clearBlockByCoords(col, row)
      }
    }

    // rise update state callback
    this.listener?.onCupUpdated(this._state, this._cup.getData())
  }

  /**
   * Implementation of block quake bones
   */
  private realiseSwitch (data:GetSwitchBonusMessage)
  {
    // update our cup
    this._cup.setFields(data.yourCup.fields)

    // send message about changed cup
    this.listener?.onCupUpdated(this._state, this._cup.getData())
  }

  /**
   * This method add row bellow
   * @param countLines Number of lines to add
   */
  addRandomRowBellow(countLines:number): void
  {
    for (let i = 0; i < countLines; i++) {
      this.addOneRandomLineBellow ()
    }
  }

  /**
   * Add one random line
   */
  private addOneRandomLineBellow ()
  {
    //
    this.moveCupUp();

    // add row
    const randomClearField = Math.floor(Math.random() * this._cup.getWidthInCells());
    for (let col = 0; col < this._cup.getWidthInCells(); col++) {
      this._cup.setFieldByCoordinates(col, this._cup.getHeightInCells() - 1, {
        block: (col === randomClearField) ? - 1 : GenerateRandomColor(),
      })
    }
  }

  /**
   * Move all lines up
   */
  private moveCupUp ()
  {
    // move cup up
    for (let row = 0; row < this._cup.getHeightInCells() - 1; row++) {
      for (let col = 0; col < this._cup.getWidthInCells(); col++) {
        this._cup.copyBlockByCoords(col, row + 1, col, row)
      }
    }
  }

  /**
   * Remove rows bellow cup
   */
  removeRowsBellow(countLines:number):void
  {
    for (let i = 0; i < countLines; i++) {
      this.removeOneRowBelow ()
    }
  }

  /**
   *
   */
  private removeOneRowBelow()
  {
    // clear line
    this.clearBottomLine();

    // move cup down
    this.moveCupDown();
  }

  private clearBottomLine()
  {
    const rowIndex = this._cup.getHeightInCells() - 1;
    for (let col = 0; col < this._cup.getWidthInCells(); col++) {
      this._cup.setFieldByCoordinates(col, rowIndex, {
        block: -1
      })
    }
  }

  /**
   * Move all lines up
   */
  private moveCupDown ()
  {
    for (let row = this._cup.getHeightInCells() -1; row > 0; row--) {
      for (let col = 0; col < this._cup.getWidthInCells(); col++) {
        this._cup.copyBlockByCoords(col, row -1, col, row)
      }
    }
  }
}
