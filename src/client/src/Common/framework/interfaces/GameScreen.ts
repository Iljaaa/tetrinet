/**
 * @version 0.0.1
 */
export interface GameScreen
{
  
  /**
   * Update
   * @param deltaTime
   */
  update(deltaTime:number): void
  
  /**
   * Present
   */
  present(): void
}
