import {GameStoreData} from "./GameStoreData";


export const LoadGameDataFromStorage = ():GameStoreData | null =>
{
  if (window.localStorage) {
    let data = window.localStorage.getItem("activeGame");
    if (data){
      return JSON.parse(data)
    }
  }

  return null
}