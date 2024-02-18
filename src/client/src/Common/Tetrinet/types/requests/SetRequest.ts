import {Request} from "./Request";
// import {GameState} from "../../types";
import {CupData} from "../../models/CupData";


/**
 * This data send to server when cup is updates
 */
export interface SetRequest extends Request {
  // partyId: string,
  // partyIndex: number,
  // state: GameState,
  cup: CupData
}
