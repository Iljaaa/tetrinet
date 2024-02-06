import {CupEventListener, CupWithFigureImpl} from "../models/CupWithFigureImpl";
import {WebGlScreen} from "../../framework/impl/WebGlScreen";
import {Tetrinet} from "../Tetrinet";
import {WebInputEventListener} from "../../framework/impl/WebInput";
import {Vertices} from "../../framework/Vertices";
import {WebGlProgramManager} from "../../framework/impl/WebGlProgramManager";

// import {CupRenderer} from "./CupRenderer";
import {CupRenderer2} from "../CupRenderer2";
import {Figure} from "../models/Figure";

import {ForwardHorse} from "../figures/ForwardHorse";
import {BackHorse} from "../figures/BackHorse";
import {Line} from "../figures/Line";
import {ForwardFlash} from "../figures/ForwardFlash";
import {BackFlash} from "../figures/BackFlash";
import {Camel} from "../figures/Camel";
import {Square} from "../figures/Square";
import {Coords} from "../math/Coords";
import {CupState} from "../models/CupState";

/**
 * Game states
 */
export enum GameState {
  ready= 0,
  running = 40,
  paused = 50,
  over = 100,
}

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
   * Summary event rised when cup data changed
   */
  onCupUpdated: (state:GameState, cupState:CupState) => void
  
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
   * Red squere for experiment with vertices
   * @private
   */
  private redSquare:Vertices;
  
  
  /**
   * In this constructor we create cup
   */
  constructor(game:Tetrinet)
  {
    super(game)
    
    // create cup object
    this._cup =  new CupWithFigureImpl(this);
    
    // generate next figure
    // this._nextFigure = this.generateNewFigure();
    
    // next figure random color
    this._nextFigureColor = this.generateRandomColor();
    
    // init renderer
    this._cupRenderer  = new CupRenderer2(game.getGLGraphics(), this._cup)
    
    // in background we use only texture
    this._block = new Vertices(false, true);
    this._block.setVertices(Vertices.createTextureVerticesArray(
      200, 200, 32, 32,
      0, 0, 200, 200
    ))
    
    // todo: we need to create programs here
    
    //
    
    // test red square
    this.redSquare = new Vertices(true, false);
    this.redSquare.setVertices(Vertices.createColorVerticesArray(0, 0, 100, 100, 255,0,0,1))
    
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
    this._nextFigureColor = this.generateRandomColor();
    
    // generate new figure in cup
    const f = this.generateNewFigure();
    f.setPosition(this._cup.getDropPoint().x, this._cup.getDropPoint().y)
    this._cup.setFigure(f, this._nextFigureColor);
    
    // first render
    // this._cupRenderer.renderCupWithFigure(this._cup)
    console.log('PlayScreen.start')
    
    // finnaly set run status
    this._state = GameState.running
    
    // call callback
    this.listener?.onCupUpdated(this._state, this._cup.getState())
  }
  
  pause ()
  {
    this._state = GameState.paused
    
    // call callback
    this.listener?.onCupUpdated(this._state, this._cup.getState())
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
    console.log('PlayScreen.present')
    
    //
    const gl = this.game.getGLGraphics().getGl();
    
    // Clear the screen.
    gl.clear(gl.COLOR_BUFFER_BIT)
    
    // use texture program
    WebGlProgramManager.sUseTextureProgram(gl);
    
    // render cup
    this._cupRenderer?.renderCupWithFigure(this._cup);
    
    // render next figure
    this.renderNextFigure(gl);
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
    // disable control if game not running
    if (this._state !== GameState.running) return
  
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
    // disable control if game not running
    if (this._state !== GameState.running) return
    
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
    // disable control if game not running
    if (this._state !== GameState.running) return
    
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
    // disable control if game not running
    if (this._state !== GameState.running) return
    
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
    // disable control if game not running
    if (this._state !== GameState.running) return
    
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
    // disable control if game not running
    if (this._state !== GameState.running) return
    
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
   * Callback when line was cleared in the cup
   * @param countLines
   */
  onLineCleared(countLines: number): void
  {
    // call event
    if (this.listener) this.listener.onLineCleared(countLines);
    
    // add special block
    this.addSpecialBlock()
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
   * Prevaous figure moved to cup
   * so this is important event
   */
  onFigureMovedToCup()
  {
    if (!this._nextFigure) return;
    
    // move figure to drop position
    this._nextFigure.setPosition(this._cup.getDropPoint().x, this._cup.getDropPoint().y);
    
    // check intersections with cup
    if (!this._cup.canPlace(this._nextFigure.getFields()))
    {
      
      // and if we can not post figure is all over
      this._state = GameState.over
      console.log ('game over');
    }
    else
    {
      
      // move next figure to drop point
      this._cup.setFigure(this._nextFigure, this._nextFigureColor);
      
      // generate next figure
      this._nextFigure = this.generateNewFigure();
      
      // next figure random color
      this._nextFigureColor = this.generateRandomColor();
    }
    
    // call update callback
    this.listener?.onCupUpdated(this._state, this._cup.getState());
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
  private generateRandomColor():number {
    return Math.floor(Math.random() * 3);
  }
  
  /**
   * Temp field for draw fields
   * @private
   */
  private _block: Vertices;
  
  /**
   * Draw next figure
   * @param gl
   * @private
   */
  private renderNextFigure(gl: WebGL2RenderingContext)
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
    
    
    // const len = fields.length;
    // for (let r = 0; r < len; r++)
    // {
    //   const cellIndex = fields[r]
    //
    //   const c:Coords = this._cup.getCoordsByIndex(cellIndex);
    //
    //   const bottom = (c.y * 32) + 320;
    //   const left = (c.x * 32) + 320;
    //   // if (left < 320) {
    //   //   debugger
    //   // }
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
    //
    // }
  
}