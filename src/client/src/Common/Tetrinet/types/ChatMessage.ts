
/**
 * This is log item from request
 */
export type ChatMessage =
{
  message: string,
  playerId: string,
  playerName: string,

  // date time as sting, we need to convert it to local value
  date: string
}