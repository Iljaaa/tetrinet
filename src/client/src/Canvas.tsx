import React from "react";
import {Game} from "./Common/Tetrinet/Game";

export class Canvas extends React.PureComponent
{
  /**
   * Ref to canvas
   * @private
   */
  private _canvas: React.RefObject<HTMLCanvasElement>;
  
  private game:Game;
  
  constructor(props: {}, context: any)
  {
    console.log ('canvas constructor')
    super(props, context);
    
    /**
     * Ref on canvas
     */
    this._canvas = React.createRef();
    
    
    /**
     * Cap
     */
    this.game =  new Game();
    
  }
  
  componentDidMount()
  {
    console.log ('Canvas.componentDidMount', this._canvas);
    
    /**
     * Init game by canvas object
     */
    this.game.init(this._canvas.current as HTMLCanvasElement);
    
    // let figures = new Array<Figure>();
  
    // create renderer
    // this._cupRenderer = new CapRenderer(this._canvas.current as HTMLCanvasElement, this.);
    
    // intercept keyboards events
    document.addEventListener("keydown", this.onKeyDown);
    document.addEventListener("keyup", this.onKeyUp);
    
    // start game
    this.game.start();
  }
  
  componentWillUnmount()
  {
    // clear keyboard intercept
    document.removeEventListener("keydown", this.onKeyDown);
    document.removeEventListener("keyup", this.onKeyUp);
  }
  
  /**
   * Callback mouse down event
   * @param event
   */
  onKeyDown = (event:KeyboardEvent) =>
  {
    console.log (event.code, 'event')
    
    // transfer events
    if (event.code === "KeyD") {
      this.game.onRight();
    }
    
    if (event.code === "KeyA") {
      this.game.onLeft();
    }
    
    if (event.code === "KeyS") {
      this.game.onDown();
    }
    
    if (event.code === "KeyQ") {
      this.game.onRotateCounterClockwise();
    }
    
    //
    if (event.code === "KeyE") {
      this.game.onRotateClockwise();
    }
    
    
    
    if (event.code === "Space") {
      
      // disable page scroll on space
      event.preventDefault();
      
      // drop figure down
      this.game.onDrop();
    }
    
  }
  
  /**
   * On document key up
   * @param event
   */
  onKeyUp = (event:KeyboardEvent) =>
  {
    const keyName = event.key;
    
    // As the user releases the Ctrl key, the key is no longer active,
    // so event.ctrlKey is false.
    if (keyName === "Control") {
      alert("Control key was released");
    }
  }
  
  render () {
    return <div>
      {/* @ts-ignore */}
      
      <canvas id="canvas" width={500} height={400} style={{border: "solid 2px orange"}} ref={this._canvas}/>
    </div>
  }
}
