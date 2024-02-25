import {Tetrinet} from "./Tetrinet/Tetrinet";
import {Assets} from "./Tetrinet/Assets";
import sprite from "../sprite.png";
import {WebGlProgramManager} from "./framework/impl/WebGlProgramManager";
import {SocketSingleton} from "./SocketSingleton";
import {PauseRequest, ResumeRequest, SetRequest, StartRequest} from "./Tetrinet/types/requests";
import {GameState, MessageTypes, RequestTypes} from "./Tetrinet/types";
import {StartResponse} from "./Tetrinet/types/responses";
import {ChatItem} from "./Tetrinet/types/ChatItem";
import {PlayScreenEventListener} from "./Tetrinet/screens/PlayScreen";
import {SocketEventListener} from "./Socket/SocketEventListener";
import {Bonus} from "./Tetrinet/types/Bonus";
import {SendBonusRequest} from "./Tetrinet/types/requests/SendBonusRequest";
import {CupData} from "./Tetrinet/models/CupData";
import {AddLineMessage, Message, SetMessage} from "./Tetrinet/types/messages";
import {LetsPlayMessage} from "./Tetrinet/types/messages/LetsPlayMessage";
import {GetBonusMessage} from "./Tetrinet/types/messages/GetBonusMessage";
import {PausedMessage} from "./Tetrinet/types/messages/PausedMessage";
import {ResumedMessage} from "./Tetrinet/types/messages/ResumedMessage";
import {CupsDataCollection} from "../Canvas";

/**
 *
 */
export type TetrinetEventListener = {
  onGameStateChange: (state:GameState) => void,
  onScoreChange: (score:number) => void,
  onPartyIdChange: (partyId:string) => void,
  onPlayerIdChange: (playerId:string) => void,
}

/**
 *
 */
export type TetrinetNetworkLayerSocketEvents = {
  onError: (state:GameState) => void,
  OnClose: (score:number) => void,
}

/**
 * Map keys 1-9
 * with player id
 */
interface KeysPlayerMap {
  [index: number]: string
}

export class TetrinetNetworkLayer extends Tetrinet implements PlayScreenEventListener, SocketEventListener
{
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

  /**
   * Events listener on tetrinet events
   * @private
   */
  private _eventListener:TetrinetEventListener|null = null

  // if it comments al stop working
  constructor() {
    super();
  }

  setEventListener(value: TetrinetEventListener | null) {
    this._eventListener = value;
  }

  public initGraphicAndLoadAssets (canvas:HTMLCanvasElement)
  {
    /**
     * bind controller events
     * i'm not sure that initialization must be here
     */
    // this.game.getInput().bind();
    this.getInput().bind();

    /**
     * Init game graphics
     */
    // this.game.initGraphic(this._canvas.current as HTMLCanvasElement)
    this.initGraphic(canvas)

    // load asset
    // start loading assets
    Assets.load(sprite, () =>
    {
      // start game
      // this.game.startGame();
      console.log ('Assets loaded, updates graphics');

      //
      // const gl:WebGL2RenderingContext|null = this.game.getGLGraphics().getGl();
      const gl:WebGL2RenderingContext|null = this.getGLGraphics().getGl();

      // bind this texture
      Assets.sprite.bind(gl)

      // bind texture in mixed program
      WebGlProgramManager.setUpIntoMixedProgramImageSize(gl, Assets.sprite.getImage().width, Assets.sprite.getImage().height);

      // bind texture in graphic program
      WebGlProgramManager.setUpIntoTextureProgramImageSize(gl, Assets.sprite.getImage().width, Assets.sprite.getImage().height);
    })
  }

  /**
   * Callback from game when lines was cleared
   * @param newScore
   */
  onScoreChanged (newScore:number): void {
    this._eventListener?.onScoreChange(newScore)
  }

