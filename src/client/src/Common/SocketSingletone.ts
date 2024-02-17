import {Socket} from "./Socket/Socket";

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
   * This is almost open but we always create new socket
   */
  public static reOpenConnection(onOpenCallback:()=>void)
  {
    // close old connection
    if (SocketSingletone.socketInstance) {
      SocketSingletone.socketInstance.close();
    }

    // create new instance
    SocketSingletone.socketInstance = new Socket(onOpenCallback);

  }

  /**
   * Init socket connection
   */
  public static openConnection(onOpenCallback:()=>void)
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
