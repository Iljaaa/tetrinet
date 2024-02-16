import {RequestTypes} from "../RequestTypes";

/**
 * Global type for all requests
 */
export type Request = {
    type: RequestTypes,

    /**
     * Party string code
     */
    partyId: string

    /**
     * Your index in party
     */
    partyIndex: number
}