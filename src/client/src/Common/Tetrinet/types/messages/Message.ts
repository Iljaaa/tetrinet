import {MessageTypes} from "../MessageTypes";
import {ChatItem} from "../ChatItem";

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
    log?: ChatItem[]
}
