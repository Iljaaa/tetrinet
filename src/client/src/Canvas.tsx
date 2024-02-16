import React from "react";

import {GameState, MessageTypes, RequestTypes} from "./Common/Tetrinet/types";
import {StartResponse} from "./Common/Tetrinet/types/responses";

import {PauseRequest, ResumeRequest, SetRequest, StartRequest} from "./Common/Tetrinet/types/requests";

import {AddLineMessage, Message, SetMessage} from "./Common/Tetrinet/types/messages";

import {Tetrinet} from "./Common/Tetrinet/Tetrinet";
import {Assets} from "./Common/Tetrinet/Assets";
import {PlayScreenEventListener} from "./Common/Tetrinet/screens/PlayScreen";
import {CupData} from "./Common/Tetrinet/models/CupData";
import {WebGlProgramManager} from "./Common/framework/impl/WebGlProgramManager";
import {SocketSingletone} from "./Common/Socket/SocketSingletone";
import {SocketEventListener} from "./Common/Socket/SocketEventListener";

import sprite from "./sprite.png"
import {ResumedMessage} from "./Common/Tetrinet/types/messages/ResumedMessage";
import {PausedMessage} from "./Common/Tetrinet/types/messages/PausedMessage";
import {LetsPlayMessage} from "./Common/Tetrinet/types/messages/LetsPlayMessage";
import {Bonus} from "./Common/Tetrinet/types/Bonus";
import {SendBonusRequest} from "./Common/Tetrinet/types/requests/SendBonusRequest";
import {GetBonusMessage} from "./Common/Tetrinet/types/messages/GetBonusMessage";

