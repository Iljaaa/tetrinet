import {Response} from "./Response"

/**
 * Start play server request
 */
export interface StartResponse extends Response
{
    /**
     * This is id of your socket
     */
    yourPlayerId: string
}