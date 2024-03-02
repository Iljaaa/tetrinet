import {Message} from "./Message";
import {ChatMessage} from "../ChatMessage";

/**
 * Add line data
 */
export interface ReceiveChatMessage extends Message
{
    // game state
    chat: Array<ChatMessage>,
}