import {Response} from "./Response"

/**
 * Start play server request
 */
export interface StartResponse extends Response
{
    /**
     *
     */
    // partyId: string,

    /**
     * @deprecated
     * it bust be your index in the party but we should use socketID
     */
    // yourIndex: number

    /**
     * This is id of your socket
     */
    yourSocketId: string
}