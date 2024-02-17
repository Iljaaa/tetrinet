import {Tetrinet} from "./Tetrinet/Tetrinet";

/**
 *
 */
export class TetrinetSingleton
{
  /**
   * Singleton instance
   * @private
   */
  private static instance:Tetrinet

  /**
   * Init new instance
   */
  public static init (){
    TetrinetSingleton.instance = new Tetrinet()
  }

  /**
   *
   */
  public static getInstance():Tetrinet {
    return TetrinetSingleton.instance;
  }
}
