import {SocketEventListener} from "./SocketEventListener";
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;

/**
 * todo: make singleton
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
   * @private
   */
  private readonly onOpenCallback: (() => void) | undefined;
  
  /**
   * This is speciaal call back with
   * setted in send data method
   * and called in get message
   * @private
   */
  private afterSendDataCallback: ((data: object) => void | undefined) | undefined
  
  /**
   * This is message event listener
   */
  private eventListener:SocketEventListener|undefined
  
  
  constructor(onOpenCallback: (() => void) | undefined)
  {
    
    // save callback
    this.onOpenCallback = onOpenCallback
    
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
   * Request data from server
   */
  // requestData () {
  //   const stringData = JSON.stringify({type: "watch"})
  //   this.socket?.send(stringData)
  // }
  
  /**
   * Set event listener
   */
  setListener (listener:SocketEventListener){
    this.eventListener = listener;
  }
  
  /**
   * On socket open
   */
  protected onOpen = () =>
  {
    console.log ('Socket.onOpen');
    
    // rise callback
    if (this.onOpenCallback) {
      this.onOpenCallback()
    }
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
    
    // call special callback
    if (this.afterSendDataCallback)
    {
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
  // protected onError (this:WebSocket, error:Event):any {
  protected onError (this:WebSocket, error:Event):any {
    console.log ('Socket.onError', error);
    alert('Socket error, restart application');
    // if (error.type === "error")
  }
  
  protected onClose = () => {
    console.log ('Socket.onClose');
  }
  
  /**
   * Send some data to socket
   * @param data
   */
  public sendData = (data:object) =>
  {
    console.log (data, 'Socket.sendData');
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
  public sendDataAndWaitAnswer = (data:object, callback:(data:any)=>void) =>
  {
    if (!this.socket) return;
    
    // save callback
    this.afterSendDataCallback = callback
    
    const stringData = JSON.stringify(data)
    this.socket.send(stringData);
  }

  /**
   * Close connection
   */
  public close ():void {
    if (this.socket) this.socket.close(1000);
  }
}





// let host = 'ws://127.0.0.1:10000/websocket';

/*socket = new WebSocket(host);
console.log(socket, 'socket')

// here we need send welcome message

socket.onopen = () => {
  console.log ('Socket.onopen');
};

socket.onmessage = (message) => {
  console.log (message.data, 'Socket.onMessage message data');
  
  
  
  let data = null;
  try {
    data = JSON.parse(message.data);
  }
  catch (er) {
    console.warn (er, 'error on data parsing');
  }
  
  console.log (data, 'data after parsing');
  
  //
  if (data && data.type === "welcome") {
    console.info ('this is welcome message and we need to save our id', data.id);
  }
  
}

socket.onerror = (it, ev) => {
  console.log (it, ev, 'Socket.onError22222222');
};

socket.onclose = () => {
  console.log ('Socket.onClose');
}

// setTimeout(function (){
//   console.log ('Send test to socket');
//   socket.send('test');
// }, 1000)*/
