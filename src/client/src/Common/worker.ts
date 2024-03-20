import {WorkerMessage} from "./Tetrinet/types/worker/WorkerMessage";
import {WorkerMessageTypes} from "./Tetrinet/types/worker/WorkerMessageTypes";

class timer
{
  static downTimer:any = null

  // static startTimer (){
  //   timer.downTimer = setInterval(() => {
  //     worker.postMessage({
  //       type: WorkerMessageTypes.downTick
  //     });
  //   }, 1000)
  // }
}


// const self: Worker = <any>globalThis;



let currentDelay: number = 750;

let speedUpIteration = 10;


// eslint-disable-next-line no-restricted-globals
(self as any).addEventListener('message', (event:MessageEvent) =>
{
  // eslint-disable-next-line no-restricted-globals
  const worker = (self as any)

  const tickFunction = () => {
    speedUpIteration -= 1;
    console.log ('tickFunction', speedUpIteration)
    if (speedUpIteration <= 0) {
      speedUpIteration = 10;
      if (currentDelay >= 200) currentDelay -= 50
      console.log ('speedUp', currentDelay)

      clearInterval(timer.downTimer)
      timer.downTimer = setInterval(tickFunction, currentDelay)
    }

    worker.postMessage({ type: WorkerMessageTypes.downTick });
  }

  /**
   * timer counter
   */
  // let timer;
  if (typeof event.data === 'object')
  {

    // start timer
    switch ((event.data as WorkerMessage).type )
    {
      case WorkerMessageTypes.startTimer: {
        currentDelay = 1000
        timer.downTimer = setInterval(tickFunction, currentDelay)
      }  break;

      case WorkerMessageTypes.pauseTimer: {
        clearInterval(timer.downTimer)
      } break;

      case WorkerMessageTypes.resumeTimer: {
        timer.downTimer = setInterval(tickFunction, currentDelay)
      }  break;

      case WorkerMessageTypes.resetTimer: {
        clearInterval(timer.downTimer)
        timer.downTimer = setInterval(tickFunction, currentDelay)
      }  break;
    }

  }

  // pause timer

  // const result = factorial(event.data);

  // worker.postMessage(22);
})
//window.self.onmessage =
