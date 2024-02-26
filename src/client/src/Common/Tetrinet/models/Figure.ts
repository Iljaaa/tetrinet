import {Coords} from "../math/Coords";

/**
 * todo: move color property to figure
 */
export interface Figure
{
  
  // constructor: () => Figure
  
  /**
   * Figure fields
   */
  getFields: () => Array<number>
  
  /**
   *
   */
  getPreviewFields: () => Array<Array<boolean>>
  
  /**
   * Rotate center of figure
   */
  // getPosition: () => Coords
  
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



