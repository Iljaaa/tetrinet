import React from "react";
import {Tetrinet} from "./Common/Tetrinet/Tetrinet";

import sprite from "./sprite.png"
import {Assets} from "./Common/Tetrinet/Assets";
import {GameState, PlayScreen, PlayScreenEventListener} from "./Common/Tetrinet/screens/PlayScreen";
import {CupState} from "./Common/Tetrinet/models/CupState";
import {WebGlProgramManager} from "./Common/framework/impl/WebGlProgramManager";
import {SocketSingletone} from "./Common/Socket/SocketSingletone";
import {SocketEventListener} from "./Common/Socket/SocketEventListener";
import {MessageData} from "./entities/MessageData";
import {UpdateData} from "./entities/UpdateData";
import {StartData} from "./entities/StartData";

type State =
{
  /**
   * Currenct schoe
   */
  score: number,
  
  /**
   * Cup state
   */
  currentGameState?:GameState
  
  /**
   * Party id
   */
  partyId: string,
  
  /**
   * Index inside party
   */
  partyIndex?: number
}

export class Canvas extends React.PureComponent<{}, State> implements PlayScreenEventListener, SocketEventListener
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
  // private socket:Socket | undefined;
  
  
  public state:State = {
    partyId: "",
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
    
    // generate user id
  }
  
  /**
   * Callback from game when lines was cleared
   * @param countLines
   */
  onLineCleared (countLines:number) {
    this.setState({score: this.state.score + ((countLines + countLines - 1) * 10) })
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
    Assets.load(sprite, () =>
    {
      // start game
      // this.game.startGame();
      console.log ('Assets loaded, updates graphics');
      
      //
      const gl:WebGL2RenderingContext|null = this.game.getGLGraphics().getGl();
      
      // bind this texture
      Assets.sprite.bind(gl)
      
      // bind texture in mixed program
      WebGlProgramManager.setUpIntoMixedProgramImageSize(gl, Assets.sprite.getImage().width, Assets.sprite.getImage().height);
      
      // bind texture in graphic program
      WebGlProgramManager.setUpIntoTextureProgramImageSize(gl, Assets.sprite.getImage().width, Assets.sprite.getImage().height);
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
  
  /**
   *
   */
  onPlayClicked = () =>
  {
    console.log ('onPlayClicked');
    
    // open socket connection
    // this.socket = new Socket();
    SocketSingletone.openConnection(() =>
    {
      // prepare
      this.game.prepareToGame(this)
      
      // when socket open we start game
      this.game.playGame();
    })
  }
  
  onPauseClicked = () =>
  {
    console.log ('onPauseClicked');
    this.game.pauseGame();
  }
  
  /**
   * Here we start party
   */
  onStartClicked = () =>
  {
    console.log ('onStartClicked');
    
    // open socket connection
    // this.socket = new Socket();
    SocketSingletone.reOpenConnection(() =>
    {
      // send start party
      // todo: make special object
      SocketSingletone.getInstance()?.sendDataAndWaitAnswer({
        type: "start"
      }, (data:StartData) =>
      {
        console.log ('startDataReceived', data);
        
        this.setState({
          partyId: data.partyId,
          partyIndex: data.yourIndex
        });

        // prepare cup
        this.game.prepareToGame(this);
        
        // set listener when game starts
        SocketSingletone.getInstance()?.setListener(this);
      })
      
    })
  }
  
  /**
   * Here we join to party
   */
  onJoinClicked = () =>
  {
    console.log ('onJoinClicked');
    
    // open socket connection
    // this.socket = new Socket();
    SocketSingletone.reOpenConnection(() =>
    {
      // send start party
      // todo: make special object
      SocketSingletone.getInstance()?.sendDataAndWaitAnswer({
        type: "join"
      }, (data:StartData) =>
      {
        console.log ('joinDataReceived', data);
        
        this.setState({
          partyId: data.partyId,
          partyIndex: data.yourIndex
        });
        
        // when socket open we start game
        this.game.prepareToGame(this);

        // set listener when game starts
        SocketSingletone.getInstance()?.setListener(this);
      })
      
    })
  }
  
  onWatchClicked = () =>
  {
    console.log ('onWatchClicked');
    
    // open socket connection
    // this.socket = new Socket();
    SocketSingletone.openConnection(() =>
    {
      // send start party
      // todo: make special object
      SocketSingletone.getInstance()?.sendDataAndWaitAnswer({
        type: "watch"
      }, (data) =>
      {
        console.log ('startDataReceived', data);
        
        
        
        // when socket open we start game
        this.game.watchGame();
      })
      
      
      // when socket open we start game
      this.game.watchGame();
    })
    
  }

  /**
   * This is callback method when something happen in cup
   */
  onCupUpdated(state:GameState, cupState:CupState): void
  {
    console.log('onCupUpdated', state, cupState);
    this.setState({currentGameState: state})

    const data:UpdateData = {
      type: "set",
      partyId: this.state.partyId,
      partyIndex: this.state.partyIndex as number,
      state: state,
      cup: cupState
    }

    // send data to socket
    // todo: make here special object
    // const sendData = {
    //   type: "set",
    //   state: state,
    //   cup: cupState
    // }

    SocketSingletone.getInstance()?.sendData(data)
  }
  
  /**
   * This is callback method from socket
   * it is here because we need to get event that party starts
   * todo: move events listener to play screen
   * @param data
   */
  onMessageReceive(data: MessageData): void
  {
    console.log (data, 'Canvas.onMessageReceive');
    
    // party is created, it is time to play
    if (data.type === "letsPlay") {
      this.game.playGame();
      return
    }

    // update cups state from server data
    if (data.type === "afterSet")
    {
      // cups without our cup
      console.log (this.state.partyIndex, data.cups, 'after set', typeof data.cups, Object.keys(data.cups));

      // find opponent key
      const opponentKey = Object.keys(data.cups).find((key:string) => {
        return parseInt(key) !== this.state.partyIndex
      })

      if (opponentKey) this.game.setOpponentCup(data.cups[parseInt(opponentKey)]);
    }

  }
  
  
  render () {
    return <div style={{padding: "2rem"}}>
      <div style={{display: "flex"}}>
        <div>
          <canvas id="canvas" width={800} height={704} style={{border: "solid 2px orange"}} ref={this._canvas}/>
        </div>
        <div style={{textAlign: "left", paddingLeft: "2rem"}}>
          
          <div>score <b>{this.state.score}</b></div>
          <div style={{margin: ".25rem 0 0 0"}}>state <b>{this.state.currentGameState}</b></div>
          <div style={{margin: ".25rem 0 0 0"}}>party id: <b>{this.state.partyId}</b></div>
          <div style={{margin: ".25rem 0 0 0"}}>party index: <b>{this.state.partyIndex}</b></div>
          
          <div style={{marginTop: "1rem"}}>
            <div>
              <button onClick={this.onPlayClicked}>Play</button>
            </div>
            <div style={{marginTop: ".25rem"}}>
              <button onClick={this.onPauseClicked}>Pause</button>
            </div>
            <hr/>
            <div>
              <button onClick={this.onStartClicked}>Start party</button>
            </div>
            <div style={{marginTop: ".25rem"}}>
              <button onClick={this.onJoinClicked}>Join party</button>
            </div>
            <hr />
            <div style={{marginTop: ".25rem"}}>
              <button onClick={this.onWatchClicked}>Watch</button>
            </div>
          </div>
          
          <div style={{margin: "1rem 0 0 0"}}>
            <Help/>
          </div>
          
          <div style={{display: "flex", justifyContent: "flex-start", marginTop: "1rem"}}>
            <div style={{backgroundColor: "red", width: "40px", height: "40px"}}></div>
            <div style={{backgroundColor: "green", width: "40px", height: "40px"}}></div>
            <div style={{backgroundColor: "blue", width: "40px", height: "40px"}}></div>
          </div>
          
          <h2>todo:</h2>
          <ul>
            <li>Draw paused alert</li>
            <li>Add continue button</li>
            <li>Block buttons by state</li>
            <li>Show loader until socket connecting</li>
            
            <li>Resend messages to all connected clients</li>
            <li>Temporary remove bonus field plus</li>
            <li>Just play tetris</li>
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
