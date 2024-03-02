import {LoadPlayerName} from "./Tetrinet/process/LoadPlayerName";
import {StorePlayerName} from "./Tetrinet/process/StorePlayerName";

/**
 * This method centralize player name
 */
export class PlayerNameHelper
{
  /**
   * This is player name for chat mostly
   */
  private static _playerName:string = '';

  /**
   * this is callback method called when player name changes
   */
  private static _playerNameChangeListener?: (newPlayerName:string) => void

  /**
   * We call this method when we need to get player name
   */
  private static _requestPlayerNameCallback?: (defaultPlayerName:string, onNameSubmit:(newPlayerName:string) => void) => void = undefined

  public static setRequestPlayerNameCallback (callback:(defaultPlayerName: string, onNameSubmit:(newPlayerName:string) => void) => void){
    this._requestPlayerNameCallback = callback
  }

  public static setPlayerNameChangeListener (callback:(newPlayerName:string) => void){
    this._playerNameChangeListener = callback
  }

  public static getPlayerName ():string {
    return PlayerNameHelper._playerName;
  }

  /**
   * this init method
   * because it must be called when page component did ready
   */
  public static initPlayerName ()
  {
    // load player name
    PlayerNameHelper._playerName = LoadPlayerName();

    //
    if (PlayerNameHelper._playerNameChangeListener) {
      PlayerNameHelper._playerNameChangeListener (PlayerNameHelper._playerName);
    }
  }

  /**
   * This function do not simple thing
   * if player name is empty it reqeust input it from interface
   */
  public static requestPlayerName (onInputFinish:() => void)
  {

    if (PlayerNameHelper._playerName !== ''){
      onInputFinish();
      return;
    }

    // if player name empty we request window for input
    if (this._requestPlayerNameCallback) {
      this._requestPlayerNameCallback(this._playerName, (newPlayerName:string) =>
      {
        // save player name
        this.setPlayerName(newPlayerName)

        onInputFinish()
      });
    }
  }

  public static setPlayerName(newPlayerName:string)
  {
    this._playerName = newPlayerName;

    // save in store player name
    StorePlayerName(this._playerName)

    //
    if (PlayerNameHelper._playerNameChangeListener) {
      PlayerNameHelper._playerNameChangeListener (PlayerNameHelper._playerName);
    }
  }

}