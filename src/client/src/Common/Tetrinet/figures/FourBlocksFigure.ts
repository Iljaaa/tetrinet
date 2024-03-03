import {Cup} from "../models/Cup";
import {Coords} from "../math/Coords";

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
   * Rotate center of figure in cup coordinates
   * @protected
   */
  protected center: Coords = new Coords(0, 0)

  /**
   * Figure color
   * @private
   */
  private color:number;

  /**
   * @deprecated
   * Cup object
   */
  protected _cap:Cup;

  /**
   * todo: remove class from constructor and add it t all messages
   * @param cap
   * @param color
   * @protected
   */
  protected constructor(cap:Cup, color:number) {
    this._cap = cap;
    //this.center = new Coords(this.center.x, center.y)
    this.color = color;
  }
  
  /**
   * It must have
   * @param coords it must have 4 elements!
   * @param cupWidthInCols
   * @protected
   */
  protected updateFieldsByCoords(coords:Array<Coords>, cupWidthInCols:number):void
  {
    this._fields[0] = coords[0].y * cupWidthInCols + coords[0].x
    this._fields[1] = coords[1].y * cupWidthInCols + coords[1].x
    this._fields[2] = coords[2].y * cupWidthInCols + coords[2].x
    this._fields[3] = coords[3].y * cupWidthInCols + coords[3].x
  }
  
  getFields(): Array<number> {
    return this._fields
  }


  getColor (): number {
    return this.color;
  }
  
  /**
   * Figure position
   * it used for rotate
   */
  // getPosition(): Coords {
  //   return this.center;
  // }
  
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
      return this._cap.getCoordsByIndex(index).y >= this._cap.getHeightInCells() - 1
      // return index < capWidth
    })
    
    if (hasBlockInZeroLine !== -1) return false;
    
    // calculate new position on fields
    let newFields:Array<number> = this._fields.map((f) => f + capWidth);
    
    // check intersections with cup
    if (!this._cap.canPlace(newFields)) {
      return false;
    }
    
    // move center down
    this.center.y += 1;
    
    // write new fields
    this._fields = newFields
    
    return true;
  }

  /**
   * checks that the block is outside the glass
   * @param x
   * @param y
   * @protected
   */
  protected isBlockOutsideCup (x:number, y:number)
  {
    // left edge
    if (x < 0) return true

    // right edge
    if (x >= this._cap.getWidthInCells()) return true

    // bottom
    // if (c.y < 0) return true
    if (y >= this._cap.getHeightInCells()) return true

    return false;
  }

  /**
   * In array of fields we are looking who is outside field or intersect with blocks in cup
   * @protected
   */
  protected findSinfulnessIndex (items:Array<Coords>): number
  {
    return items.findIndex((c:Coords) =>
    {
      // check min max position
      // if (c.x < 0) return true
      // if (c.y < 0) return true
      // if (c.y >= this._cap.getHeightInCells()) return true
      // if (c.x >= capWidth) return true
      // if (c.y > this.) check in it higher than top
      if (this.isBlockOutsideCup(c.x, c.y)){
        return true;
      }

      // cell index in field coords
      const createIndexByCoords = this._cap.getCellIndexByCoords(c.x, c.y)

      // check in fields
      let b = this._cap.getFieldByIndex(createIndexByCoords)
      if (b !== undefined && b.block > -1) return true

      return false
    });
  }
}
