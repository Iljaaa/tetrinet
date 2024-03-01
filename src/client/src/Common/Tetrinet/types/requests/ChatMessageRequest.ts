import {Request} from "./Request";

export interface ChatMessageRequest extends Request
{
    /**
     * target player id should be selected player, but now we have only two players
     */
    message: string,

}