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

import {GameState} from "../types";
import {CupState} from "../types/CupState";
import {Bonus} from "../types/Bonus";

import {Paused, SearchForAGame} from "../textures";
import {Cup} from "../models/Cup";
import {CupsDataCollection} from "../../../Canvas";
import {SpecialBG} from "../textures/SpecialBG";
import {NextBG} from "../textures/NextBG";
import {Field} from "../models/Field";
import {GetBonusMessage} from "../types/messages/GetBonusMessage";
import {GetSwitchBonusMessage} from "../types/messages/GetSwitchBonusMessage";
import {GenerateNewFigure} from "../process/GenerateNewFigure";
import {CupWithFigure} from "../models/CupWithFigure";


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
  onSendBonusToOpponent: (bonus:Bonus, opponentIndex:number) => void,
  
  /**
   * Summary event risen when cup data changed
   */
  onCupUpdated: (state:GameState, cupState:CupData) => void
}

/**
 * Cups collection
 */
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
export class PlayScreen extends WebGlScreen implements CupEventListener, WebInputEventListener
{

  /**
   * Current game state
   * @private
   */
  private _state:GameState = GameState.ready;

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
  // private readonly _opponentCup: CupImpl
  private readonly _cups: CupsCollection

  /**
   * Render
   * @private
   */
  private readonly _cupRenderer: CupRenderer2 | null = null;
  
  // /**
  //  * Color of next figure
  //  * @private
  //  */
  // private _nextFigureColor: number = 0;
  
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
  // private playerBonuses: Array<Bonus> = [Bonus.add,Bonus.add,Bonus.add];
  private playerBonuses: Array<Bonus> = [Bonus.switch, Bonus.quake, Bonus.bomb,
    // Bonus.randomClear,Bonus.randomClear,Bonus.randomClear,Bonus.clearSpecials,Bonus.clear,Bonus.clear
  ];

  /**
   * Temp field for draw fields
   * @private
   */
  private _block: Vertices;

  /**
   * Red square for experiment with vertices
   * @private
   */
  // private redSquare:Vertices;

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
  private textsHeight = 100;

  private searchForTexture:SearchForAGame;
  private pausedTexture:Paused;
  private specialBG:SpecialBG;
  private nextBG:NextBG;

  /**
   * In this constructor we create cup
   */
  constructor(game:Tetrinet)
  {
    super(game)
    
    // create cup object
    this._cup =  new CupWithFigureImpl(this);

    // init cups collection
    // this._opponentCup = new CupImpl();
    this._cups = {}

    // init textures
    this.searchForTexture = new SearchForAGame();
    this.pausedTexture = new Paused();
    this.specialBG = new SpecialBG();
    this.nextBG = new NextBG();

    // generate next figure
    // this._nextFigure = this.generateNewFigure();
    
    // next figure random color
    // this._nextFigureColor = GenerateRandomColor();
    
    // init renderer
    this._cupRenderer  = new CupRenderer2(game.getGLGraphics(), this._cup.getWidthInCells(), this._cup.getHeightInCells())
    
    // in the background we use only texture
    this._block = new Vertices(false, true);
    this._block.setVertices(Vertices.createTextureVerticesArray(
      200, 200, 32, 32,
      0, 0, 200, 200
    ))

    // test red square
    // this.redSquare = new Vertices(true, false);
    // this.redSquare.setVertices(Vertices.createColorVerticesArray(0, 0, 100, 100, 255,0,0,1))
    
    // bind this to input listener
    this.game.getInput().setListener(this);
  }
  
  /**
   * Set event listener
   * @param listener
   */
  public setGameEventListener (listener:PlayScreenEventListener):PlayScreen{
    this.listener = listener;
    return this
  }
  
  /**
   * Init render by canvas element
   */
  // init ()
  // {
  //   console.log ('PlayScreen.init');
    // this._cupRenderer = new CupRenderer(this.game.getGLGraphics().getGl(), this._cup);
  // }

  // cleanUpCup ()
  // {
  //   console.log('PlayScreen.cleanUpCup')
  //   this._cup.cleanBeforeNewGame();
  // }

