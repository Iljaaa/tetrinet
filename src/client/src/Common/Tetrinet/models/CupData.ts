import {CupState} from "../types/CupState";
import {Field} from "./Field";

/**
 * This cup state used for export data to client
 */
export interface CupData {
  state: CupState,
  fields: Array<Field>,
  // bonuses: Array<number>
}
