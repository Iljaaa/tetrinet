import {GameState} from "../../types";
import {Message} from "./Message";

/**
 * Add line data
 */
export interface PausedMessage extends Message
{
    // game state
    state: GameState,

    /**
     * Wham?
     */
    initiator: number,
}