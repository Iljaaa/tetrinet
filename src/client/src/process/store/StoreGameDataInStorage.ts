import {GameStoreData} from "./GameStoreData";

/**
 * After game starts we store data to storage
 * for
 * when player restart browser he could back to the game
 * @private
 */
export const StoreGameDataInStorage = (partyId:string, playerId:string) => {
  // store party and player id into storage
  if (window.localStorage) {
    const data:GameStoreData = {
      date: (new Date()),
      partyId: partyId,
      playerId: playerId
    }
    window.localStorage.setItem("activeGame", JSON.stringify(data));
  }
}