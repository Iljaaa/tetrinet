import {WorkerMessage} from "./Tetrinet/types/worker/WorkerMessage";
import {WorkerMessageTypes} from "./Tetrinet/types/worker/WorkerMessageTypes";

// eslint-disable-next-line import/no-webpack-loader-syntax
import Worker from "worker-loader!./worker.ts"

export type WorkerEventListener = {
  onTickDown: () => void,
}


export class WorkerSingleton
{

  /**
   * Asinc worker
   * @private
   */
  private static worker?:Worker = undefined;

  /**
   * Event listener
   * @private
   */
  private static eventListener?:WorkerEventListener = undefined

  public static init()
  {
    console.log('WorkerSingleton.init');
    WorkerSingleton.worker = new Worker();

    WorkerSingleton.worker.onmessage = (event:MessageEvent) => {
      if ((event.data as WorkerMessage).type === WorkerMessageTypes.downTick) {
        this.eventListener?.onTickDown()
      }
    };

    WorkerSingleton.worker.onerror = (event:any) => {
      console.log(event, 'webworker error');
    };

    WorkerSingleton.worker.postMessage(5);
    console.log (this.worker, 'Tetrinet.startDownTimerInWorker');
  }

  public static finalize (){
    console.log ('WorkerSingleton.finalize');
    // WorkerSingleton.worker?.terminate();
  }

  public static setListener (listener:WorkerEventListener){
    WorkerSingleton.eventListener = listener;
  }

  public static startTimer (){
    WorkerSingleton.worker?.postMessage({
      type:WorkerMessageTypes.startTimer
    })
  }

  public static pauseTimer () {
    WorkerSingleton.worker?.postMessage({
      type:WorkerMessageTypes.pauseTimer
    })
  }

  public static resumeTimer () {
    WorkerSingleton.worker?.postMessage({
      type:WorkerMessageTypes.resumeTimer
    })
  }

  public static resetTimer () {
    WorkerSingleton.worker?.postMessage({
      type:WorkerMessageTypes.resetTimer
    })
  }

}