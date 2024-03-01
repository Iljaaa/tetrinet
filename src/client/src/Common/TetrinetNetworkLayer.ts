import {Tetrinet} from "./Tetrinet/Tetrinet";
import {Assets} from "./Tetrinet/Assets";
import sprite from "../sprite.png";
import {WebGlProgramManager} from "./framework/impl/WebGlProgramManager";
import {SocketSingleton} from "./SocketSingleton";
import {SetRequest, StartRequest} from "./Tetrinet/types/requests";
import {GameState, MessageTypes, RequestTypes} from "./Tetrinet/types";
import {StartResponse} from "./Tetrinet/types/responses";
import {ChatMessage} from "./Tetrinet/types/ChatMessage";
import {PlayScreenEventListener} from "./Tetrinet/screens/PlayScreen";
import {SocketMessageEventListener} from "./Socket/SocketMessageEventListener";
import {Bonus} from "./Tetrinet/types/Bonus";
import {SendBonusRequest} from "./Tetrinet/types/requests/SendBonusRequest";
import {CupData} from "./Tetrinet/models/CupData";
import {AddLineMessage, Message, SetMessage} from "./Tetrinet/types/messages";
import {LetsPlayMessage} from "./Tetrinet/types/messages/LetsPlayMessage";
import {GetBonusMessage} from "./Tetrinet/types/messages/GetBonusMessage";
import {PausedMessage} from "./Tetrinet/types/messages/PausedMessage";
import {ResumedMessage} from "./Tetrinet/types/messages/ResumedMessage";
import {CupsDataCollection} from "../widgets/Canvas/Canvas";
import {ClearGameDataInStorage, StoreGameDataInStorage} from "../process/store";
import {BackRequest} from "./Tetrinet/types/requests/BackRequest";
import {BackToPartyResponse} from "./Tetrinet/types/responses/BackToPartyResponse";

/**
 * Game macro data changes
 */
export type TetrinetEventListener = {
  onGameStateChange: (state:GameState) => void,
  onScoreChange: (score:number) => void,
  onPartyIdChange: (partyId:string) => void,
  onPlayerIdChange: (playerId:string) => void,

  /**
   * When player name is changed
   */
  onPlayerNameChange: (newPlayerName:string) => void,
}

/**
 * Socket events
 */
export type TetrinetNetworkLayerSocketEvents = {
  onError: () => void,
  OnClose: () => void,
  onGraphicsLoaded: () => void
}

/**
 * Map keys 1-9
 * with player id
 */
interface KeysPlayerMap {
  [index: number]: string
}


/**
 * Network layer is a bad idea all this fuctions we shold move to plat screen
 */
export class TetrinetNetworkLayer extends Tetrinet implements PlayScreenEventListener, SocketMessageEventListener
{
  /**
   * Party id
   * we should use it here not from state
   */
  private _partyId: string = '';

  /**
   * This is id of your socket
   * received when you start search party
   * @private
   */
  private _playerId:string = '';

  /**
   * This is player name for chat mostly
   */
  private _playerName:string = '';

  /**
   * This is mapping keys to index inside party
   */
  private partyIndexToPlayerId:KeysPlayerMap = {};

  /**
   * Chat and log
   */
  private chat:Array<ChatMessage> = [];

  /**
   * Listener of tetrinet events
   */
  private _gameDataEventListener:TetrinetEventListener | undefined = undefined

  /**
   * Listener of sockets events
   */
  private _socketEventListener:TetrinetNetworkLayerSocketEvents | undefined = undefined

  /**
   * Call back method works when chat is updates
   * @private
   */
  private _onChatChanged?: (items:ChatMessage[]) => void = undefined


  /**
   * We call this method when we need to get  player name
   */
  private _requestPlayerNameCallback?: (defaultPlayerName:string, onNameSubmit:(newPlayerName:string) => void) => void = undefined



  // if it comments al stop working
  constructor() {
    super();
  }

  setGameDataEventListener(listener: TetrinetEventListener) {
    this._gameDataEventListener = listener
  }

  setSocketEventListener(listener:TetrinetNetworkLayerSocketEvents){
      this._socketEventListener = listener
  }

  /**
   *
   */
  setChatChangeListener (f:(chatItems:Array<ChatMessage>) => void) {
    this._onChatChanged = f;
  }

  setRequestPlayerNameCallback (callback:(defaultPlayerName: string, onNameSubmit:(newPlayerName:string) => void) => void){
    this._requestPlayerNameCallback = callback
  }

