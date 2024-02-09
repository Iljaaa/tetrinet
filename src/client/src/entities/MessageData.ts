import {Cup} from "../Common/Tetrinet/models/Cup";
import {CupState} from "../Common/Tetrinet/models/CupState";

/**
 * Data format received from server,
 */
export type MessageData =
{
  // type of request
  type:string,

  // cups state
  cups: Array<CupState>
}
