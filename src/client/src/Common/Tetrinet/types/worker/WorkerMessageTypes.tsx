
export enum WorkerMessageTypes {
  startTimer = 'startTimer',
  stopTimer = 'stopTimer',
  pauseTimer = 'pauseTimer',
  resumeTimer = 'resumeTimer',
  resetTimer = 'resetTimer',

  // se new delay with speed up
  setDelay = 'setDelay',

  downTick = 'downTick'
}