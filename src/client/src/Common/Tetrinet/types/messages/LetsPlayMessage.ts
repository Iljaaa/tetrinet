import {Message} from "./Message";

/**
 * This is lets play message for party
 */
export interface LetsPlayMessage extends Message
{
    /**
     * Id of created part
     */
    partyId: string,

    /**
     * It is your index in party,
     * buy here is not necessary and it is not used
     */
    yourIndex: number,

    /**
     * Description of your party
     */
    party: Array<{socketId: string}>,
}