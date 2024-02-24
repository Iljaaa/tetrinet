import {Message} from "./Message";
import {Bonus} from "../Bonus";
import {CupsDataCollection} from "../../../../Canvas";

/**
 * We receive bonus
 * it is special switch
 */
export interface GetSwitchBonusMessage extends Message
{
    /**
     * Player socket id who send a bonus
     * this field not use in logic
     */
    source: string,

    /**
     * Player who receive bonus
     * this field not use in logic, because a server responsible for this
     */
    target: string,

    /**
     * With one bonus receive
     */
    bonus: Bonus,

    /**
     * Cups info
     */
    cups: CupsDataCollection
}