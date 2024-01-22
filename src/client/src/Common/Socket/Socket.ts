export class Socket {
  
  open(){
    try {
      // const socket = new WebSocket('/s.php')
      const socket = new WebSocket('ws://127.0.0.1:10000')
      console.log(socket, 'socked')
      
      socket.onopen = this.onOpen;
      socket.onmessage = this.onMessage;
      socket.onerror = this.onError;
      socket.onclose = this.onClose;
    }
    catch (e) {
      console.log(e, 'e')
    }
  }
  
  onOpen = () => {
    console.log ('Socket.onOpen');
  }
  
  onMessage (this: WebSocket, ev: MessageEvent<any>): any {
    console.log (ev, 'Socket.onMessage');
  }
  
  onError (this:WebSocket, ev:Event):any {
    console.log (ev, 'Socket.onError');
  }
  
  onClose = () => {
    console.log ('Socket.onClose');
  }
  
}
