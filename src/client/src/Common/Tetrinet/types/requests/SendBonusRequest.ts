import {Request} from "./Request";
import {Bonus} from "../Bonus";

export interface SendBonusRequest extends Request {
    source: number, // now this is same that partyIndex
    target: number, // target should be selected player, but now we have only two players
    bonus: Bonus
}