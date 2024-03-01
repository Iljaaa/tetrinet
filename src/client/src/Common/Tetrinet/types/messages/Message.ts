import {MessageTypes} from "../MessageTypes";
import {ChatMessage} from "../ChatMessage";

/**
 * Data format for messages from server
 */
export type Message =
{
    // type of request
    type: MessageTypes,

    /**
     * Log items request
     */
    chat?: ChatMessage[]
}
