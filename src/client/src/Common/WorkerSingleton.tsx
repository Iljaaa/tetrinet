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
    if (WorkerSingleton.worker !== undefined) return;

    WorkerSingleton.worker = new Worker();

    WorkerSingleton.worker.onmessage = (event:MessageEvent) => {
      if ((event.data as WorkerMessage).type === WorkerMessageTypes.downTick) {
        this.eventListener?.onTickDown()
      }
    };

    WorkerSingleton.worker.onerror = (event:any) => {
      console.error(event, 'webworker error');
    };

    WorkerSingleton.worker.postMessage(5);
  }

  /**
   * Destroy worker
   * Finalize in not necessary because it closes when the page closes
   */
  public static finalize (){
    console.info ('WorkerSingleton.finalize');
    // WorkerSingleton.worker?.terminate();
  }

  public static setListener (listener:WorkerEventListener){
    WorkerSingleton.eventListener = listener;
  }

  /**
   * Start timer on new game
   * @param startDelay
   */
  public static startTimer (startDelay:number = 800){
    WorkerSingleton.worker?.postMessage({
      type:WorkerMessageTypes.startTimer,
      delay: startDelay
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

  /**
   * Trow to worker new down delay
   * @param delay
   */
  public static setDelay(delay:number) {
    WorkerSingleton.worker?.postMessage({
      type:WorkerMessageTypes.setDelay,
      delay: delay
    })
  }

}