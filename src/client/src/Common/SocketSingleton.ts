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
  public static reOpenConnection(onOpenCallback:()=>void, onOpenErrorCallback?:()=>void)
  {
    // before we try to close socket
    SocketSingleton.close()

    // create new instance
    SocketSingleton.socketInstance = new Socket(onOpenCallback, onOpenErrorCallback);
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

  /**
   * Close callback
   */
  public static close ()
  {
    // close old connection
    if (SocketSingleton.socketInstance)
    {
      // clear close callback
      SocketSingleton.socketInstance.clearCloseCallback();

      // open new connection
      SocketSingleton.socketInstance.close();
    }

  }
}
