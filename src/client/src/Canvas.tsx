import React from "react";
import {Tetrinet} from "./Common/Tetrinet/Tetrinet";

import sprite from "./sprite.png"
import {Assets} from "./Common/Tetrinet/Assets";
import {Socket} from "./Common/Socket/Socket";
import {GameState, PlayScreenEventListener} from "./Common/Tetrinet/PlayScreen";
import {CupState} from "./Common/Tetrinet/models/CupState";

type State = {
  score: number,
  currentGameState?:GameState
}

export class Canvas extends React.PureComponent<{}, State> implements PlayScreenEventListener
{
  /**
   * Ref to canvas
   * @private
   */
  private readonly _canvas: React.RefObject<HTMLCanvasElement>;
  
  /**
   * Game object
   * @private
   */
  private game:Tetrinet;
  
  /**
   * Socket connection
   * @private
   */
  private socket:Socket | undefined;
  
  public state:State = {
    score: 0,
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
  onCupUpdated(state:GameState, cupState:CupState): void
  {
    console.log('onCupUpdated', state, cupState);
    this.setState({currentGameState: state})
    
    // todo: make send data
    
    // send data to socket
    if (this.socket) {
      this.socket.sendData(cupState)
    }
  }
  
  /**
   *
   */
  componentDidMount()
  {
    /**
     * bind controller events
     * i'm not sure that initialization must be here
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
      
      console.log ('Assets loaded, game ready to start');
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
    
    // open socket connection
    this.socket = new Socket();
    this.socket.open(() => {
      
      // when socket open we start game
      this.game.playGame(this);
      
      
    });
    
  }
  
  onPauseClicked = () =>
  {
    console.log ('onPauseClicked');
    this.game.pauseGame();
  }
  
  onWatchClicked = () => {
    console.log ('onWatchClicked');
  }
  
  render () {
    return <div style={{padding: "2rem"}}>
      <div style={{display: "flex"}}>
        <div>
          <canvas id="canvas" width={500} height={704} style={{border: "solid 2px orange"}} ref={this._canvas}/>
        </div>
        <div style={{textAlign: "left", paddingLeft: "2rem"}}>
          
          <div>score <b>{this.state.score}</b></div>
          <div style={{margin: ".25rem 0 0 0"}}>state <b>{this.state.currentGameState}</b></div>
          
          <div style={{marginTop: "1rem"}}>
            <div>
              <button onClick={this.onStartClicked}>Start</button>
            </div>
            <div style={{marginTop: ".25rem"}}>
              <button onClick={this.onPauseClicked}>Pause</button>
            </div>
            <div style={{marginTop: ".25rem"}}>
              <button onClick={this.onWatchClicked}>Watch</button>
            </div>
          </div>
          
          <div style={{margin: "1rem 0 0 0"}}>
            <Help />
          </div>
          
          <div style={{display: "flex", justifyContent: "flex-start", marginTop: "1rem"}}>
            <div style={{backgroundColor: "red", width: "40px", height: "40px"}}></div>
            <div style={{backgroundColor: "green", width: "40px", height: "40px"}}></div>
            <div style={{backgroundColor: "blue", width: "40px", height: "40px"}}></div>
          </div>
          
          <h2>todo:</h2>
          <ul>
            <li>Draw paused alert</li>
            <li>Start with two buttons play and watch</li>
            <li>Add continue button</li>
            <li>Block buttons by state</li>
            <li>Show loader until socket connecting</li>
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
