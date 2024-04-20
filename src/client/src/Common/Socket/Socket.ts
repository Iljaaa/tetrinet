import {Message} from "../Tetrinet/types/messages";

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
   * Error appears error on open
   * @private
   */
  private _onOpenErrorCallback?: () => void

  /**
   * Callback when the connection close
   */
  private _onCloseCallback?: () => void
  
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
  private messageReceiveCallback?: (data:Message) => void

  /**
   *
   * @param onOpenCallback
   * @param onOpenError
   */
  constructor(onOpenCallback: (() => void), onOpenError?: (() => void))
  {
    // save callback
    this.onOpenCallback = onOpenCallback
    this._onOpenErrorCallback = onOpenError
    
    try {
      this.socket = new WebSocket(window.tetrinetConfig.socketUrl)
      
      this.socket.onopen = this.onOpen;
      this.socket.onmessage = this.onMessage;
      this.socket.onerror = this.onError;
      this.socket.onclose = this.onClose;
    }
    catch (e) {
      console.error(e, 'Socket open exception')

    }
  }

  /**
   * Set message receive callback
   */
  setMessageReceiveCallback (callback:(message:Message) => void){
    this.messageReceiveCallback = callback;
  }

  setOnCloseCallback(value: () => void) {
    this._onCloseCallback = value;
  }

  /**
   * On socket open
   */
  protected onOpen = () =>
  {
    // rise callback
    if (this.onOpenCallback) this.onOpenCallback();

    // clear error on open
    if (this._onOpenErrorCallback) this._onOpenErrorCallback = undefined
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
    if (this.messageReceiveCallback) {
      this.messageReceiveCallback(data)
    }
  }
  
  /**
   * @param error
   * @protected
   */
  protected onError = (error:Event):void =>
  {
    console.error (error);

    // clear close callback, am not sure about it
    // it here because when we cannot connect also rised on close event
    // this.onCloseCallback = undefined

    //
    if (this._onOpenErrorCallback) this._onOpenErrorCallback()
  }

  /**
   * @param event
   */
  private onClose = (event:any):void =>
  {
    if (this._onCloseCallback) this._onCloseCallback()
  }
  
  /**
   * Send some data to socket
   * @param data
   */
  sendData = (data:object) =>
  {
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

  /**
   * Clear close callback
   */
  clearCloseCallback() {
    this._onCloseCallback = undefined
  }

  /**
   * Close connection
   */
  close ():void {
    if (this.socket) this.socket.close(1000);
  }
}