import {CupEventListener, CupWithFigureImpl} from "../models/CupWithFigureImpl";
import {WebGlScreen} from "../../framework/impl/WebGlScreen";
import {Tetrinet} from "../Tetrinet";
import {WebInputEventListener} from "../../framework/impl/WebInput";
import {Vertices} from "../../framework/Vertices";
import {WebGlProgramManager} from "../../framework/impl/WebGlProgramManager";

// import {CupRenderer} from "./CupRenderer";
import {CupRenderer2, CupSize} from "../CupRenderer2";
import {Figure} from "../models/Figure";

import {ForwardHorse} from "../figures/ForwardHorse";
import {BackHorse} from "../figures/BackHorse";
import {Line} from "../figures/Line";
import {ForwardFlash} from "../figures/ForwardFlash";
import {BackFlash} from "../figures/BackFlash";
import {Camel} from "../figures/Camel";
import {Square} from "../figures/Square";
import {Coords} from "../math/Coords";
import {CupData} from "../models/CupData";
import {CupImpl} from "../models/CupImpl";
import {GenerateRandomColor} from "../../../process/GenerateRandomColor";
import {GameState} from "../types";
import {CupState} from "../types/CupState";


/**
 * Listener of game events
 */
export interface PlayScreenEventListener
{
  /**
   * When line is cleared
   * @param numberOfLines
   */
  onLineCleared: (numberOfLines:number) => void
  
  /**
   * Summary event risen when cup data changed
   */
  onCupUpdated: (state:GameState, cupState:CupData) => void
  
}

/**
 * @vaersion 0.0.1
 */
export class PlayScreen extends WebGlScreen implements CupEventListener, WebInputEventListener
{
  /**
   * Cup object
   * @private
   */
  private readonly _cup: CupWithFigureImpl;

  /**
   * this is opponent cup
   * for temp test
   * @private
   */
  private readonly _opponentCup: CupImpl
  
  /**
   * Render
   * @private
   */
  private readonly _cupRenderer: CupRenderer2 | null = null;
  
  /**
   *
   * @private
   */
  private _nextFigure:Figure|null = null;
  
  /**
   * Color of next figure
   * @private
   */
  private _nextFigureColor: number = 0;
  
  /**
   * Position of left bottom point of next figure
   * @private
   */
  private nextFigurePosition:Coords = new Coords(352, 512);
  
  /**
   * Timer for next down
   * @private
   */
  private _downTimer:number = 0;
  
  /**
   * Current game state
   * @private
   */
  private _state:GameState = GameState.ready;
  