  public initGraphicAndLoadAssets (canvas:HTMLCanvasElement)
  {
    /**
     * bind controller events
     * i'm not sure that initialization must be here
     */
    this.getInput().bind();

    /**
     * Init game graphics
     */
    // this.game.initGraphic(this._canvas.current as HTMLCanvasElement)
    this.initGraphic(canvas)

    /**
     * load player name from sore
     */
    this.loadPlayerName();
    this._gameDataEventListener?.onPlayerNameChange(this._playerName)

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

      // call listener method
      this._socketEventListener?.onGraphicsLoaded();
    })
  }


  /**
   @deprecated all this layer must move to play screen
   */
  getPartyId(): string {
    return this._partyId;
  }

  /**
   * @deprecated all this layer must move to play screen
   */
  getPlayerId(): string {
    return this._playerId;
  }

  /**
   * Callback from game when lines was cleared
   * @param newScore
   */
  onScoreChanged (newScore:number): void {
    this._gameDataEventListener?.onScoreChange(newScore)
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
      partyId: this._partyId,
      playerId: this._playerId,
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
      partyId: this._partyId,
      playerId: this._playerId,
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
    // process chat
    if (data.chat) {
      if (data.chat.length !== this.chat.length) {
        this.chat = data.chat
        debugger
        if (this._onChatChanged) this._onChatChanged(this.chat);
      }
    }


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
    this._partyId = data.partyId

    // call listener to display party id
    this._gameDataEventListener?.onPartyIdChange(this._partyId)

    // clear mapping array
    this.partyIndexToPlayerId = {};

    /**
     * key index of player
     * it begins from 1
     */
    let i:number = 1

    // map opponents
    // in array where key is index and value is player id
    Object.keys(data.party).forEach((p:string) => {
      const arrayKey = parseInt(p)
      const it = data.party[arrayKey]
      if (it.socketId !== this._playerId) {
        this.partyIndexToPlayerId[i] = it.socketId
        i++
      }
    })

    // store party and player id into storage
    StoreGameDataInStorage(this._partyId, this._playerId)

    // start game
    // this.game.playGame();
    this.playGame();

    //
    this._gameDataEventListener?.onGameStateChange(GameState.running)
  }

  /**
   * Main method, when became new cups and game state data
   * @param data
   */
  private processAfterSet (data:SetMessage)
  {
    // cups without our cup
    console.log ('TetrinetNetworkLayer.processAfterSet', data.cups);

    // is this is game over
    if (data.state === GameState.over) {
      this.processGameOverAfterSet(data);
    }

    // filter our cup out of our cup
    let ccc:CupsDataCollection = {}
    Object.keys(data.cups).forEach((key:string) => {
      if (key !== this._playerId){
        ccc[key] = data.cups[key]
      }
    })

    // update cups
    this.updateCups(ccc);
  }

  /**
   * @deprecated we do not use it
   * We receive add line command
   * @param data
   */
  private processAddLine(data:AddLineMessage) {
    // this.game.addRowsToCup(data.linesCount);
    this.addRowsToCup(data.linesCount);
  }

  private processGetBonusMessage (data:GetBonusMessage) {
    this.realiseBonus(data.bonus, data);
  }

  private processPause(data:PausedMessage) {
    this.pauseGame()
    this._gameDataEventListener?.onGameStateChange(GameState.paused)
  }

  private processResume(data:ResumedMessage) {
    this.resumeGame();
    this._gameDataEventListener?.onGameStateChange(GameState.running)
  }

  /**
   * When the end of the game arrives from the server
   * @private
   */
  private processGameOverAfterSet (data:SetMessage)
  {
    // update global game over state
    this.setGameOver();

    // update our cup state
    const mineCup:CupData = data.cups[this._playerId]
    this.setCupState(mineCup.state);

    //
    this._gameDataEventListener?.onGameStateChange(GameState.over)

    // clear game state in store
    ClearGameDataInStorage()
  }


  /**
   * Join to party.
   * party type: party, duel
   * @param partyType
   */
  public joinToParty (partyType:string)
  {
    console.log ('TetrinetNetworkLayer.onJoinToDuelClicked')

    // todo: here we need a redux

    // if player name is empty we first require it, then continue to play
    if (this._playerName === '' && this._requestPlayerNameCallback)
    {
      this._requestPlayerNameCallback(this._playerName, (newPlayerName:string) =>
      {
        //
        this._playerName = newPlayerName;

        // store player name to store
        this.storePlayerName(this._playerName)

        this.connectToJoinParty(partyType);
      });

      //
      return;
    }

    // if player name is set we just go to search
    this.connectToJoinParty(partyType)

  }

  private connectToJoinParty (partyType:string)
  {
    // todo: remove in to some other place
    // may be to there where controlls bind
    window.addEventListener('blur', function() {
      console.log('Окно браузера потеряло фокус');
    });

    //
    SocketSingleton.reOpenConnection(() => this.onJoinPartyConnectionOpen(partyType), this.onConnectionClose)
  }

  /**
   * When socket connection open
   * @param partyType
   */
  private onJoinPartyConnectionOpen = (partyType:string) =>
  {
    // after that connection

    // send handshake and waiting our data
    const request:StartRequest = {
      type: RequestTypes.join,
      partyType: partyType,
      partyId: '',
      playerId: this._playerId,
      playerName: this._playerName
    }
    SocketSingleton.getInstance()?.sendDataAndWaitAnswer(request, this.onJoinResponse)
  }

  /**
   * When answer to join received
   * @param data
   */
  private onJoinResponse = (data:StartResponse) =>
  {
    this._playerId = data.yourPlayerId

    //
    this._gameDataEventListener?.onGameStateChange(GameState.running)
    this._gameDataEventListener?.onPlayerIdChange(this._playerId)

    // set listener when game starts
    SocketSingleton.getInstance()?.setListener(this);

    // when socket open prepare to game
    // this.game.prepareToGame(this);
    this.prepareToGame(this);
  }

  /**
   * Back to abbonaded game
   */
  backToGame (partyId:string, playerId:string, failCallback: (message:string) => void) {
    console.log ('TetrinetNetworkLayer.backToGame')
    SocketSingleton.reOpenConnection(
      () => this.onBackToGameConnectionOpen(partyId, playerId, failCallback),
      this.onConnectionClose
    )
  }

  /**
   * @param partyId
   * @param playerId
   * @param failCallback
   */
  private onBackToGameConnectionOpen(partyId:string, playerId:string, failCallback: (message:string) => void) {
    console.log ('TetrinetNetworkLayer.onBackToGameConnectionOpen')
    // send handshake and waiting our data
    const request:BackRequest = {
      type: RequestTypes.back,
      partyId: partyId,
      playerId: playerId,
    }
    SocketSingleton.getInstance()?.sendDataAndWaitAnswer(request, (data:BackToPartyResponse) => this.onBackResponse(data, failCallback))
  }

  /**
   * We are back
   * @private
   */
  private onBackResponse (data:BackToPartyResponse, failCallback: (message:string) => void){
    console.log ('TetrinetNetworkLayer.onBackResponse', data);

    debugger
    // if it is fail
    if (!data.success) {
      failCallback(data.message)
      return;
    }

    debugger

    // found our cup and update it
    // this.partyId = data.
    this.prepareToGame(this, );
  }

  /**
   * todo: call callback
   * When socket close connection
   */
  private onConnectionClose = () => {
    console.log ('TetrinetNetworkLayer.onConnectionClose');
    alert ('Connection lost!!!');
  }

  /**
   * Pause the game
   */
  // public pause ()
  // {
  //   // request data
  //   const request:PauseRequest = {
  //     type: RequestTypes.pause,
  //     partyId: this._partyId,
  //     playerId: this._playerId,
  //   }
  //
  //   // send data
  //   SocketSingleton.getInstance()?.sendData(request);
  // }

  /**
   * Resume the game
   */
  // public resume ()
  // {
  //
  //   // request data
  //   const request:ResumeRequest = {
  //     type: RequestTypes.resume,
  //     partyId: this._partyId,
  //     playerId: this._playerId,
  //   }
  //
  //   // send data
  //   SocketSingleton.getInstance()?.sendData(request);
  //
  //   // set game resume
  //   // this.game.resumeGame(true);
  // }

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
      this._gameDataEventListener?.onGameStateChange(GameState.running)
    }, () => {})
  }

  /**
   * Load username from store
   * @private
   */
  private loadPlayerName (){
    if (window.localStorage){
      const playerName = window.localStorage.getItem('playerName')
      if (playerName) this._playerName = playerName;
    }
  }
  /**
   * Load username from store
   * @private
   */
  private storePlayerName (playerName:string)
  {
    if (window.localStorage) {
      window.localStorage.setItem('playerName', playerName)
    }
  }
}