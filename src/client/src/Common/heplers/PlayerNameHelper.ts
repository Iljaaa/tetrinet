import {LoadPlayerName, StorePlayerName} from "../../process/store";

/**
 * This method centralize manage the player name
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
   *
   * @private
   */
  private static onNameInputFinish?: () => void

  /**
   * We call this method when we need to get player name
   */
  private static _startInputName?: (defaultPlayerName:string, onNameSubmit:(newPlayerName:string) => void) => void = undefined

  public static callbackForOpenInputNameInterface (callback:(defaultPlayerName: string, onNameSubmit:(newPlayerName:string) => void) => void){
    this._startInputName = callback
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
    if (PlayerNameHelper._startInputName)
    {
      console.log(PlayerNameHelper._startInputName, 'PlayerNameHelper._startInputName')

      PlayerNameHelper.onNameInputFinish = onInputFinish
      PlayerNameHelper._startInputName(this._playerName, (newPlayerName:string) =>
      {
        // save player name
        this.setPlayerName(newPlayerName)

      });
    }
  }

  public static setPlayerName(newPlayerName:string)
  {
    console.log ('PlayerNameHelper.setPlayerName');
    this._playerName = newPlayerName;


    if (PlayerNameHelper.onNameInputFinish) {
      PlayerNameHelper.onNameInputFinish()
      PlayerNameHelper.onNameInputFinish = undefined
    }

    // save in store player name
    StorePlayerName(this._playerName)

    //
    if (PlayerNameHelper._playerNameChangeListener) {
      PlayerNameHelper._playerNameChangeListener (PlayerNameHelper._playerName);
    }
  }

  public static editPlayerName ()
  {
    if (PlayerNameHelper._startInputName) {
      PlayerNameHelper._startInputName(this._playerName, (newPlayerName: string) => {
        // save player name
        this.setPlayerName(newPlayerName)
      });
    }
  }

}