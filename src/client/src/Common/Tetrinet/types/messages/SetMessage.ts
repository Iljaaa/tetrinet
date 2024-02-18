import {Message} from "./Message";
import {GameState} from "../../types";
import {CupData} from "../../models/CupData";

interface CupsCollection {
    [index: string]: CupData;
}

/**
 * Data for 'set' message request
 */
export interface SetMessage extends Message
{
    // game state
    state: GameState,

    // cups state
    // cups: Array<CupData>
    cups: CupsCollection
}