import {GameState} from "../Common/Tetrinet/screens/PlayScreen";
import {CupState} from "../Common/Tetrinet/models/CupState";

/**
 * This data send to server when cup is updates
 */
export type UpdateData = {
  type:string,
  partyId: string,
  partyIndex: number,
  state: GameState,
  cup: CupState
}