type State =
{
  /**
   * Current score
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
   * State
   */
  public state:State = {
    partyId: "",
    score: 0
  }

  /**
   * This is the main party index,
   * because in the stat it is updated with delay
   * @private
   */
  private partyIndex:number|null = null;
  
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
  onLineCleared (countLines:number)
  {
    // set score
    this.setState({score: this.state.score + ((countLines + countLines - 1) * 10) })

    // send request to add lines to opponent
    this.sendAddLineToOpponent(countLines);
  }

  /**
   * Here we send request to opponent to add few rows
   */
  sendAddLineToOpponent (countClearedLines:number) {
    //
    if (countClearedLines > 1)
    {
      // send command
      const data = {
        type: RequestTypes.addLine,
        partyId: this.state.partyId,
        partyIndex: this.partyIndex as number,
        linesCount: countClearedLines - 1,
        source: this.partyIndex, // now this is same that partyIndex
        target: null, // target should be selected player, but now we have only two players
    }

      SocketSingletone.getInstance()?.sendData(data)
    }
  }

  onSendBonusToOpponent (bonus:Bonus, opponentIndex:number){
    console.log('Canvas.onSendBonusToOpponent', bonus, opponentIndex)


    // send command
    const data:SendBonusRequest = {
      type: RequestTypes.sendBonus,
      partyId: this.state.partyId,
      partyIndex: this.partyIndex as number,
      source: this.partyIndex as number, // now this is same that partyIndex
      target: opponentIndex, //
      bonus: bonus
    }

    SocketSingletone.getInstance()?.sendData(data)
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

  /**
   * Pause game button clicked
   */
  onPauseClicked = () =>
  {
    console.log ('onPauseClicked');

    // request data
    const request:PauseRequest = {
      type: RequestTypes.pause,
      partyId: this.state.partyId,
      partyIndex: this.partyIndex as number,
      initiator: this.partyIndex as number
    }

    // send data
    SocketSingletone.getInstance()?.sendData(request);
  }

  /**
   * Resume clicked
   */
  onResumeClicked = () =>
  {
    console.log ('onResumeClicked');

    // request data
    const request:ResumeRequest = {
      type: RequestTypes.resume,
      partyId: this.state.partyId,
      partyIndex: this.partyIndex as number,
      initiator: this.partyIndex as number
    }

    // send data
    SocketSingletone.getInstance()?.sendData(request);

    // set game resume
    // this.game.resumeGame(true);
  }

  /**
   * Here we join to party
   */
  onJoinClicked = () =>
  {
    console.log ('onJoinClicked');
    
    // open socket connection
    // this.socket = new Socket();
    SocketSingletone.reOpenConnection(() => {
      const request:StartRequest = {
        type: RequestTypes.join,
        partyId: "",
        partyIndex: -1
      }
      // SocketSingletone.getInstance()?.sendDataAndWaitAnswer(request, this.onJoinResponse)

      // set listener when game starts
      SocketSingletone.getInstance()?.setListener(this);

      // when socket open prepare to game
      this.game.prepareToGame(this);

      SocketSingletone.getInstance()?.sendData(request)
    })
  }

  /**
   * When answer to join received
   * @param data
   */
  // onJoinResponse = (data:StartResponse) =>
  // {
  //   console.log ('onJoinResponse', data);
  //
  //   // this.setState({
  //   //   partyId: data.partyId,
  //   //   partyIndex: data.yourIndex
  //   // });
  //
  //   // when socket open we start game
  //   this.game.prepareToGame(this);
  //
  //   // set listener when game starts
  //   SocketSingletone.getInstance()?.setListener(this);
  // }
  
  onWatchClicked = () =>
  {
    console.log ('onWatchClicked');
    
    // open socket connection
    // this.socket = new Socket();
    SocketSingletone.openConnection(() =>
    {
      // todo: make special object
      const request = {type: "watch"}

      // send start party
      SocketSingletone.getInstance()?.sendDataAndWaitAnswer(request, (data) => {
        // when socket open we start game
        this.game.watchGame();
      })
    })
    
  }

  /**
   * This is callback method when something happen in cup
   */
  onCupUpdated(state:GameState, cupState:CupData): void
  {
    console.log('Canvas.onCupUpdated', state, cupState);

    // just save game state
    // this.setState({currentGameState: state})
    const data:SetRequest = {
      type: RequestTypes.set,
      partyId: this.state.partyId,
      partyIndex: this.partyIndex as number,
      state: state,
      cup: cupState
    }

    SocketSingletone.getInstance()?.sendData(data)
  }
  
  /**
   * This is callback method from socket
   * it is here because we need to get event that party starts
   * todo: move events listener to play screen
   * @param data
   */
  onMessageReceive(data: Message): void
  {
    console.log (data, 'Canvas.onMessageReceive');

    switch (data.type) {
      // party is created, it is time to play
      case MessageTypes.letsPlay: this.processLetsPlay(data as LetsPlayMessage); break;
      // some cup was updated, and we process this message
      case MessageTypes.afterSet: this.processAfterSet(data as SetMessage); break;
      // we receive add line command
      case MessageTypes.addLine: this.processAddLine(data as AddLineMessage); break;
      case MessageTypes.getBonus: this.processGetBonus(data as GetBonusMessage); break;
      case MessageTypes.paused: this.processPause(data as PausedMessage); break;
      case MessageTypes.resumed: this.processResume(data as ResumedMessage); break;
    }
  }

  /**
   * Part created and we get from server
   * signal to start the game
   */
  processLetsPlay (data:LetsPlayMessage)
  {
    console.log ('Canvas.processLetsPlay');

    // save party index
    this.partyIndex = data.yourIndex

    // save party data
    this.setState({
      partyId: data.partyId,
      partyIndex: data.yourIndex
    });

    // start game
    this.game.playGame();
  }

  /**
   * todo: move this method to play screen
   * @param data
   */
  processAfterSet (data:SetMessage)
  {
    // cups without our cup
    console.log ('canvas.processAfterSet', data.cups);

    // is this is game over
    if (data.state === GameState.over){
      this.game.setGameOver();
    }

    // find opponent key
    const opponentKey = Object.keys(data.cups).find((key:string) => {
      return parseInt(key) !== this.partyIndex
    })

    // todo: update other cups
    if (opponentKey) this.game.setOpponentCup(data.cups[parseInt(opponentKey)]);
  }

  /**
   * We receive add line command
   * @param data
   */
  processAddLine(data:AddLineMessage) {
    this.game.addRowsToCup(data.linesCount);
  }

  processGetBonus (data:GetBonusMessage) {
    this.game.realiseBonus(data.bonus);
  }

  processPause(data:PausedMessage) {
    this.setState({currentGameState: GameState.paused})
    this.game.pauseGame()
  }

  processResume(data:ResumedMessage) {
    this.setState({currentGameState: GameState.running})
    this.game.resumeGame();
  }

  render () {
    return <div style={{display: "flex", flexDirection: "column", alignItems: "center", padding: "0 1rem"}}>

      <div style={{display: "flex", alignItems: "center", marginBottom: "1rem", width: "100%"}}>
        <div style={{display: "flex", alignItems: "center", flex: "1"}}>
          <div>
            <button onClick={this.onPlayClicked} disabled={true}>Play</button>
            <button onClick={this.onJoinClicked}>Join</button>
          </div>
          <div>
            <button onClick={this.onPauseClicked}>Pause</button>
            <button onClick={this.onResumeClicked}>Resume</button>
          </div>
          <div>
            <button onClick={this.onWatchClicked} disabled={true}>Watch</button>
          </div>
        </div>
        <div>
          <div style={{display: "flex", alignItems: "center"}}>
            <div>score <b>{this.state.score}</b></div>
            <div style={{margin: "0 0 0 1rem"}}>state <b>{this.state.currentGameState}</b></div>
            <div style={{margin: "0 0 0 1rem"}}>party id: <b>{this.state.partyId}</b></div>
            <div style={{margin: "0 0 0 1rem"}}>party index: <b>{this.state.partyIndex}</b></div>
          </div>
        </div>
      </div>

      <div>
        <canvas id="canvas" width={1000} height={704} style={{border: "solid 2px orange"}} ref={this._canvas}/>
      </div>
    </div>
  }
}
