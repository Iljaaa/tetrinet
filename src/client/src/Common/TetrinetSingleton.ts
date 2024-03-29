import {TetrinetNetworkLayer} from "./TetrinetNetworkLayer";
import {WorkerSingleton} from "./WorkerSingleton";

/**
 *
 */
export class TetrinetSingleton
{
  /**
   * Singleton instance
   * @private
   */
  private static instance:TetrinetNetworkLayer

  /**
   * Init new instance
   */
  public static init (){
    TetrinetSingleton.instance = new TetrinetNetworkLayer()
  }

  /**
   * Finalize instance
   */
  public static finalize (){
    // TetrinetSingleton.getInstance()?.finalize()
    WorkerSingleton.finalize();
  }

  /**
   *
   */
  public static getInstance():TetrinetNetworkLayer {
    return TetrinetSingleton.instance;
  }




}
