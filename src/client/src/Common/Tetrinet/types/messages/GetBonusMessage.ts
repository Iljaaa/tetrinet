import {GameState} from "../../types";
import {Message} from "./Message";
import {Bonus} from "../Bonus";

/**
 * We receive bonus
 */
export interface GetBonusMessage extends Message
{
    /**
     * Index of cup who send it
     */
    source: number,

    /**
     * Index of cup who is the target
     */
    target: number,

    /**
     * With one bonus receive
     */
    bonus: Bonus
}