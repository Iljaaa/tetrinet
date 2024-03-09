import {Message} from "./Message";
import {GamePartyType} from "../GamePartyType";
import {PlayerId} from "../PlayerId";

/**
 * This is lets play message for party
 */
export interface LetsPlayMessage extends Message
{
    /**
     * Id of party
     */
    partyId: string,

    /**
     * This is party type
     */
    partyType: GamePartyType,

    /**
     * It is your index in party,
     * buy here is not necessary and it is not used
     */
    yourIndex: number,

    /**
     * Description of your party
     */
    party: Array<{
        playerId: PlayerId,
        name: string
    }>,
}