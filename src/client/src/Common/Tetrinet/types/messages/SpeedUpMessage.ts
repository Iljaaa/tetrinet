import {Message} from "./Message";
import {ChatMessage} from "../ChatMessage";

/**
 * Add line data
 */
export interface SpeedUpMessage extends Message
{
    speed: number
}