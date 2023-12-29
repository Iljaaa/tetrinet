import {Graphics} from "./Graphics";
import {GameScreen} from "./GameScreen";

/**
 * @version 1.0.0
 */
export interface Game
{
  
  /**
   * Graphics object
   */
 getGLGraphics():Graphics
  
  /**
   * Set screen
   */
  setScreen(screen:GameScreen):void
  
  /**
   *
   */
  getCurrentScreen():GameScreen|null
}
