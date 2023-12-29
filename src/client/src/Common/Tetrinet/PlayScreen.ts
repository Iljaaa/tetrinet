import {CupEventListener, CupWithFigureImpl} from "./CapWithFigureImpl";
import {CapRenderer} from "./CapRenderer";
import {FpsCounter} from "./helpers/FpsCounter";
import {Texture} from "../framework/Texture";
import {WebGlTexture} from "../framework/impl/WebGlTexture";
import {WebGlScreen} from "../framework/impl/WebGlScreen";
import {GameEventListener, Tetrinet} from "./Tetrinet";

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
export class PlayScreen extends WebGlScreen implements CupEventListener
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
    this.texture = new WebGlTexture();
  }
  
  /**
   * Set event listener
   * @param listener
   */
  public setEventListener (listener:GameEventListener):PlayScreen{
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
    console.log ('Playscreen.init');
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
    window.requestAnimationFrame(this.update)
  }
  
  private t:number = 0
  
  /**
   * Update cup
   * @param timeStamp
   */
  update = (timeStamp:number) =>
  {
    
    if (this.t === undefined) {
      this.t = timeStamp;
    }
    
    const deltaTime:number = timeStamp - this.t
    this.t = timeStamp
    
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
    
    
    // request next frame
    window.requestAnimationFrame(this.update)
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
