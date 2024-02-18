import {GameState} from "../../types";
import {Message} from "./Message";

/**
 * Add line data
 */
export interface ResumedMessage extends Message
{
    // game state
    state: GameState,
}