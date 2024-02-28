import {Socket} from "./Socket/Socket";

/**
 *
 */
export class SocketSingleton
{
  /**
   * Singleton socket instance
   * @private
   */
  private static socketInstance?:Socket
  
  /**
   * @deprecate this method close and open new connection this is not correct
   * This is almost open but we always create new socket
   */
  public static reOpenConnection(onOpenCallback:()=>void, onCloseCallback:()=>void)
  {
    // close old connection
    if (SocketSingleton.socketInstance)
    {
      // clear close callback
      SocketSingleton.socketInstance.clearCloseCallback();

      // open new connection
      SocketSingleton.socketInstance.close();
    }

    // create new instance
    SocketSingleton.socketInstance = new Socket(onOpenCallback, onCloseCallback);
  }

  /**
   * Init socket connection
   */
  public static openConnection(onOpenCallback:()=>void, onCloseCallback:()=>void)
  {
    if (!SocketSingleton.socketInstance) {
      // create new instance
      SocketSingleton.socketInstance = new Socket(onOpenCallback, onCloseCallback);
    }
  }
  
  /**
   * Return socket instance
   */
  public static getInstance() {
    return SocketSingleton.socketInstance;
  }
}
