import {Response} from "./Response"

/**
 * Start play server request
 */
export interface StartResponse extends Response {
    partyId: string,
    yourIndex: number
}