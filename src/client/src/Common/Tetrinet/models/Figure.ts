import {Coords} from "../math/Coords";

/**
 *
 */
export interface Figure
{
  
  // constructor: () => Figure
  
  /**
   * Figure fields
   */
  getFields: () => Array<number>
  
  /**
   * Rotate center of figure
   */
  getPosition: () => Coords
  
  /**
   * Move figure to position
   * @param x
   * @param y
   */
  setPosition: (x:number, y:number) => void
  
  /**
   * Move figure down
   * return true if move was success
   */
  moveDown: () => boolean
  
  /**
   * Move figure down
   * return true if move was success
   */
  moveLeft: () => boolean
  
  /**
   * Move figure down
   * return true if move was success
   */
  moveRight: () => boolean
  
  /**
   * Rotate figure method
   * return true if rotate was success
   */
  rotateClockwise: () => boolean
  
  /**
   * Rotate figure method
   * return true if rotate was success
   */
  rotateCounterClockwise: () => boolean
  
}



