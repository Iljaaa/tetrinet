/**
 *
 */
export enum RequestTypes {
    start = 'start',
    join = 'join', // find party game
    back = 'back', // back to game
    set = 'set', // this is when cup updated
    pause = 'pause',
    resume = 'resume',
    addLine = 'addLine', // this request not used, we use only super blocks
    sendBonus = 'sendBonus',
}