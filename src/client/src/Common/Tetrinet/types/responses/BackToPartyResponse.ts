import {Response} from "./Response"

/**
 * Try to back to the party
 */
export interface BackToPartyResponse extends Response
{
    /**
     * is cumbeck was success
     */
    success: boolean

    /**
     * back fail message
     */
    message: string
}