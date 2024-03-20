import {WorkerMessage} from "./Tetrinet/types/worker/WorkerMessage";
import {WorkerMessageTypes} from "./Tetrinet/types/worker/WorkerMessageTypes";

class timer
{
  static downTimer:any = null

  // static startTimer (){
  //   timer.downTimer = setInterval(() => {
  //     console.log ('tick in timer')
  //     worker.postMessage({
  //       type: WorkerMessageTypes.downTick
  //     });
  //   }, 1000)
  // }
}


// const self: Worker = <any>globalThis;

// eslint-disable-next-line no-restricted-globals
(self as any).addEventListener('message', (event:MessageEvent) =>
{
  // eslint-disable-next-line no-restricted-globals
  const worker = (self as any)

  const tickFunction = () => {
    console.log ('tick in timer')
    worker.postMessage({ type: WorkerMessageTypes.downTick });
  }

  /**
   * timer counter
   */
  // let timer;
  console.log (event.data, 'inside worker');
  if (typeof event.data === 'object')
  {

    // start timer
    switch ((event.data as WorkerMessage).type )
    {
      case WorkerMessageTypes.startTimer: {
        timer.downTimer = setInterval(tickFunction, 1000)
      }  break;

      case WorkerMessageTypes.pauseTimer: {
        if (timer.downTimer) clearInterval(timer.downTimer)
      } break;

      case WorkerMessageTypes.resumeTimer: {
        timer.downTimer = setInterval(tickFunction, 1000)
      }  break;

      case WorkerMessageTypes.resetTimer: {
        if (timer.downTimer) clearInterval(timer.downTimer)
        timer.downTimer = setInterval(tickFunction, 1000)
      }  break;
    }

  }

  // pause timer

  // const result = factorial(event.data);

  worker.postMessage(22);
})
//window.self.onmessage =
