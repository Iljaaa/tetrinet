import {Cup} from "./models/Cup";
import {Coords} from "./math/Coords";

/**
 * Base figure class FOR FOUR BLOCKS part of implementation Figure
 */
export abstract class FourBlocksFigure
{
  /**
   * Fields in coordinates of a cup
   * @protected
   */
  protected _fields:Array<number> = new Array<number>(4);
  
  /**
   * Rotate center of figure
   * @protected
   */
  protected center: Coords;
  
  /**
   * Cup object
   * @protected
   */
  protected _cap:Cup;
  
  protected constructor(cap:Cup, center:Coords) {
    this._cap = cap;
    this.center = new Coords(center.x, center.y)
  }
  
  getFields(): Array<number> {
    return this._fields
  }
  
  getPosition(): Coords {
    return this.center;
  }
  
  /**
   * Move figure left
   * same for all figures
   */
  moveLeft(): boolean
  {
    const capWidth = this._cap.getWidthInCells()
    
    // and we can when if index not on last position
    let blockOnEdge = this._fields.find((index) => {
      // calculate x position
      const theXPosition = index % capWidth
      
      // if it has max index
      return theXPosition === 0
    })
    
    if (blockOnEdge !== undefined) return false;
    
    // calculate new position on fields
    let newFields:Array<number> = this._fields.map((f) => f - 1);
    
    // check intersections with cup
    if (!this._cap.canPlace(newFields)) {
      return false;
    }
    
    // move center left
    this.center.x -= 1;
    
    // write new fields
    this._fields = newFields
    
    return true;
  }
  
  /**
   * Move figure right
   * same for all figures
   */
  moveRight(): boolean
  {
    const capWidth = this._cap.getWidthInCells()
    
    // check can we do this
    // and we can when if index not on last position
    let blockOnEdge = this._fields.find((index:number) => {
      // calculate x position
      const theXPosition = index % capWidth
      
      // if it has max index
      return theXPosition >= capWidth - 1
    })
    
    if (blockOnEdge !== undefined) return false;
    
    // calculate new position on fields
    let newFields:Array<number> = this._fields.map((f:number) => f + 1);
    
    // check intersections with cup
    if (!this._cap.canPlace(newFields)) {
      return false;
    }
    
    // move center right
    this.center.x += 1;
    
    // write new fields
    this._fields = newFields
    
    return true;
  }
  
  /**
   * Move figure down
   * return true if move happen
   * same for all figures
   */
  moveDown(): boolean
  {
    const capWidth = this._cap.getWidthInCells()
    
    // check can we do this
    // and we can when if index not on last position
    let hasBlockInZeroLine:number = this._fields.findIndex((index:number) => {
      // is we have a block with coords in first line
      return index < capWidth
    })
    
    if (hasBlockInZeroLine !== -1) return false;
    
    // calculate new position on fields
    let newFields:Array<number> = this._fields.map((f) => f - capWidth);
    
    // check intersections with cup
    if (!this._cap.canPlace(newFields)) {
      return false;
    }
    
    // move center down
    this.center.y -= 1;
    
    // write new fields
    this._fields = newFields
    
    return true;
  }
}
