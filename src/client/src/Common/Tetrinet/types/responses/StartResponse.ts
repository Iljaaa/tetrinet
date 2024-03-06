import {Response} from "./Response"
import {GamePartyType} from "../GamePartyType";

/**
 * Start play server request
 */
export interface StartResponse extends Response
{
    /**
     * Party type
     */
    partyType: GamePartyType

    /**
     * This is id of your socket
     */
    yourPlayerId: string
}