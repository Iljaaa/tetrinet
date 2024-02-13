import {GameState} from "../../screens/PlayScreen";
import {Message} from "./Message";

/**
 * Add line data
 */
export interface AddLineMessage extends Message
{
    // game state
    state: GameState,

    /**
     * Index of cup who send it
     */
    source: number,

    /**
     * Index of cup who is the target
     */
    target: number,

    /**
     * Count lines to add
     */
    linesCount: number
}