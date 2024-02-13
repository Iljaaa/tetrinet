import {CupState} from "../types/CupState";

/**
 * This cup state used for export data to client
 */
export interface CupData {
  state: CupState,
  fields: Array<number>,
  bonuses: Array<number>
}
