import {Message} from "./Message";

/**
 * This is lets play message for party
 */
export interface LetsPlayMessage extends Message
{
    partyId: string,
    yourIndex: number
}