import {RequestTypes} from "../RequestTypes";

/**
 * Global type for all requests
 */
export type Request =
{
    /**
     * Type of request,
     * join, addBlock, ....
     */
    type: RequestTypes,

    /**
     * Party string code
     */
    partyId: string

    /**
     * SocketIs is the connection id got from join request
     */
    playerId: string

    /**
     * @deprecated it must be changed to socketId
     * Your index in party
     */
    partyIndex: number
}