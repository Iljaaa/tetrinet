import {Request} from "./Request";
import {Bonus} from "../Bonus";

export interface SendBonusRequest extends Request {

    /**
     * @deprecated because we should use sourceSocketId
     * now this is same that partyIndex
     */
    source: number,

    /**
     * @deprecated this old type of select opponent, now we use targetSocketId
     * target should be selected player, but now we have only two players
     */
    target: number,

    /**
     * @deprecated
     * this is your socket id
     */
    sourceSocketId: string

    /**
     * @deprecated
     * Target player socket id
     */
    targetSocketId: string


    bonus: Bonus
}