  /**
   * @private
   */
  private listener: PlayScreenEventListener|undefined;

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
   * In this constructor we create cup
   */
  constructor(game:Tetrinet)
  {
    super(game)
    
    // create cup object
    this._cup =  new CupWithFigureImpl(this);

    // your opponent cup
    this._opponentCup = new CupImpl();
    
    // generate next figure
    // this._nextFigure = this.generateNewFigure();
    
    // next figure random color
    // this._nextFigureColor = GenerateRandomColor();
    
    // init renderer
    this._cupRenderer  = new CupRenderer2(game.getGLGraphics(), this._cup)
    
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

  cleanUpCup ()
  {
    console.log('PlayScreen.cleanUpCup')
    this._cup.cleanFields();
  }

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
    this._nextFigure = this.generateNewFigure();
    
    // next figure random color
    this._nextFigureColor = GenerateRandomColor();
    
    // generate new figure in cup
    const f = this.generateNewFigure();
    f.setPosition(this._cup.getDropPoint().x, this._cup.getDropPoint().y)
    this._cup.setFigure(f, this._nextFigureColor);
    
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
   * @param sendState
   */
  pause (sendState: boolean = true)
  {
    if (this._state !== GameState.running) return;

    this._state = GameState.paused

    // rise update state callback
    if (sendState && this.listener) {
      this.listener.onCupUpdated(this._state, this._cup.getData())
    }
  }

  /**
   * Resume paused game
   * @param sendState send our state after updating status
   */
  resume (sendState: boolean = true)
  {
    // is game not on the pause
    if (this._state !== GameState.paused) {
      return;
    }

    this._state = GameState.running

    // rise update state callback
    if (sendState && this.listener) {
      this.listener.onCupUpdated(this._state, this._cup.getData())
    }

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
   * Set opponent cup
   * @param o
   */
  setOpponentCup (o:CupData) {
    //
    this._opponentCup.setFields(o.fields)
    this._opponentCup.setState(o.state)
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
    else if (this._state === GameState.over) {
      // this.updatePaused();
    }
  }
  
  /**
   * @param deltaTime
   * @private
   */
  private _updateRunning(deltaTime:number)
  {
    // tick figure down timer
    this._downTimer += deltaTime
    
    // one sec
    if (this._downTimer > 1000) {
      this.onDown();
      this._downTimer = 0;
    }
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
    this._cupRenderer?.setCupSize(CupSize.normal32);
    this._cupRenderer?.setPosition(32, 32)
    this._cupRenderer?.renderCupWithFigure(this._cup);
    
    // render opponent
    // this._cupRenderer?.setBlockSize(16);
    this._cupRenderer?.setCupSize(CupSize.small16)
    this._cupRenderer?.setPosition(400, 32);
    this._cupRenderer?.renderCup(this._opponentCup);
    
    // render next figure
    this.presentNextFigure(gl);

    // present interface
    if (this._state === GameState.ready){
      this.presentReady(gl);
    }
    if (this._state === GameState.paused){
      this.presentPaused(gl);
    }
    if (this._state === GameState.over){
      this.presentGameOver(gl);
    }
  }

  /**
   * Ready state present
   * @param gl
   * @private
   */
  private presentReady (gl: WebGL2RenderingContext)
  {
    console.log('PlayScreen.presentReady')

    // move position to left
    // todo: move to user cup position
    WebGlProgramManager.setUpIntoTextureProgramTranslation(gl, 0, 0)

    // calc left position
    // this._cup.getWidthInCells()

    this._block.setVertices(Vertices.createTextureVerticesArray(
        110, 450, 160, 64,
        320, 256, 192, 64
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
    // todo: move to user cup position
    WebGlProgramManager.setUpIntoTextureProgramTranslation(gl, 0, 0)

    // calc left position
    // this._cup.getWidthInCells()

    this._block.setVertices(Vertices.createTextureVerticesArray(
        110, 450, 160, 64,
        320, 320, 192, 64
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
  private presentGameOver (gl: WebGL2RenderingContext)
  {
    console.log('PlayScreen.presentPaused')

    // move position to left
    // todo: move to user cup position
    WebGlProgramManager.setUpIntoTextureProgramTranslation(gl, 0, 0)

    // calc left position
    // this._cup.getWidthInCells()

    this._block.setVertices(Vertices.createTextureVerticesArray(
        32, 450, 320, 64,
        320, 192, 320, 64
    ))

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._block.vertices), gl.STATIC_DRAW)

    // draw here
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }


  /**
   * Draw next figure
   * @param gl
   * @private
   */
  private presentNextFigure(gl: WebGL2RenderingContext)
  {
    if (!this._nextFigure) return;

    // move cup
    WebGlProgramManager.setUpIntoTextureProgramTranslation(gl, this.nextFigurePosition.x, this.nextFigurePosition.y)

    const fields:Array<Array<boolean>> = this._nextFigure.getPreviewFields();

    const BLOCK_SIZE = 32;

    // calculate number rows
    const rows = fields.length

    // calculate number cols
    const cols = fields[0].length

    // calculate left margin
    const leftMargin = ((4 - cols) / 2) * BLOCK_SIZE;

    // calculate left margin
    const bottomMargin = ((4 - rows) / 2) * BLOCK_SIZE;

    // for (let r = 0; r < rows; r++) {
    fields.reverse().forEach((row:Array<boolean>, rowIndex:number) => {
      row.forEach((col:boolean, colIndex:number) => {
        if (col)
        {
          const left = (colIndex * BLOCK_SIZE) + leftMargin;
          const bottom = (rowIndex * BLOCK_SIZE)  + bottomMargin;

          const spriteLeft = 320 + this._nextFigureColor * BLOCK_SIZE;

          this._block.setVertices(Vertices.createTextureVerticesArray(
              left, bottom, BLOCK_SIZE, BLOCK_SIZE,
              spriteLeft, 0, BLOCK_SIZE, BLOCK_SIZE
          ))

          gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._block.vertices), gl.STATIC_DRAW)

          // draw here
          gl.drawArrays(gl.TRIANGLES, 0, 6);
        }

      })
    });

    // for (let c = 0; c < cols; c++)
    // {
    //
    //   const bottom = (r * BLOCK_SIZE) + 320;
    //   const left = (c * BLOCK_SIZE) + 320;
    //
    //   this._block.setVertices(Vertices.createTextureVerticesArray(
    //     left, bottom, 32, 32,
    //     352, 0, 32, 32
    //   ))
    //
    //   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._block.vertices), gl.STATIC_DRAW)
    //
    //   // draw here
    //   gl.drawArrays(gl.TRIANGLES, 0, 6);
    // }
  }
  
  //
  // key events
  //
  
  onKeyDown(code:string): void
  {
    // transfer events
    if (code === "KeyD") {
      this.onRight();
    }
    
    if (code === "KeyA") {
      this.onLeft();
    }
    
    if (code === "KeyS") {
      this.onDown();
    }
    
    if (code === "KeyQ") {
      this.onRotateCounterClockwise();
    }
    
    //
    if (code === "KeyE") {
      this.onRotateClockwise();
    }
    
    if (code === "Space") {
      
      // drop figure down
      this.onDrop();
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
      this._downTimer = 0;
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
   * Callback when line was cleared in the cup
   * @param countLines
   */
  onLineCleared(countLines: number): void
  {
    // call event
    if (this.listener) this.listener.onLineCleared(countLines);
    
    // add special block
    // this.addSpecialBlock()
  }
  
  /**
   * Place a special block in cup
   */
  addSpecialBlock ()
  {
    // collect available places
    const allFields = this._cup.getFields();
    
    // filter not free
    let notFreeFieldsIds:Array<number> = [];
    
    allFields.forEach((value:number, cellId:number) => {
      if (value !== -1) notFreeFieldsIds.push(cellId)
    });
    
    console.log(notFreeFieldsIds, 'notFreeFieldsIds')
    
    //
    if (notFreeFieldsIds.length === 0) return
    
    // todo: take random
    const randomFieldId = notFreeFieldsIds[0];
    
    // random block
    const b = 333
    
    // place it
    this._cup.addBonusFiled(randomFieldId, b)
  }
  
  /**
   * Previous figure moved to cup
   * so this is important event
   * because it possible be game over
   */
  onFigureMovedToCup()
  {
    if (!this._nextFigure) return;
    
    // move figure to drop position
    this._nextFigure.setPosition(this._cup.getDropPoint().x, this._cup.getDropPoint().y);
    
    // check intersections with cup
    if (!this._cup.canPlace(this._nextFigure.getFields()))
    {
      console.log ('game over');

      // and if we can not post figure is all over
      this._state = GameState.over

      // set cup state to game over
      this._cup.setState(CupState.over);
    }
    else
    {
      
      // move next figure to drop point
      this._cup.setFigure(this._nextFigure, this._nextFigureColor);
      
      // generate next figure
      this._nextFigure = this.generateNewFigure();
      
      // next figure random color
      this._nextFigureColor = GenerateRandomColor();
    }
    
    // call update callback
    this.listener?.onCupUpdated(this._state, this._cup.getData());
  }
  
  /**
   * Generate new random figure
   * @private
   */
  private generateNewFigure():Figure
  {
    // select new figure
    const nextFigureIndex:number = Math.floor(Math.random() * 7);

    let f:Figure;
    switch (nextFigureIndex) {
      case 0: f = new ForwardHorse(this._cup); break;
      case 1: f = new BackHorse(this._cup); break;
      case 2: f = new Line(this._cup); break;
      case 3: f = new ForwardFlash(this._cup); break;
      case 4: f = new BackFlash(this._cup); break;
      case 5: f = new Camel(this._cup); break;
      default: f = new Square(this._cup); break;
    }
    
    return f;
  }
  
  /**
   *
   * @private
   */



  
}
