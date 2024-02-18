import {Request} from "./Request";
import {Bonus} from "../Bonus";

export interface SendBonusRequest extends Request
{
    /**
     * target player id should be selected player, but now we have only two players
     */
    target: string,

    /**
     * bonus for bro
     */
    bonus: Bonus
}