/**
 * todo: make here special type
 */
export type SocketEventListener = {
  onMessageReceive: (data:{cup:{fields:Array<number>}}) => void
}
