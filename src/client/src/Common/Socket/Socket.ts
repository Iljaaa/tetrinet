import {SocketEventListener} from "./SocketEventListener";

/**
 * todo: make singleton
 */
export class Socket
{
  /**
   *
   * @private
   */
  private static socket: WebSocket | undefined;
  
  /**
   * Callback when socket is open
   * @private
   */
  private onOpenCallback: (() => void) | undefined;
  
  /**
   * This is message event listener
   */
  private static eventListener:SocketEventListener|undefined
  
  
  /**
   * Open connection
   */
  open(onOpenCallback:()=>void)
  {
    console.info ('socket connecting to: ' + window.tetrinetConfig.socketUrl);
    
    // save callback
    this.onOpenCallback = onOpenCallback
    
    try {
      Socket.socket = new WebSocket(window.tetrinetConfig.socketUrl)
      console.log(Socket.socket, 'socked')
      
      Socket.socket.onopen = this.onOpen;
      Socket.socket.onmessage = this.onMessage;
      Socket.socket.onerror = this.onError;
      Socket.socket.onclose = this.onClose;
    }
    catch (e) {
      console.log(e, 'e')
    }
  }
  
  /**
   * Request data from server
   */
  static requestData()
  {
    const stringData = JSON.stringify({type: "watch"})
    this.socket?.send(stringData)
  }
  
  /**
   * Set event listener
   */
  static setListener (listener:SocketEventListener){
    Socket.eventListener = listener;
  }
  
  protected onOpen = () => {
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
  protected onMessage (this: WebSocket, event: MessageEvent<any>): any
  {
    // parse data
    let data = event.data
    data = JSON.parse(data)
    
    if (Socket.eventListener) {
      Socket.eventListener.onMessageReceive(data)
    }
  }
  
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
   * todo: refactor to singletone
   * @param data
   */
  public sendData = (data:object) =>
  {
    console.log (data, 'Socket.sendData');
    if (!Socket.socket) return;
    
    const stringData = JSON.stringify(data)
    Socket.socket.send(stringData);
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
