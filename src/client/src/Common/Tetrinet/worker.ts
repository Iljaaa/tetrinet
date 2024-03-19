import {WorkerMessage} from "./types/worker/WorkerMessage";
import {WorkerMessageTypes} from "./types/worker/WorkerMessageTypes";


let downTimer = null;

// const self: Worker = <any>globalThis;

// eslint-disable-next-line no-restricted-globals
(self as any).addEventListener('message', (event:MessageEvent) =>
{
  // eslint-disable-next-line no-restricted-globals
  const worker = (self as any)
  console.log (event.data, 'inside worker');
  if (typeof event.data === 'object')
  {

    // when game is start we start timer
    if ((event.data as WorkerMessage).type === WorkerMessageTypes.startDownTimer)
    {
      // todo: calculate from speed
      downTimer = setInterval(() => {
        worker.postMessage({
          type: WorkerMessageTypes.downTimerTick
        });
      }, 1000)
    }
  }

  // const result = factorial(event.data);

  worker.postMessage(22);
})
//window.self.onmessage =
