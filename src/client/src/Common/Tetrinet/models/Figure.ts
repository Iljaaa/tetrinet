
/**
 *
 */
export interface Figure
{

  /**
   * Figure fields inside cup
   */
  getFields: () => Array<number>

  /**
   * Figure color
   */
  getColor: () => number
  
  /**
   * Array for field for preview
   */
  getPreviewFields: () => Array<Array<boolean>>
  
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



