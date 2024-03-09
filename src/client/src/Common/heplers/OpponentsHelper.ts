import {LetsPlayMessage} from "../Tetrinet/types/messages/LetsPlayMessage";
import {PlayerId} from "../Tetrinet/types/PlayerId";

/**
 * Map keys 1-9
 * with player id
 */
interface KeysPlayerMap {
  [index: number]: {
    playerId:PlayerId,
    name:string
  }
}

/**
 * This is opponents helper
 * manage players ids and names
 */
export class OpponentsHelper {

  /**
   * This is mapping keys to index inside party
   */
  private static party:KeysPlayerMap = {};

  /**
   *
   * @param data
   *
   * @param me we use me to exclude myself from opponents array
   */
  public static makeNewOpponentsArray (data:LetsPlayMessage, me:PlayerId)
  {

    // clear mapping array
    OpponentsHelper.party = {};

    /**
     * key index of player
     * it begins from 1
     */
    let i:number = 1

    // map opponents
    // in array where key is index and value is player id
    Object.keys(data.party).forEach((p:string) => {
      const arrayKey = parseInt(p)
      const it = data.party[arrayKey]
      if (it.playerId !== me) {
        OpponentsHelper.party[i] = {
          playerId: it.playerId,
          name: it.name
        }
        i++
      }
    })
  }


  /**
   * get player is by index, and index it key that player push
   * @param playerIndex
   */
  static getPlayerIdByIndexInParty (playerIndex:number): PlayerId
  {
    return OpponentsHelper.party[playerIndex]?.playerId;
  }

}