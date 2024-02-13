import {Request} from "./Request";
import {GameState} from "../../screens/PlayScreen";
import {CupState} from "../../models/CupState";


/**
 * This data send to server when cup is updates
 */
export interface SetRequest extends Request {
  partyId: string,
  partyIndex: number,
  state: GameState,
  cup: CupState
}
