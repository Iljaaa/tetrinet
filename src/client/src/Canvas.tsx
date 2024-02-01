import React from "react";
import {PlayScreenEventListener, Tetrinet} from "./Common/Tetrinet/Tetrinet";

import sprite from "./sprite.png"
import {Assets} from "./Common/Tetrinet/Assets";
import {Socket} from "./Common/Socket/Socket";

type State = {
  score: number
}

export class Canvas extends React.PureComponent<{}, State> implements PlayScreenEventListener
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
    
  }
  
  /**
   * Callback from game when lines was cleared
   * @param countLines
   */
  onLineCleared (countLines:number) {
    this.setState({score: this.state.score + ((countLines + countLines - 1) * 10) })
  }
  
  /**
   * This is callback method when something happen in cup
   */
  onCupUpdated(): void {
    console.log('onCupUpdated');
  }
  
  
  
  /**
   *
   */
  componentDidMount()
  {
    /**
     * bind controller events
     */
    this.game.getInput().bind();
    
    /**
     * Init game graphics
     */
    this.game.initGraphic(this._canvas.current as HTMLCanvasElement)
    
    // start loading assets
    Assets.load(sprite, () => {
      // start game
      // this.game.startGame();
      
      console.log ('Assets loaded, game redy to start');
    })
    
    
    // const s = new Socket()
    // s.open();
    
    // socket.onopen = connectionOpen;
    // socket.onmessage = messageReceived;
  }
  
  componentWillUnmount()
  {
    // unbind events
    this.game.getInput().unBind();
  }
  
  onStartClicked = () =>
  {
    console.log ('onStartClicked');
    
    // start new game
    this.game.startGame(this);
  }
  
  onRestartClicked = () => {
    console.log ('onRestartClicked');
  }
  
  onPauseClicked = () => {
    console.log ('onPauseClicked');
    
    this.game.pauseGame();
  }
  
  onStopClicked = () => {
    console.log ('onStopClicked');
  }
  
  render () {
    return <div style={{padding: "2rem"}}>
      <div style={{display: "flex"}}>
        <div>
          <canvas id="canvas" width={500} height={704} style={{border: "solid 2px orange"}} ref={this._canvas}/>
        </div>
        <div style={{textAlign: "left", paddingLeft: "2rem"}}>
          
          <div style={{margin: "0 0 1rem 0"}}>score <b>{this.state.score}</b></div>
          <Help />
          <div style={{display: "flex", justifyContent: "flex-start", marginTop: "1rem"}}>
            <div style={{backgroundColor: "red", width: "40px", height: "40px"}}></div>
            <div style={{backgroundColor: "green", width: "40px", height: "40px"}}></div>
            <div style={{backgroundColor: "blue", width: "40px", height: "40px"}}></div>
          </div>
          
          <div style={{marginTop: "1rem"}}>
            <div>
              <button onClick={this.onStartClicked}>Start</button>
            </div>
            <div style={{marginTop: ".25rem"}}>
              <button onClick={this.onRestartClicked}>Restart</button>
            </div>
            <div style={{marginTop: ".25rem"}}>
              <button onClick={this.onPauseClicked}>Pause</button>
            </div>
            <div style={{marginTop: ".25rem"}}>
              <button onClick={this.onStopClicked}>Stop</button>
            </div>
          </div>
          
          <h2>todo:</h2>
          <ul>
            <li>Draw paused alert</li>
          </ul>
        
        </div>
      </div>
    </div>
  }
}


const Help = () => {
  return <div>
    left - A<br/>
    right - D<br/>
    rotate clockwise - E<br/>
    rotate counterclockwise - Q<br/>
    down - S<br/>
    drop - Space
  </div>
}
