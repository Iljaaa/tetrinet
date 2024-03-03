/**
 * @param playerName
 */
export const StorePlayerName = (playerName:string):void => {
    if (window.localStorage) {
      window.localStorage.setItem('playerName', playerName)
    }
}