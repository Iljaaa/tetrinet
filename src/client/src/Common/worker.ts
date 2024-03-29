import {WorkerMessage} from "./Tetrinet/types/worker/WorkerMessage";
import {WorkerMessageTypes} from "./Tetrinet/types/worker/WorkerMessageTypes";

class timer
{

  /**
   *Timer running flag
   */
  static isTimerRun:boolean = false;

  /**
   * Timer object
   */
  static downTimer:any = null
}

let currentDelay: number = 1000;

// let speedUpIteration = 10;

// eslint-disable-next-line no-restricted-globals
(self as any).addEventListener('message', (event:MessageEvent) =>
{
  // eslint-disable-next-line no-restricted-globals
  const worker = (self as any)

  const tickFunction = () => {
    // speedUpIteration -= 1;
    // if (speedUpIteration <= 0) {
    //   speedUpIteration = 10;
    //   if (currentDelay >= 200) currentDelay -= 50
    //
    //   clearInterval(timer.downTimer)
    //   timer.downTimer = setInterval(tickFunction, currentDelay)
    // }

    worker.postMessage({ type: WorkerMessageTypes.downTick });

    // delay
    if (timer.isTimerRun) {
      timer.downTimer = setTimeout(tickFunction, currentDelay)
    }

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
        currentDelay = (event.data.delay) ? event.data.delay : 800
        clearTimeout(timer.downTimer)
        timer.isTimerRun = true
        timer.downTimer = setTimeout(tickFunction, currentDelay)
      }  break;

      case WorkerMessageTypes.pauseTimer:
      case WorkerMessageTypes.stopTimer: {
        timer.isTimerRun = false
        clearTimeout(timer.downTimer)
      } break;

      case WorkerMessageTypes.resumeTimer: {
        timer.isTimerRun = true
        timer.downTimer = setTimeout(tickFunction, currentDelay)
      }  break;

      case WorkerMessageTypes.resetTimer: {
        clearTimeout(timer.downTimer)
        timer.downTimer = setTimeout(tickFunction, currentDelay)
      }  break;

      case WorkerMessageTypes.setDelay: {
        currentDelay = event.data.delay
      }  break;
    }

  }

  // pause timer

  // const result = factorial(event.data);

  // worker.postMessage(22);
})
//window.self.onmessage =
