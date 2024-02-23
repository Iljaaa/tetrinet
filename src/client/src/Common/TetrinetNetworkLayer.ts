import {Tetrinet} from "./Tetrinet/Tetrinet";
import {Assets} from "./Tetrinet/Assets";
import sprite from "../sprite.png";
import {WebGlProgramManager} from "./framework/impl/WebGlProgramManager";
import {TetrinetSingleton} from "./TetrinetSingleton";
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

  // if it comments al stop working
  constructor() {
    super();
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
      const gl:WebGL2RenderingContext|null = TetrinetSingleton.getInstance().getGLGraphics().getGl();

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
   * @param countLines
   */
  onLineCleared (countLines:number)
  {
    console.log ('TetrinetNetworkLayer.onLineCleared', countLines);

    // set score
    // this.setState({score: this.state.score + ((countLines + countLines - 1) * 10) })
  }

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
  private processLetsPlay (data:LetsPlayMessage)
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
    // this.setState({
    //   partyId: data.partyId
    // });

    // start game
    // this.game.playGame();
    TetrinetSingleton.getInstance().playGame();
  }


  /**
   * @param data
   */
  private processAfterSet (data:SetMessage)
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
  }

  /**
   * We receive add line command
   * @param data
   */
  private processAddLine(data:AddLineMessage) {
    // this.game.addRowsToCup(data.linesCount);
    TetrinetSingleton.getInstance().addRowsToCup(data.linesCount);
  }

  private processGetBonus (data:GetBonusMessage) {
    TetrinetSingleton.getInstance().realiseBonus(data.bonus);
  }

  private processPause(data:PausedMessage) {
    // this.setState({currentGameState: GameState.paused})
    // this.game.pauseGame()
    TetrinetSingleton.getInstance().pauseGame()
  }

  private processResume(data:ResumedMessage) {
    // this.setState({currentGameState: GameState.running})
    // this.game.resumeGame();
    TetrinetSingleton.getInstance().resumeGame();
  }




  /**
   * Join to party.
   * party type: party, duel
   * @param partyType
   */
  public joinToParty (partyType:string)
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
  private onJoinResponse = (data:StartResponse) =>
  {
    this.playerId = data.yourPlayerId

    // set listener when game starts
    SocketSingleton.getInstance()?.setListener(this);

    // when socket open prepare to game
    // this.game.prepareToGame(this);
    TetrinetSingleton.getInstance().prepareToGame(this);
  }

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
      TetrinetSingleton.getInstance().prepareToGame(this)

      // when socket open we start game
      // this.game.playGame();
      TetrinetSingleton.getInstance().playGame();
    })
  }
}