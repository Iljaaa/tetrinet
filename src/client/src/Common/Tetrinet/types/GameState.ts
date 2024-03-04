/**
 * Game states
 */
export enum GameState {
    waiting = 'waiting', // we are waiting user reaction
    searching = 'searching', // searching the game
    ready = 'ready', // game found, final countdown
    running = 'running',
    paused = 'paused',
    over = 'over',
}