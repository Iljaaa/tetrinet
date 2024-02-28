/**
 * This is listener with only one method that receive new message
 */
export type SocketMessageEventListener =
{
  onMessageReceive: (data:any) => void
}
