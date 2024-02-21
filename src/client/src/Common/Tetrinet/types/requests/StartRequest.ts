import {Request} from "./Request";

/**
 * Search game request
 */
export interface StartRequest extends Request
{
  /**
   * Party type for build cup
   */
  partyType: string,

  /**
   * Player name will ve in future
   */
  // playerName: string
}