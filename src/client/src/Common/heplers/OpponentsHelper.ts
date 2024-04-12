import {LetsPlayMessage} from "../Tetrinet/types/messages/LetsPlayMessage";
import {PlayerId} from "../Tetrinet/types/PlayerId";
import {Cup} from "../Tetrinet/models/Cup";
import {CupImpl} from "../Tetrinet/models/CupImpl";
import {CupData} from "../Tetrinet/models/CupData";
import {CupsDataCollection} from "../CupsDataCollection";

type PlayerData = {
  index: number,
  playerId:PlayerId,
  name:string,
  cup: Cup // player cup
}

/**
 * Map keys 1-9
 * with player id
 */
export interface PlayersCollection {
  [index: number]: PlayerData
}

/**
 * This is opponents helper
 * manage players ids and names
 */
export class OpponentsHelper {

  /**
   * This is mapping keys to index inside party
   */
  public static party:PlayersCollection = {};

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
          index: i,
          playerId: it.playerId,
          name: it.name,
          cup: new CupImpl()
        }
        i++
      }
    })
  }

  public static updateCups (data:CupsDataCollection){
    Object.keys(data).forEach((playerId:string) =>
    {
      // if cup not exists we are create new
      // if (!this._cups[playerId]) this._cups[playerId] = new CupImpl();

      // const cd = data[playerId]
      // this._cups[playerId].setFields(cd.fields)
      // this._cups[playerId].setState(cd.state)
      OpponentsHelper.updateCupByPlayerId(playerId, data[playerId])
    })
  }

  /**
   * Update one cup data
   * @param playerId
   * @param data
   */
  public static updateCupByPlayerId (playerId:PlayerId, data:CupData)
  {
    return Object.keys(OpponentsHelper.party).map((i:string) => {
      const index = parseInt(i)
      const p = OpponentsHelper.party[index]
      if (p.playerId === playerId) {
        p.cup.setFields(data.fields)
        p.cup.setState(data.state)
      }
    });
  }

  /**
   * get player data by index, and index it key that player push
   * @param playerIndex
   */
  static getPlayerDataByIndexInParty (playerIndex:number): PlayerData|undefined {
    return OpponentsHelper.party[playerIndex];
  }

  // static getDataByPlayerId (playerId:PlayerId):PlayerData|undefined
  // {
  //   Object.keys(OpponentsHelper.party).find((i:string) => {
  //     return ( OpponentsHelper.party[parseInt(i)].playerId === playerId)
  //   });
  //
  //   return undefined;
  // }

  /**
   * Here only names
   * @deprecated
   */
  static getOpponentsArray ():Array<PlayerData>
  {
    return Object.keys(OpponentsHelper.party).map((i:string) => {
      const index = parseInt(i)
      const p = OpponentsHelper.party[index]
      return {
        index: index,
        name: p.name,
        playerId: p.playerId,
        cup: p.cup
      }
    });
  }

}