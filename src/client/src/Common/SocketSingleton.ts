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
   * This is almost open but we always create new socket
   */
  public static reOpenConnection(onOpenCallback:()=>void)
  {
    // close old connection
    if (SocketSingleton.socketInstance) {
      SocketSingleton.socketInstance.close();
    }

    // create new instance
    SocketSingleton.socketInstance = new Socket(onOpenCallback);

  }

  /**
   * Init socket connection
   */
  public static openConnection(onOpenCallback:()=>void)
  {
    if (!SocketSingleton.socketInstance)
    {
      // create new instance
      SocketSingleton.socketInstance = new Socket(onOpenCallback);
    }
  }
  
  /**
   *
   */
  public static getInstance() {
    return SocketSingleton.socketInstance;
  }
}
