import {Graphics} from "./Graphics";
import {GameScreen} from "./GameScreen";
import {Input} from "./Input";

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
  * Input object
  */
 getInput():Input
  
  /**
   * Set screen
   */
  setScreen(screen:GameScreen):void
  
  /**
   *
   */
  getCurrentScreen():GameScreen|null
}
