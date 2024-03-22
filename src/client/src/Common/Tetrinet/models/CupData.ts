import {CupState} from "../types/CupState";
import {Field} from "./Field";

/**
 * This cup state used for export data to client
 */
export interface CupData
{
  // status of cup that return from server
  state: CupState,

  // fields state
  fields: Array<Field>,

  // speed of down
  // todo: remove speed from his request
  speed: number

  // bonuses: Array<number>
}
