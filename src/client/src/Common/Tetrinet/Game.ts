import {CupWithFigureImpl} from "./CapWithFigureImpl";
import {CapRenderer} from "./CapRenderer";

/**
 * @vaersion 0.0.1
 */
export class Game
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
  
  constructor()
  {
    this._cup =  new CupWithFigureImpl();
  }
  
  /**
   * Init render by canvas elemet
   */
  init (canvas:HTMLCanvasElement)
  {
    // init cup render
    this._cupRenderer = new CapRenderer(canvas as HTMLCanvasElement, this._cup);
  }
  
  /**
   * Game starts after init
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
  private aaa:number = 0
  
  /**
   * Update cup
   * @param timeStamp
   */
  update = (timeStamp:number) =>
  {
    
    if (this.t === undefined) {
      this.t = timeStamp;
    }
    
    const deltaTime = timeStamp - this.t
    this.t = timeStamp
    
    this.aaa += deltaTime
    
    // one sec
    if (this.aaa > 1000) {
      this.onDown();
      this.aaa = 0;
    }
    
    // request next frame
    window.requestAnimationFrame(this.update)
  }
  
  onRight() {
    if (this._cupRenderer && this._cup.moveFigureRight()){
      this._cupRenderer.renderCupWithFigure(this._cup)
    }
  }
  
  onLeft(){
    if (this._cupRenderer && this._cup.moveFigureLeft()){
      this._cupRenderer.renderCupWithFigure(this._cup)
    }
  }
  
  onDown(){
    if (this._cupRenderer)
    {
      // if figure does not have not moved we need to create a new one
      if (!this._cup.moveFigureDown())
      {
        //
        
        
        // create a new figure
      }
      
      this._cupRenderer.renderCupWithFigure(this._cup)
    }
  }
  
  /**
   * Drop it almost as down but to the bottom
   */
  onDrop(){
    if (this._cupRenderer)
    {
      // if figure does not have not moved we need to create a new one
      if (!this._cup.dropFigureDown())
      {
        // creal drop times
        this.aaa = 0;
        
        // create a new figure
      }
      
      this._cupRenderer.renderCupWithFigure(this._cup)
    }
  }
  
  onRotateClockwise ()
  {
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
}