  /**
   * It starts the game
   * must be called after init!
   */
  startNewGame ()
  {
    // if (!this._cupRenderer){
    //   throw new Error('Cup render not initialised')
    // }

    
    // next figure random color
    // this._nextFigure = GenerateNewFigure(this._cup, GenerateRandomColor());
    this._cup.generateNextFigure();
    
    // next figure random color
    // this._nextFigureColor = GenerateRandomColor();

    // generate new figure in cup
    const f = GenerateNewFigure(this._cup, GenerateRandomColor());
    this._cup.setFigureToDropPoint(f);
    
    // first render
    // this._cupRenderer.renderCupWithFigure(this._cup)
    console.log('PlayScreen.start')
    
    // finally set run status
    this._state = GameState.running
    
    // call first callback
    // I'm not sure that it need to be here
    this.listener?.onCupUpdated(this._state, this._cup.getData())
  }

  /**
   * Pause running game
   */
  pause (){
    if (this._state !== GameState.running) return;
    this._state = GameState.paused
  }

  /**
   * Resume paused game
   */
  resume (){
    // is game not on the pause
    if (this._state !== GameState.paused) return;
    this._state = GameState.running
  }

  gameOver() {
    this._state = GameState.over;
  }

  /**
   * We add empty row on bottom
   */
  addRows(countLines:number, sendState: boolean = true)
  {
    // add lines
    this._cup.addRandomRowBellow(countLines);

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
    this._cup.removeRowsBellow(countLines);

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

  /**
   * Update cups,
   * here already filtered opponent cup
   * @param data
   */
  updateCups (data:CupsDataCollection) {
    Object.keys(data).forEach((playerId:string) => {
      if (!this._cups[playerId]) this._cups[playerId] = new CupImpl();
      const cd = data[playerId]
      this._cups[playerId].setFields(cd.fields)
      this._cups[playerId].setState(cd.state)
    })
  }

  /*
   * Set opponent cup
   * @param o
   */
  // setOpponentCup (o:CupData) {
    //
    // this._opponentCup.setFields(o.fields)
    // this._opponentCup.setState(o.state)
  // }
  
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
    // // tick figure down timer
    // this._downTimer += deltaTime
    //
    // // one sec
    // if (this._downTimer > 1000) {
    //   this.onDown();
    //   this._downTimer = 0;
    // }
    this._cup.updateFigureDownTimer(deltaTime);
  }
  
  present(): void
  {
    //
    const gl = this.game.getGLGraphics().getGl();
    
    // Clear the screen.
    gl.clear(gl.COLOR_BUFFER_BIT)
    
    // use texture program
    WebGlProgramManager.sUseTextureProgram(gl);
    
    // render cup
    WebGlProgramManager.setUpIntoTextureProgramTranslation(gl, 32, 32);
    this._cupRenderer?.setCupSize(CupSize.normal32);
    // this._cupRenderer?.setPosition(32, 32)
    this._cupRenderer?.renderCupWithFigure(this._cup);
    
    // render opponents cups
    Object.keys(this._cups).forEach((playerId:string, index:number) => {
      if (this._cups[playerId]) {
        this._cupRenderer?.setCupSize(CupSize.small16)
        WebGlProgramManager.setUpIntoTextureProgramTranslation(gl, CupsPosition[index].x, CupsPosition[index].y);
        // todo: move position out of the screen
        // this._cupRenderer?.setPosition(400 + (400 * index), 32);
        this._cupRenderer?.renderCup(this._cups[playerId]);
      }
    })

    
    // render next figure
    this.presentNextFigure(gl);

    // render bonus fields
    this.presentBonuses(gl)

    // present interface
    if (this._state === GameState.ready){
      this.presentReady(gl);
    }
    if (this._state === GameState.paused){
      this.presentPaused(gl);
    }

    // game over present in a cup
    // if (this._state === GameState.over){
    //   this.presentGameOver(gl);
    // }
  }

