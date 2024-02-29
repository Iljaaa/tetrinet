import {Request} from "./Request";

/**
 * Search game request
 * in this request playerId and partyId is not necessary because
 */
export interface StartRequest extends Request
{
  /**
   * Party type for build cup
   */
  partyType: string,

  /**
   * Player name
   */
  playerName: string
}