/**
 * Game states
 */
export enum GameState {
    waiting = 'waiting', // we waiting user reaction
    ready = 'ready', // game found, final countdown
    running = 'running',
    paused = 'paused',
    over = 'over',
}