  /**
   * Send a request with gift
   * @param bonus
   * @param opponentIndex
   */
  onSendBonusToOpponent (bonus:Bonus, opponentIndex:number)
  {
    console.log('TetrinetNetworkLayer.onSendBonusToOpponent', bonus, opponentIndex)

    // try to fine opponent socket id in the party
    const targetPlayerId = this.partyIndexToPlayerId[opponentIndex]
    console.log('targetPlayerId', targetPlayerId)

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
   * This is callback method when something happen in cup
   */
  onCupUpdated(state:GameState, cupState:CupData): void
  {
    console.log('TetrinetNetworkLayer.onCupUpdated', state, cupState);

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
    console.log (data, 'TetrinetNetworkLayer.onMessageReceive');

    switch (data.type) {
      // party is created, it is time to play
      case MessageTypes.letsPlay: this.processLetsPlay(data as LetsPlayMessage); break;
      // some cup was updated, and we process this message
      case MessageTypes.afterSet: this.processAfterSet(data as SetMessage); break;
      // we receive add line command
      case MessageTypes.addLine: this.processAddLine(data as AddLineMessage); break;
      case MessageTypes.getBonus: this.processGetBonusMessage(data as GetBonusMessage); break;
      case MessageTypes.paused: this.processPause(data as PausedMessage); break;
      case MessageTypes.resumed: this.processResume(data as ResumedMessage); break;
    }
  }

  /**
   * Part created and we get from server
   * signal to start the game
   */
  private processLetsPlay (data:LetsPlayMessage)
  {
    console.log ('TetrinetNetworkLayer.processLetsPlay', data);

    // save party id
    this.partyId = data.partyId

    //
    this._eventListener?.onPartyIdChange(this.partyId)

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
    // this.setState({
    //   partyId: data.partyId
    // });

    // start game
    // this.game.playGame();
    this.playGame();

    //
    this._eventListener?.onGameStateChange(GameState.running)
  }

  /**
   * @param data
   */
  private processAfterSet (data:SetMessage)
  {
    // cups without our cup
    console.log ('TetrinetNetworkLayer.processAfterSet', data.cups);

    // is this is game over
    if (data.state === GameState.over)
    {

      // this is the end
      this.setGameOver();

      //
      this._eventListener?.onGameStateChange(GameState.over)

      const mineCup = data.cups[this.playerId]
      this.setCupState(mineCup.state);
    }

    // filter our cup out of our cup
    let ccc:CupsDataCollection = {}
    Object.keys(data.cups).forEach((key:string) => {
      if (key !== this.playerId){
        ccc[key] = data.cups[key]
      }
    })

    // update cups
    this.updateCups(ccc);
  }

  /**
   * We receive add line command
   * @param data
   */
  private processAddLine(data:AddLineMessage) {
    // this.game.addRowsToCup(data.linesCount);
    this.addRowsToCup(data.linesCount);
  }

  private processGetBonusMessage (data:GetBonusMessage) {
    this.realiseBonus(data.bonus, this.playerId, data);
  }

  private processPause(data:PausedMessage) {
    this.pauseGame()
    this._eventListener?.onGameStateChange(GameState.paused)
  }

  private processResume(data:ResumedMessage) {
    this.resumeGame();
    this._eventListener?.onGameStateChange(GameState.running)
  }



  /**
   * Join to party.
   * party type: party, duel
   * @param partyType
   */
  public joinToParty (partyType:string)
  {
    console.log ('onJoinToDuelClicked', this._eventListener)

    // close connection if it
    SocketSingleton.getInstance()

    //
    SocketSingleton.reOpenConnection(() => this.onJoinPartyConnectionOpen(partyType), this.onConnectionClose)
  }

  /**
   * When socket connection open
   * @param partyType
   */
  private onJoinPartyConnectionOpen(partyType:string)
  {
    // send handshake and waiting our data
    const request:StartRequest = {
      type: RequestTypes.join,
      partyType: partyType,
      partyId: '',
      playerId: '',
    }
    SocketSingleton.getInstance()?.sendDataAndWaitAnswer(request, this.onJoinResponse)
  }

  /**
   * When answer to join received
   * @param data
   */
  private onJoinResponse = (data:StartResponse) =>
  {
    this.playerId = data.yourPlayerId

    //
    this._eventListener?.onPartyIdChange(GameState.running)

    // set listener when game starts
    SocketSingleton.getInstance()?.setListener(this);

    // when socket open prepare to game
    // this.game.prepareToGame(this);
    this.prepareToGame(this);
  }

  private onConnectionClose = () => {
    console.log ('TetrinetNetworkLayer.onConnectionClose');
    alert ('Connection lost!!!');
  }

  /**
   * Pause the game
   */
  public pause ()
  {
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
   * Resume the game
   */
  public resume ()
  {

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


  public oldPlayMethod (){
    // open socket connection
    // this.socket = new Socket();
    SocketSingleton.openConnection(() =>
    {
      // prepare
      // this.game.prepareToGame(this)
      this.prepareToGame(this)

      // when socket open we start game
      // this.game.playGame();
      this.playGame();

      //
      this._eventListener?.onGameStateChange(GameState.running)
    }, () => {})
  }
}