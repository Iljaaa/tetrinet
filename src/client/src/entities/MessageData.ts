import {CupState} from "../Common/Tetrinet/models/CupState";
import {GameState} from "../Common/Tetrinet/screens/PlayScreen";

export enum MessageTypes {
  letsPlay = 'letsPlay',
  afterSet = 'afterSet',
  addLine = 'addLine'
}

/**
 * Data format received from server,
 */
export type MessageData =
{
  // type of request
  type: MessageTypes,
}

export interface AfterSetMessageDown extends MessageData
{
  // game state
  state: GameState,

  // cups state
  cups: Array<CupState>
}
