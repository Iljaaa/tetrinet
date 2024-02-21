import React from "react";

import {GameState, MessageTypes, RequestTypes} from "./Common/Tetrinet/types";
import {StartResponse} from "./Common/Tetrinet/types/responses";

import {PauseRequest, ResumeRequest, SetRequest, StartRequest} from "./Common/Tetrinet/types/requests";

import {AddLineMessage, Message, SetMessage} from "./Common/Tetrinet/types/messages";

import {Assets} from "./Common/Tetrinet/Assets";
import {PlayScreenEventListener} from "./Common/Tetrinet/screens/PlayScreen";
import {CupData} from "./Common/Tetrinet/models/CupData";
import {WebGlProgramManager} from "./Common/framework/impl/WebGlProgramManager";
import {SocketSingleton} from "./Common/SocketSingleton";
import {SocketEventListener} from "./Common/Socket/SocketEventListener";

import sprite from "./sprite.png"
import {ResumedMessage} from "./Common/Tetrinet/types/messages/ResumedMessage";
import {PausedMessage} from "./Common/Tetrinet/types/messages/PausedMessage";
import {LetsPlayMessage} from "./Common/Tetrinet/types/messages/LetsPlayMessage";
import {Bonus} from "./Common/Tetrinet/types/Bonus";
import {SendBonusRequest} from "./Common/Tetrinet/types/requests/SendBonusRequest";
import {GetBonusMessage} from "./Common/Tetrinet/types/messages/GetBonusMessage";
import {TetrinetSingleton} from "./Common/TetrinetSingleton";
import {ChatItem} from "./Common/Tetrinet/types/ChatItem";

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
   * this is your socket id
   */
  playerId: string
}

/**
 * Map keys 1-9
 * with player id
 */
interface KeysPlayerMap {
  [index: number]: string
}

/**
 * Collection of cups data received from server
 * after update
 */
export interface CupsDataCollection {
  [index: string]: CupData
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
  // private game:Tetrinet;

  /**
   * State
   * todo: remove state from here
   */
  public state:State = {
    partyId: "",
    playerId: "",
    score: 0
  }

  /**
   * Party id
   * we should use it here not from state
   */
  private partyId: string = '';

  /**
   * This is id of your socket
   * received when you start search party
   * @private
   */
  private playerId:string = '';

  /**
   * This is mapping keys to index inside party
   */
  private partyIndexToPlayerId:KeysPlayerMap = {};

  /**
   * Chat and log
   */
  private chat:Array<ChatItem> = [];

  constructor(props: { }, context: any)
  {
    super(props, context);
    
    /**
     * Ref on canvas
     */
    this._canvas = React.createRef();
    
    // create game
    // this.game =  new PlayScreen();
    // this.game = new Tetrinet()
    TetrinetSingleton.init();
    
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
    // this.sendAddLineToOpponent(countLines);
  }

  /**
   * @deprecated
   * Here we send request to opponent to add few rows
   */
  // sendAddLineToOpponent (countClearedLines:number) {
  //   //
  //   if (countClearedLines > 1)
  //   {
  //     // send command
  //     const data = {
  //       type: RequestTypes.addLine,
  //       partyId: this.partyId,
  //       partyIndex: this.partyIndex as number,
  //       linesCount: countClearedLines - 1,
  //       source: this.partyIndex, // now this is same that partyIndex
  //       target: null, // target should be selected player, but now we have only two players
  //   }
  //
  //     SocketSingletone.getInstance()?.sendData(data)
  //   }
  // }

