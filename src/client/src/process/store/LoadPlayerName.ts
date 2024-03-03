/**
 * Load username from store
 */
export const LoadPlayerName = ():string =>
{
  if (window.localStorage) {
    const playerName = window.localStorage.getItem('playerName')
    if (playerName) return  playerName;
  }

  return ''
}