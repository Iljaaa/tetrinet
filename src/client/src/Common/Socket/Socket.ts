import {SocketMessageEventListener} from "./SocketMessageEventListener";

/**
 * Wrap up around socket
 */
export class Socket
{
  /**
   *
   * @private
   */
  private readonly socket: WebSocket | undefined;
  
  /**
   * Callback when socket is open
   */
  private readonly onOpenCallback: (() => void) | undefined;

  /**
   * Callback when the connection close
   */
  private onCloseCallback: (() => void) | undefined;
  
  /**
   * This is special call back with
   * set in send data method
   * and called in get message
   * @private
   */
  private afterSendDataCallback: ((data: object) => void | undefined) | undefined
  
  /**
   * This is message event listener
   */
  private eventListener:SocketMessageEventListener|undefined
  
  constructor(onOpenCallback: (() => void), onCloseCallback: (() => void))
  {
    // save callback
    this.onOpenCallback = onOpenCallback
    this.onCloseCallback = onCloseCallback
    
    try {
      this.socket = new WebSocket(window.tetrinetConfig.socketUrl)
      // console.log(this.socket, 'socked')
      
      this.socket.onopen = this.onOpen;
      this.socket.onmessage = this.onMessage;
      this.socket.onerror = this.onError;
      this.socket.onclose = this.onClose;
    }
    catch (e) {
      console.log(e, 'e')
    }
  }
  
  /**
   * Set event listener
   */
  setListener (listener:SocketMessageEventListener){
    this.eventListener = listener;
  }
  
  /**
   * On socket open
   */
  protected onOpen = () => {
    // rise callback
    if (this.onOpenCallback) this.onOpenCallback();
  }
  
  /**
   * When message received from socket
   * @param event
   * @protected
   */
  protected onMessage = (event: MessageEvent<any>): any =>
  {
    // parse data
    let data = event.data
    data = JSON.parse(data)

    /**
     * this is callback uses only after first message
     */
    if (this.afterSendDataCallback) {
      this.afterSendDataCallback(data)
      // clean up callback
      this.afterSendDataCallback = undefined;
    }
    
    // call event listener
    if (this.eventListener) {
      this.eventListener.onMessageReceive(data)
    }
  }
  
  /**
   * Todo: add to callback
   * @param error
   * @protected
   */
  protected onError = (error:Event):void =>
  {
    console.log(this.socket?.CLOSED, this.socket?.OPEN, 'Socket.OnError')

    console.log ('Socket.onError', error);
    alert('Socket error, restart application');

    // clear close callback, am not sure about it
    // it here because when we cannot connect also rised on close event
    this.onCloseCallback = undefined

    // if (error.type === "error")
  }
  
  protected onClose = (event:any):void => {
    console.log ('Socket.onClose', this.onCloseCallback, event);
    if (this.onCloseCallback) this.onCloseCallback()
  }
  
  /**
   * Send some data to socket
   * @param data
   */
  sendData = (data:object) =>
  {
    // console.log (data, 'Socket.sendData');
    if (!this.socket) return;
    
    // save callback
    this.afterSendDataCallback = undefined
    
    const stringData = JSON.stringify(data)
    this.socket.send(stringData);
  }
  
  /**
   * Send some data to socket
   * @param data
   * @param callback
   */
  sendDataAndWaitAnswer = (data:object, callback:(data:any)=>void) =>
  {
    if (!this.socket) return;
    
    // save callback
    this.afterSendDataCallback = callback
    
    const stringData = JSON.stringify(data)
    this.socket.send(stringData);
  }

  clearCloseCallback() {
    this.onCloseCallback = undefined
  }

  /**
   * Close connection
   */
  close ():void {
    if (this.socket) this.socket.close(1000);
  }
}