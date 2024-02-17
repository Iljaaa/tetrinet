/**
 *
 */
export enum RequestTypes {
    start = 'start',
    join = 'join',
    set = 'set', // this is when cup updated
    pause = 'pause',
    resume = 'resume',
    addLine = 'addLine', // this request not used, we use only super blocks
    sendBonus = 'sendBonus',
}