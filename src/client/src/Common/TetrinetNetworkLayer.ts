import {Tetrinet} from "./Tetrinet/Tetrinet";
import {Assets} from "./Tetrinet/Assets";
import sprite from "../sprite.png";
import {WebGlProgramManager} from "./framework/impl/WebGlProgramManager";
import {SocketSingleton} from "./SocketSingleton";
import {SetRequest, StartRequest} from "./Tetrinet/types/requests";
import {GameState, MessageTypes, RequestTypes} from "./Tetrinet/types";
import {StartResponse} from "./Tetrinet/types/responses";
import {ChatMessage} from "./Tetrinet/types/ChatMessage";
import {PlayScreen, PlayScreenEventListener} from "./Tetrinet/screens/PlayScreen";
import {SocketMessageEventListener} from "./Socket/SocketMessageEventListener";
import {CupData} from "./Tetrinet/models/CupData";
import {AddLineMessage, Message, SetMessage} from "./Tetrinet/types/messages";
import {LetsPlayMessage} from "./Tetrinet/types/messages/LetsPlayMessage";
import {GetBonusMessage} from "./Tetrinet/types/messages/GetBonusMessage";
import {CupsDataCollection} from "../widgets/Canvas/Canvas";
import {ClearGameDataInStorage, StoreGameDataInStorage} from "../process/store";
import {BackRequest} from "./Tetrinet/types/requests/BackRequest";
import {BackToPartyResponse} from "./Tetrinet/types/responses/BackToPartyResponse";
import {ChatMessageRequest} from "./Tetrinet/types/requests/ChatMessageRequest";
import {ReceiveChatMessage} from "./Tetrinet/types/messages/ReceiveChatMessage";
import {PlayerNameHelper} from "./PlayerNameHelper";

/**
 * Game macro data changes
 */
export type TetrinetEventListener = {
  onGameStateChange: (state:GameState) => void,
  onScoreChange: (score:number) => void,
  onPartyIdChange: (partyId:string) => void,
  onPlayerIdChange: (playerId:string) => void,
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
   * This is mapping keys to index inside party
   */
  private partyIndexToPlayerId:KeysPlayerMap = {};

  /**
   * Chat and log
   */
  private chat:Array<ChatMessage> = [];

  /**
   * Listener of sockets events
   */
  private _socketEventListener:TetrinetNetworkLayerSocketEvents | undefined = undefined

  /**
   * Call back method works when chat is updates
   * @private
   */
  private _onChatChanged?: (items:ChatMessage[]) => void = undefined

  // if it comments al stop working
  constructor() {
    super();
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

    // init player name here, nut it must be somewhere else
    // PlayerNameHelper.initPlayerName();

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
   * get player is by index, and index it key that player push
   * @param playerIndex
   */
  getPlayerIdByIndexInParty (playerIndex:number): string{
    return this.partyIndexToPlayerId[playerIndex];
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

  /**
   * This is callback method when something happen in cup
   */
  onCupUpdated(state:GameState, cupState:CupData): void
  {
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
    switch (data.type) {
      // party is created, it is time to play
      case MessageTypes.letsPlay: this.processLetsPlay(data as LetsPlayMessage); break;
      // some cup was updated, and we process this message
      case MessageTypes.afterSet: this.processAfterSet(data as SetMessage); break;
      // we receive add line command
      case MessageTypes.addLine: this.processAddLine(data as AddLineMessage); break;
      case MessageTypes.getBonus: this.processGetBonusMessage(data as GetBonusMessage); break;
      case MessageTypes.paused: this.processSetPause(); break;
      case MessageTypes.resumed: this.processResumeGame(); break;

      // updated chat is comming
      case MessageTypes.chat: this.processChat(data as ReceiveChatMessage); break;
    }
  }

  /**
   * Part created and we get from server
   * signal to start the game
   */
  private processLetsPlay (data:LetsPlayMessage)
  {
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

  /**
   * Receive chat message
   * @param data
   * @private
   */
  private processChat(data:ReceiveChatMessage)
  {
    // process chat
    if (data.chat) {
      if (data.chat.length !== this.chat.length) {
        this.chat = data.chat
        if (this._onChatChanged) this._onChatChanged(this.chat);
      }
    }
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
    //
    // Here we check if game already online
    //
    let s = this.getCurrentScreen()
    if (s)
    {
      // if it play cup
      if (s instanceof PlayScreen) {
        if (s.getGameState() === GameState.running || s.getGameState() === GameState.paused) {
          alert ('Game is still running, do you wanna leave?');
          return;
        }
      }
      else {
        debugger
        alert ('It is not play cup');
      }


    }

    /**
     * This is not simple code
     * it load player name if it was not load
     */
    PlayerNameHelper.requestPlayerName(() => {
      // after load player name
      this.connectToJoinParty(partyType)
    });

    // if player name is empty we first require it, then continue to play
    // if (this._playerName === '' && this._requestPlayerNameCallback)
    // {
    //   this._requestPlayerNameCallback(this._playerName, (newPlayerName:string) =>
    //   {
    //     //
    //     this._playerName = newPlayerName;
    //
    //     // store player name to store
    //     this.storePlayerName(this._playerName)
    //
    //     this.connectToJoinParty(partyType);
    //   });
    //
    //   //
    //   return;
    // }


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
    // send handshake and waiting our data
    const request:StartRequest = {
      type: RequestTypes.join,
      partyType: partyType,
      partyId: '',
      playerId: this._playerId,
      playerName: PlayerNameHelper.getPlayerName() // this._playerName
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
  private onBackToGameConnectionOpen(partyId:string, playerId:string, failCallback: (message:string) => void)
  {
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
  private onBackResponse (data:BackToPartyResponse, failCallback: (message:string) => void)
  {

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
    alert ('Connection lost!!!');
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
      this._gameDataEventListener?.onGameStateChange(GameState.running)
    }, () => {})
  }

  public sendChatMessage (message:string){
    // send command
    const data:ChatMessageRequest = {
      type: RequestTypes.chatMessage,
      partyId: this._partyId,
      playerId: this._playerId,
      message: message
    }

    SocketSingleton.getInstance()?.sendData(data)
  }
}