  /**
   * Send a request with gift
   * @param bonus
   * @param opponentIndex
   */
  onSendBonusToOpponent (bonus:Bonus, opponentIndex:number)
  {
    console.log('Canvas.onSendBonusToOpponent', bonus, opponentIndex)

    // try to fine opponent socket id in the party
    const targetPlayerId = this.partyIndexToPlayerId[opponentIndex]
    console.log('targetplayerId', targetPlayerId)

    // when opponent not found
    if (!targetPlayerId) return;

    // send command
    const data:SendBonusRequest = {
      type: RequestTypes.sendBonus,
      partyId: this.partyId,
      playerId: this.playerId,
      target: targetPlayerId,
      bonus: bonus
    }

    SocketSingleton.getInstance()?.sendData(data)
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
    // this.game.getInput().bind();
    TetrinetSingleton.getInstance().getInput().bind();

    /**
     * Init game graphics
     */
    // this.game.initGraphic(this._canvas.current as HTMLCanvasElement)
    TetrinetSingleton.getInstance().initGraphic(this._canvas.current as HTMLCanvasElement)

    // start loading assets
    Assets.load(sprite, () =>
    {
      // start game
      // this.game.startGame();
      console.log ('Assets loaded, updates graphics');
      
      //
      // const gl:WebGL2RenderingContext|null = this.game.getGLGraphics().getGl();
      const gl:WebGL2RenderingContext|null = TetrinetSingleton.getInstance().getGLGraphics().getGl();

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
    // this.game.getInput().unBind();
    TetrinetSingleton.getInstance().getInput().unBind();
  }
  
  /**
   *
   */
  onPlayClicked = () =>
  {
    console.log ('onPlayClicked');
    
    // open socket connection
    // this.socket = new Socket();
    SocketSingleton.openConnection(() =>
    {
      // prepare
      // this.game.prepareToGame(this)
      TetrinetSingleton.getInstance().prepareToGame(this)

      // when socket open we start game
      // this.game.playGame();
      TetrinetSingleton.getInstance().playGame();
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
      partyId: this.partyId,
      playerId: this.playerId,
    }

    // send data
    SocketSingleton.getInstance()?.sendData(request);
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
      partyId: this.partyId,
      playerId: this.playerId,
    }

    // send data
    SocketSingleton.getInstance()?.sendData(request);

    // set game resume
    // this.game.resumeGame(true);
  }

  /**
   * Here we join duel
   */
  onJoinToDuelClicked = () =>
  {
    console.log ('onJoinToDuelClicked')
    this.joinToParty('duel')
  }

  /**
   * Here we join party
   */
  onJoinToPartyClicked = () =>
  {
    console.log ('onJoinToDuelClicked');
    this.joinToParty('party')
  }

  /**
   * Join to party.
   * party type: party, duel
   * @param partyType
   */
  joinToParty (partyType:string)
  {
    console.log ('onJoinToDuelClicked')
    SocketSingleton.reOpenConnection(() => {
      // send handshake and waiting our data
      const request:StartRequest = {
        type: RequestTypes.join,
        partyType: partyType,
        partyId: '',
        playerId: '',
      }
      SocketSingleton.getInstance()?.sendDataAndWaitAnswer(request, this.onJoinResponse)
    })
  }

  /**
   * When answer to join received
   * @param data
   */
  onJoinResponse = (data:StartResponse) =>
  {
    this.playerId = data.yourPlayerId
    this.setState({playerId: data.yourPlayerId})

    // set listener when game starts
    SocketSingleton.getInstance()?.setListener(this);

    // when socket open prepare to game
    // this.game.prepareToGame(this);
    TetrinetSingleton.getInstance().prepareToGame(this);
  }
  
  onWatchClicked = () =>
  {
    console.log ('onWatchClicked');
    
    // open socket connection
    // this.socket = new Socket();
    SocketSingleton.openConnection(() =>
    {
      // todo: make special object
      const request = {type: "watch"}

      // send start party
      SocketSingleton.getInstance()?.sendDataAndWaitAnswer(request, (data:any) => {
        // when socket open we start game
        // this.game.watchGame();
        TetrinetSingleton.getInstance().watchGame();
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
    const data:SetRequest = {
      type: RequestTypes.set,
      partyId: this.partyId,
      playerId: this.playerId,
      // state: state,
      cup: cupState
    }

    SocketSingleton.getInstance()?.sendData(data)
  }
  
  /**
   * This is callback method from socket
   * it is here because we need to get event that party starts
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
    console.log ('Canvas.processLetsPlay', data);

    // save party id
    this.partyId = data.partyId

    // clear mapping array
    this.partyIndexToPlayerId = {};

    /**
     * key index of player
     */
    let i:number = 1

    // map opponents
    // in array where key is index and value is player id
    Object.keys(data.party).forEach((p:string) => {
      const arrayKey = parseInt(p)
      const it = data.party[arrayKey]
      if (it.socketId !== this.playerId) {
        this.partyIndexToPlayerId[i] = it.socketId
        i++
      }
    })

    // save party data
    this.setState({
      partyId: data.partyId
    });

    // start game
    // this.game.playGame();
    TetrinetSingleton.getInstance().playGame();
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
    if (data.state === GameState.over)
    {

      // this.game.setGameOver();
      TetrinetSingleton.getInstance().setGameOver();

      const mineCup = data.cups[this.playerId]
      TetrinetSingleton.getInstance().setCupState(mineCup.state);

      // check maybe we are a winner
      //const mineCupIndex = Object.keys(data.cups).find((key:string) => {
        // return parseInt(key) === this.partyIndex
        // return key === this.playerId
      // })

      // update our cup state
      // if (mineCupIndex) {
      //   const mineCup = data.cups[parseInt(mineCupIndex)]
      //   TetrinetSingleton.getInstance().setCupState(mineCup.state);
      // }
    }

    // filter our cup out of our cup
    let ccc:CupsDataCollection = {}

    Object.keys(data.cups).forEach((key:string) => {
      if (key !== this.playerId){
        ccc[key] = data.cups[key]
      }
    })

    // update cups
    TetrinetSingleton.getInstance().updateCups(ccc);


    // find opponent key
    // todo: refactor to many cups
    // const opponentPlayerId = Object.keys(data.cups).find((key:string) => {
    //   // return parseInt(key) !== this.partyIndex
    //   return key !== this.playerId
    // })
    //
    // // todo: update other cups
    // if (opponentPlayerId) {
    //   // this.game.setOpponentCup(data.cups[parseInt(opponentKey)]);
    //   // TetrinetSingleton.getInstance().setOpponentCup(data.cups[parseInt(opponentKey)]);
    //   TetrinetSingleton.getInstance().setOpponentCup(data.cups[opponentPlayerId]);
    // }
  }

  /**
   * We receive add line command
   * @param data
   */
  processAddLine(data:AddLineMessage) {
    // this.game.addRowsToCup(data.linesCount);
    TetrinetSingleton.getInstance().addRowsToCup(data.linesCount);
  }

  processGetBonus (data:GetBonusMessage) {
    TetrinetSingleton.getInstance().realiseBonus(data.bonus);
  }

  processPause(data:PausedMessage) {
    this.setState({currentGameState: GameState.paused})
    // this.game.pauseGame()
    TetrinetSingleton.getInstance().pauseGame()
  }

  processResume(data:ResumedMessage) {
    this.setState({currentGameState: GameState.running})
    // this.game.resumeGame();
    TetrinetSingleton.getInstance().resumeGame();
  }

  render () {
    return <div style={{display: "flex", flexDirection: "column", alignItems: "center", padding: "0 1rem"}}>

      <div style={{display: "flex", alignItems: "center", marginBottom: "1rem", width: "100%"}}>
        <div style={{display: "flex", alignItems: "center", flex: "1"}}>
          <div>
            <button onClick={this.onPlayClicked} disabled={true}>Play</button>
            <button onClick={this.onJoinToDuelClicked}>Duel</button>
            <button onClick={this.onJoinToPartyClicked}>Party 5</button>
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
            <div style={{margin: "0 0 0 1rem"}}>state: <b>{this.state.currentGameState}</b></div>
            <div style={{margin: "0 0 0 1rem"}}>partyId: <b>{this.state.partyId}</b></div>
            <div style={{margin: "0 0 0 1rem"}}>playerId: <b>{this.state.playerId}</b></div>
          </div>
        </div>
      </div>

      <div>
        <canvas id="canvas" width={960} height={750} style={{border: "solid 2px orange"}} ref={this._canvas}/>
      </div>
    </div>
  }
}
