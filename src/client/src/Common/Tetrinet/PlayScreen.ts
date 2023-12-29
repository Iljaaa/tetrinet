import {CupEventListener, CupWithFigureImpl} from "./CapWithFigureImpl";
import {CapRenderer} from "./CapRenderer";
import {FpsCounter} from "./helpers/FpsCounter";
import {Texture} from "../framework/Texture";
import {WebGlTexture} from "../framework/impl/WebGlTexture";
import {WebGlScreen} from "../framework/impl/WebGlScreen";
import {GameEventListener, Tetrinet} from "./Tetrinet";
import {WebInputEventListener} from "../framework/impl/WebInput";

/**
 * Game states
 */
enum GameState {
  running = 0,
  over = 100,
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
  private _cupRenderer: CapRenderer | undefined;
  
  /**
   * Timer for next down
   * @private
   */
  private _downTimer:number = 0;
  
  /**
   * Current game state
   * @private
   */
  private _state:GameState = GameState.running;
  
  /**
   * @private
   */
  private listener: GameEventListener|undefined;
  
  /**
   *
   * @private
   */
  private fpsCounter:FpsCounter;
  
  /**
   * Main texture
   * @private
   */
  private texture:Texture;
  
  /**
   * In this constructor we create cup
   */
  constructor(game:Tetrinet)
  {
    super(game)
    
    this._cup =  new CupWithFigureImpl(this);
    
    this.fpsCounter = new FpsCounter();
    
    // create texture
    // todo: remove it
    this.texture = new WebGlTexture();
    
    // bind this to input listener
    this.game.getInput().setListener(this);
  }
  
  /**
   * Set event listener
   * @param listener
   */
  public setGameEventListener (listener:GameEventListener):PlayScreen{
    this.listener = listener;
    return this
  }
  
  /**
   * Init render by canvas element
   * todo: create interface game and describe this method there
   * todo: make to set listener other method
   */
  init (texture:WebGlTexture)
  {
    console.log ('PlayScreen.init');
    this._cupRenderer = new CapRenderer(this.game.getGLGraphics().getGl(), this._cup, texture);
  }
  
  /**
   * It starts the game
   * must be called after init!
   */
  start ()
  {
    if (!this._cupRenderer){
      throw new Error('Cup render not initialised')
    }
    
    // init first figure in cup
    this._cup.start();
    
    // first render
    this._cupRenderer.renderCupWithFigure(this._cup)
    
    // loop this method
    // todo: move this method upper
    // window.requestAnimationFrame(this.update)
  }
  
  /**
   * Update cup
   * @param deltaTime
   */
  update (deltaTime:number):void
  {
    
    
    if (this._state === GameState.running) {
      //
      // this.updateRunning();
      
      this._downTimer += deltaTime
      
      // one sec
      if (this._downTimer > 1000) {
        this.onDown();
        this._downTimer = 0;
      }
      
    }
    
    else if (this._state === GameState.over) {
      //
      // this.updateRunning();
    }
    
    // click fps counter
    this.fpsCounter.update(deltaTime)
    
    
  }
  
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
  
  
  /**
   * Down figure
   */
  onDown()
  {
    if (this._cupRenderer)
    {
      // if figure does not have not moved we need to create a new one
      if (!this._cup.moveFigureDown())
      {
        
        // create a new figure
      }
      
      this._cupRenderer.renderCupWithFigure(this._cup)
    }
  }
  
  /**
   * Drop it almost as down but to the bottom
   */
  onDrop()
  {
    if (this._cupRenderer)
    {
      // if figure does not have not moved we need to create a new one
      if (!this._cup.dropFigureDown())
      {
        // clear next the down step time
        this._downTimer = 0;
        
        // create a new figure
      }
      
      this._cupRenderer.renderCupWithFigure(this._cup)
    }
  }
  
  onRotateClockwise () {
    if (this._cupRenderer)
    {
      // rotate figure in the cup
      this._cup.rotateClockwise();
      
      this._cupRenderer.renderCupWithFigure(this._cup)
    }
  }
  
  onRotateCounterClockwise () {
    if (this._cupRenderer)
    {
      // rotate figure in the cup
      this._cup.rotateCounterClockwise();
      
      // rerender
      this._cupRenderer.renderCupWithFigure(this._cup)
    }
  }
  
  onGameOver(): void {
    this._state = GameState.over
    
    // todo: do somethimg on game over
    alert("game over")
    debugger
  }
  
  /**
   * Callback when line was cleared in the cup
   * @param countLines
   */
  onLineCleared(countLines: number): void {
    if (this.listener) this.listener.onLineCleared(countLines);
  }
  
  onRight() {
    if (this._cupRenderer && this._cup.moveFigureRight()){
      this._cupRenderer.renderCupWithFigure(this._cup)
    }
  }
  
  onLeft() {
    if (this._cupRenderer && this._cup.moveFigureLeft()){
      this._cupRenderer.renderCupWithFigure(this._cup)
    }
  }
}
