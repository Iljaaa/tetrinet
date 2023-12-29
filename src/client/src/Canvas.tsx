import React from "react";
import {GameEventListener, Tetrinet} from "./Common/Tetrinet/Tetrinet";

import sprite from "./sprite.png"
import {Assets} from "./Common/Tetrinet/Assets";

type State = {
  score: number
}

export class Canvas extends React.PureComponent<{}, State> implements GameEventListener
{
  /**
   * Ref to canvas
   * @private
   */
  private readonly _canvas: React.RefObject<HTMLCanvasElement>;
  
  private game:Tetrinet;
  
  public state:State = {
    score: 0
  }
  
  constructor(props: { }, context: any)
  {
    super(props, context);
    
    /**
     * Ref on canvas
     */
    this._canvas = React.createRef();
    
    // create game
    // this.game =  new PlayScreen();
    this.game = new Tetrinet()
    this.game.setGameEventListener(this);
    
  }
  
  /**
   * Callback from game when lines was cleared
   * @param countLines
   */
  onLineCleared (countLines:number) {
    this.setState({score: this.state.score + ((countLines + countLines - 1) * 10) })
  }
  
  componentDidMount()
  {
    
    // intercept keyboards events
    // todo: move it to game init, when input inited
    document.addEventListener("keydown", this.onKeyDown);
    document.addEventListener("keyup", this.onKeyUp);
    
    
    /**
     * Init game graphics
     */
    this.game.initGraphic(this._canvas.current as HTMLCanvasElement)
    
    // start loading assets
    Assets.load(sprite, () => {
      // start game
      this.game.startGame();
    })
    
    
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
      
      <canvas id="canvas" width={320} height={640} style={{border: "solid 2px orange"}} ref={this._canvas}/>
      <div>score {this.state.score}</div>
      <div>{sprite}</div>
    </div>
  }
}
