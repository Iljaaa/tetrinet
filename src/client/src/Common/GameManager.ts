import {TetrinetSingleton} from "./TetrinetSingleton";
import {SocketSingleton} from "./SocketSingleton";

import {StartRequest} from "./Tetrinet/types/requests";
import {RequestTypes} from "./Tetrinet/types";
import {StartResponse} from "./Tetrinet/types/responses";
import {PlayScreenEventListener} from "./Tetrinet/screens/PlayScreen";
import {SocketEventListener} from "./Socket/SocketEventListener";

/**
 * The point of this class is to associate button reactions
 * with the game class.
 *
 * Of course, it could carry a copy of the Tetrinet,
 * but we already made a singleton for it
 *
 * Some functions from the canvas object were moved here
 */
export class GameManager // implements PlayScreenEventListener, SocketEventListener
{
  /**
   * @deprecated
   * Party id
   * we should use it here not from state
   */
  private static partyId: string = '';

  /**
   * @deprecated
   * This is id of your socket
   * received when you start search party
   */
  private static playerId:string = '';

  // public static onJoinClicked = () =>
  // {
  //   console.log ('onJoinClicked');
  //
  //   // open socket connection
  //   // this.socket = new Socket();
  //   SocketSingleton.reOpenConnection(() => {
  //
  //     // send handshake and waiting our data
  //     const request:StartRequest = {
  //       type: RequestTypes.join,
  //       partyId: '',
  //       playerId: '',
  //     }
  //
  //     SocketSingleton.getInstance()?.sendDataAndWaitAnswer(request, this.onJoinResponse)
  //   })
  // }

  /**
   * When answer to join received
   * @param data
   */
  // private static onJoinResponse = (data:StartResponse) =>
  // {
  //   // todo here we get a socketId
  //   console.log ('onJoinResponse', data);
  //
  //   this.playerId = data.yourSocketId
  //   // this.setState({socketId: data.yourSocketId})
  //
  //   // set listener when game starts
  //   SocketSingleton.getInstance()?.setListener(this);
  //
  //   // when socket open prepare to game
  //   // this.game.prepareToGame(this);
  //   TetrinetSingleton.getInstance().prepareToGame(this);
  // }


}