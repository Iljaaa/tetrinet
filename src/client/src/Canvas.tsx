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
    // bind events
    this.game.getInput().bind();
    
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
    // unbind events
    this.game.getInput().unBind();
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
