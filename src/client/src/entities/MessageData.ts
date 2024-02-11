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

/**
 * Data for 'set' message request
 */
export interface AfterSetMessageDown extends MessageData
{
  // game state
  state: GameState,

  // cups state
  cups: Array<CupState>
}

/**
 * Add line data
 */
export interface AddLineMessageData extends MessageData
{
  // game state
  state: GameState,

  /**
   * Index of cup who send it
   */
  source: number,

  /**
   * Index of cup who is the target
   */
  target: number,

  /**
   * Count lines to add
   */
  linesCount: number
}
