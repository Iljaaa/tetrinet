import {Socket} from "./Socket";

/**
 *
 */
export class SocketSingletone
{
  /**
   * Singleton socket instance
   * @private
   */
  private static socketInstance?:Socket
  
  /**
   * Init socket connection
   */
  public static init(onOpenCallback:()=>void)
  {
    if (!SocketSingletone.socketInstance)
    {
      // create new instance
      SocketSingletone.socketInstance = new Socket(onOpenCallback);
    }
  }
  
  /**
   *
   */
  public static getInstance() {
    return SocketSingletone.socketInstance;
  }
}
