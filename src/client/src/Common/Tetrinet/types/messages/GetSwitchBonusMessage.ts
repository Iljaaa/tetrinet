import {Message} from "./Message";
import {Bonus} from "../Bonus";
import {CupData} from "../../models/CupData";

/**
 * We receive bonus
 * it is special switch
 */
export interface GetSwitchBonusMessage extends Message
{
    /**
     * With one bonus receive
     */
    bonus: Bonus

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
     * this is your new cup after switch
     */
    yourCup: CupData
}