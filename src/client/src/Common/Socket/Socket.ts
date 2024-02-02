export class Socket
{
  private socket: WebSocket | undefined;
  
  /**
   *
   * @private
   */
  private onOpenCallback: (() => void) | undefined;
  
  constructor() {
    console.log ('socket constructor');
  }
  
  /**
   * Open connection
   */
  open(onOpenCallback:()=>void)
  {
    // save callback
    this.onOpenCallback = onOpenCallback
    
    try {
      this.socket = new WebSocket('ws://127.0.0.1:10000/websocket')
      console.log(this.socket, 'socked')
      
      this.socket.onopen = this.onOpen;
      this.socket.onmessage = this.onMessage;
      this.socket.onerror = this.onError;
      this.socket.onclose = this.onClose;
    }
    catch (e) {
      console.log(e, 'e')
    }
  }
  
  protected onOpen = () => {
    console.log ('Socket.onOpen');
    
    // rise callback
    if (this.onOpenCallback) {
      this.onOpenCallback()
    }
  }
  
  protected onMessage (this: WebSocket, ev: MessageEvent<any>): any {
    console.log (ev, 'Socket.onMessage');
    
    //
    
  }
  
  protected onError (this:WebSocket, ev:Event):any {
    console.log (ev, 'Socket.onError');
  }
  
  protected onClose = () => {
    console.log ('Socket.onClose');
  }
  
  public sendData = (data:object) => {
    console.log (data, 'Socket.sendData');
    if (!this.socket) return;
    
    const stringData = JSON.stringify(data)
    this.socket.send(stringData);
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