  /**
   * Ready state present
   * @param gl
   * @private
   */
  private presentReady (gl: WebGL2RenderingContext)
  {
    // move position of cup
    WebGlProgramManager.setUpIntoTextureProgramTranslation(gl, this.mainCupPosition.x, this.mainCupPosition.y)

    // calc left position
    // this._cup.getWidthInCells()

    this._block.setVertices(Vertices.createTextureVerticesArray(
        0, this.textsHeight, 320, 64,
        // 320, 256, 192, 64
        this.searchForTexture.texX, this.searchForTexture.texY, this.searchForTexture.texWidth, this.searchForTexture.texHeight
    ))

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._block.vertices), gl.STATIC_DRAW)

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
    console.log('PlayScreen.presentPaused')

    // move position to left
    WebGlProgramManager.setUpIntoTextureProgramTranslation(gl, this.mainCupPosition.x, this.mainCupPosition.y)

    // calc left position
    // this._cup.getWidthInCells()

    this._block.setVertices(Vertices.createTextureVerticesArray(
        78, this.textsHeight, 160, 64,
        // 320, 320, 192, 64
      this.pausedTexture.texX, this.pausedTexture.texY, this.pausedTexture.texWidth, this.pausedTexture.texHeight
    ))

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._block.vertices), gl.STATIC_DRAW)

    // draw here
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  /*
   * Game over present
   * @param gl
   * @private
   */
  // private presentGameOver (gl: WebGL2RenderingContext)
  // {
  //   // move position of cup
  //   WebGlProgramManager.setUpIntoTextureProgramTranslation(gl, this.mainCupPosition.x, this.mainCupPosition.y)
  //
  //   this._block.setVertices(Vertices.createTextureVerticesArray(
  //       32, 450, 320, 64,
  //       320, 192, 320, 64
  //   ))
  //
  //   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._block.vertices), gl.STATIC_DRAW)
  //
  //   // draw here
  //   gl.drawArrays(gl.TRIANGLES, 0, 6);
  // }

  /**
   * Draw next figure
   * @param gl
   * @private
   */
  private presentNextFigure(gl: WebGL2RenderingContext)
  {
    const nextFigure = this._cup.getNextFigure();
    if (!nextFigure) return

    // move position
    WebGlProgramManager.setUpIntoTextureProgramTranslation(gl, this.nextFigurePosition.x, this.nextFigurePosition.y)

    //
    this._cupRenderer?.renderNextFigure(gl, nextFigure)
  }

  private presentBonuses (gl: WebGL2RenderingContext){

    // move to position
    WebGlProgramManager.setUpIntoTextureProgramTranslation(gl, 32, 685)

    // draw bg
    this._block.setVertices(Vertices.createTextureVerticesArray(
      0, 0, 320, 32,
      this.specialBG.texX, this.specialBG.texY, this.specialBG.texWidth, this.specialBG.texHeight
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
          spriteLeft, 128, BLOCK_SIZE, BLOCK_SIZE
      ))

      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._block.vertices), gl.STATIC_DRAW)
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    })

  }
  
  //
  // key events
  //

  /**
   * @param code
   */
  onKeyDown(code:string): void
  {
    switch (code) {
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
    if (this._cupRenderer){
      this._cupRenderer.renderCupWithFigure(this._cup)
    }
    
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
    if (this._cupRenderer){
      this._cupRenderer.renderCupWithFigure(this._cup)
    }
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
    if (this._cupRenderer){
      this._cupRenderer.renderCupWithFigure(this._cup)
    }
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
    if (this._cupRenderer){
      this._cupRenderer.renderCupWithFigure(this._cup)
    }
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
    if (this._cupRenderer){
      this._cupRenderer.renderCupWithFigure(this._cup)
    }
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
    if (this._cupRenderer){
      this._cupRenderer.renderCupWithFigure(this._cup)
    }
  }

  /**
   * Is your control online
   * @private
   */
  private isControlOnline ():boolean {
    return this._state === GameState.running
  }

  /**
   *
   */
  private sendBonusToMe ()
  {
    if (this.playerBonuses.length === 0) return;

    const firstBonus:Bonus|undefined = this.playerBonuses.shift();
    if (firstBonus === undefined) return;

    // ignore switch bonus
    if (firstBonus === Bonus.switch) return;

    this.realiseBonus(firstBonus)
  }

  /**
   * We send surprise to opponent
   * todo: strange bug, because we do not
   * @private
   */
  private sendBonusToOpponent (indexOfOpponent:number)
  {
    if (this.playerBonuses.length === 0) return;

    const firstBonus:Bonus|undefined = this.playerBonuses.shift();
    if (firstBonus === undefined) return;

    console.log ('PlayScreen.sendBonusToOpponent', firstBonus);

    // rise event
    this.listener?.onSendBonusToOpponent(firstBonus, indexOfOpponent)

  }

  /**
   * @param bonus
   * @param minePlayerId
   * @param data
   */
  realiseBonus(bonus:Bonus, minePlayerId?:string, data?:GetBonusMessage)
  {
    // todo: add additional blocks
    switch (bonus) {
      case Bonus.add: this.addRows(1); break;
      case Bonus.clear: this.clearRows(1); break;
      case Bonus.clearSpecials: this.realiseClearSpecial(); break;
      case Bonus.randomClear: this.realiseRandomClear(); break;
      case Bonus.bomb: this.realiseBlockBombSpecial(); break;
      case Bonus.quake: this.realiseQuakeSpecial(); break;
      case Bonus.gravity: this.realiseGravitySpecial(); break;
      case Bonus.switch: this.realiseSwitch(minePlayerId as string, data as GetSwitchBonusMessage); break;
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

      // if there bonus
      if (value.block) return

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
      Bonus.clear,
      Bonus.clearSpecials,
      Bonus.randomClear,
      Bonus.bomb,
      Bonus.quake,
      Bonus.gravity,
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
    

    // if (!this._nextFigure) return;

    // check intersections with cup
    // if (!this._cup.canPlace(this._nextFigure.getFields()))
    // {
    //
    // }
    // else
    // {
    //   // move next figure to drop point
    //   this._cup.setFigureToDropPoint(this._nextFigure);
    //
    //   // generate next figure
    //   this._nextFigure = GenerateNewFigure(this._cup, GenerateRandomColor());
    // }
    
    // call update callback
    this.listener?.onCupUpdated(this._state, this._cup.getData());
  }

  /**
   * Implementation of clear special blocks bonus
   */
  private realiseClearSpecial (sendState: boolean = true)
  {
    //
    this.playerBonuses = [];

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
    // get random cell
    let centerOfBlow:Coords = {
      x: Math.floor(Math.random() * this._cup.getHeightInCells()),
      y: Math.floor(Math.random() * this._cup.getWidthInCells())
    }

    // centerOfBlow = {y: 17, x: 6}

    // if it is the bottom line
    // let ifItIsATopLine = (centerOfBlow.y <= 0);
    // let ifItIsABottomLine = (centerOfBlow.y >= this._cup.getHeightInCells() - 1);
    // let ifItIsOnRightAge = (centerOfBlow.x >= this._cup.getWidthInCells() - 1);
    // let ifItIsOnLeftEdge = (centerOfBlow.x <= 0);

    //
    // let centerOfBlowIndex = (centerOfBlow.y * this._cup.getWidthInCells()) + centerOfBlow.x
    // let centerOfBlowIndex = this._cup.getCellIndex(centerOfBlow.x, centerOfBlow.y)

    // clear center block
    this._cup.clearBlockByCoords(centerOfBlow)

    // let pos:Coords = {x:0, y: 0}
    // let newPosition:Coords = {x:0, y: 0}

    // above
    let pos = {x: centerOfBlow.x, y: centerOfBlow.y - 1}
    let newPosition = {x: pos.x, y: pos.y - 2}
    this._cup.copyBlockByCoords(pos, newPosition)
    this._cup.clearBlockByCoords(pos)

    // right top
    pos = {x: centerOfBlow.x + 1, y: centerOfBlow.y - 1}
    newPosition = {x: pos.x + 1, y: pos.y - 1}
    this._cup.copyBlockByCoords(pos, newPosition)
    this._cup.clearBlockByCoords(pos)

    // right
    pos = {x: centerOfBlow.x + 1, y: centerOfBlow.y}
    newPosition = {x: pos.x + 2, y: pos.y}
    this._cup.copyBlockByCoords(pos, newPosition)
    this._cup.clearBlockByCoords(pos)

    // right bottom
    pos = {x: centerOfBlow.x + 1,y: centerOfBlow.y + 1}
    newPosition = {x: pos.x + 2, y: pos.y + 2}
    this._cup.copyBlockByCoords(pos, newPosition)
    this._cup.clearBlockByCoords(pos)

    // bellow
    pos = {x: centerOfBlow.x, y: centerOfBlow.y + 1}
    newPosition = {x: pos.x, y: pos.y + 2}
    this._cup.copyBlockByCoords(pos, newPosition)
    this._cup.clearBlockByCoords(pos)

    // left bottom
    pos = {x: centerOfBlow.x - 1, y: centerOfBlow.y + 1}
    newPosition = {x: pos.x - 2, y: pos.y + 2}
    this._cup.copyBlockByCoords(pos, newPosition)
    this._cup.clearBlockByCoords(pos)

    // left
    pos = {x: centerOfBlow.x - 1, y: centerOfBlow.y}
    newPosition = {x: pos.x - 2, y: pos.y}
    this._cup.copyBlockByCoords(pos, newPosition)
    this._cup.clearBlockByCoords(pos)

    // left top
    pos = {x: centerOfBlow.x - 1, y: centerOfBlow.y - 1}
    newPosition = {x: pos.x - 1,y: pos.y - 1}
    this._cup.copyBlockByCoords(pos, newPosition)
    this._cup.clearBlockByCoords(pos)


    // rise update state callback
    if (sendState && this.listener) {
      this.listener.onCupUpdated(this._state, this._cup.getData())
    }
  }

  /**
   * Implementation of block quake bones
   */
  private realiseQuakeSpecial (sendState: boolean = true)
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
    if (sendState && this.listener) {
      this.listener.onCupUpdated(this._state, this._cup.getData())
    }
  }

  private quakeOneRowToLeft = (row: number) =>
  {
    let firstCell = this._cup.getFieldByCoords({x: 0, y: row})

    for (let col:number = 0; col < this._cup.getWidthInCells(); col++)
    {
      if (col === this._cup.getWidthInCells() - 1) {
        this._cup.setFieldByCoordinates(col, row, firstCell);
      }
      else {
        // move right cell to left
        this._cup.copyBlockByCoords({x: col + 1, y: row}, {x: col, y:row});
      }
    }
  }

  private quakeOneRowToRight = (row: number)=>
  {
    let lastCell = this._cup.getFieldByCoords({x: this._cup.getWidthInCells() - 1, y: row})

    for (let col:number = this._cup.getWidthInCells(); col >= 0; col--)
    {
      if (col === 0) {
        this._cup.setFieldByCoordinates(col, row, lastCell);
      }
      else {
        // move left cell to right
        this._cup.copyBlockByCoords({x: col - 1, y: row}, {x: col, y:row});
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
  }

  private gravityOneColl (col:number)
  {

      let rowToSplit = this._cup.getHeightInCells() - 1;
      let rowToChange = rowToSplit - 1

      while (rowToSplit >= 0)
      {
        const splitCell = this._cup.getFieldByCoords({x: col, y: rowToSplit})

        // if block is busy we just go to next
        if (splitCell.block !== -1){
          rowToSplit--;
          continue;
        }

        // search not empty blocks above
        rowToChange = rowToSplit - 1
        let blockAbove = this._cup.getFieldByCoords({x: col, y: rowToChange})
        while (blockAbove.block === -1 && rowToChange > 0) {
          rowToChange--
          blockAbove = this._cup.getFieldByCoords({x: col, y: rowToChange})
        }

        //
        if (blockAbove.block !== -1){
          this._cup.copyBlockByCoords({x: col, y: rowToChange}, {x: col, y: rowToSplit});
          this._cup.clearBlockByCoords({x: col, y: rowToChange})
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
        this._cup.setFieldByCoordinates(col, row, {block: -1})
      }
    }
  }

  /**
   * Implementation of block quake bones
   */
  private realiseSwitch (minePlayerId:string, data:GetSwitchBonusMessage)
  {
    console.log(data.cups, 'data')

    // fow to find our id

    this._cup.setFields(data.cups[minePlayerId].fields)

    // this.setCupState(data.cups[])

    // filter opponent cups
    let opponentsCups:CupsDataCollection = new class implements CupsDataCollection {
      [index: string]: CupData;
    };
    Object.keys(data.cups).forEach((playerId:string) => {
      if (playerId !== minePlayerId) {
        opponentsCups[playerId] = (data.cups[playerId]);
      }
    })

    this.updateCups(opponentsCups)
  }
}
