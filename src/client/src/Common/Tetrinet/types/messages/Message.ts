import {MessageTypes} from "../MessageTypes";

/**
 * Data format for messages from server
 */
export type Message =
{
    // type of request
    type: MessageTypes,
}
