import {Message} from "./Message";
import {GameState} from "../../screens/PlayScreen";
import {CupState} from "../../models/CupState";

/**
 * Data for 'set' message request
 */
export interface SetMessage extends Message
{
    // game state
    state: GameState,

    // cups state
    cups: Array<CupState>
}