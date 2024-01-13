import {Figure} from "../models/Figure";
import {Cup} from "../models/Cup";
import {Coords} from "../math/Coords";
import {FourBlocksFigure} from "./FourBlocksFigure"

/**
 * the horse figure like in chess
 */
export abstract class Horse extends FourBlocksFigure implements Figure
{
  // current position of the figure
  protected _position:number = 0
  
  /**
   * @param cap
   */
  constructor(cap:Cup)
  {
    super(cap);
    
    // init start figure
    
    // random position
    this._position = Math.floor(Math.random() * 4);
    
    this.setPosition(1, 1)
  }
  
  /**
   * Set position
   * @param x
   * @param y
   */
  setPosition(x:number, y:number)
  {
    this.center.x = x
    this.center.y = y
    
    //
    const coords = this.getCoordsOfAllCellsByStateAndCenter(this._position, this.center.x, this.center.y)
    
    // move coords to fields
    this._fields = coords.map((c:Coords) => {
      return this._cap.getCellIndexByCoords(c)
    })
  }
  
  
  /**
   *
   */
  getPreviewFields(): Array<Array<boolean>> {
    return [[]];
  }
  
  // moveLeft(): boolean
  // {
  //   const capWidth = this._cap.getWidthInCells()
  //
  //   // check can we do this
  //   // and we can when if index not on last position
  //   let blockOnEdge = this._fields.find((index) => {
  //     // calculate x position
  //     const theXPosition = index % capWidth
  //
  //     // if it has max index
  //     return theXPosition === 0
  //   })
  //
  //   if (blockOnEdge !== undefined) return false;
  //
  //   // calculate new position on fields
  //   let newFields:Array<number> = this._fields.map((f) => f - 1);
  //
  //   // check intersections with cup
  //   if (!this._cap.canPlace(newFields)) {
  //     return false;
  //   }
  //
  //   // move center down
  //   this.center.x -= 1;
  //
  //   // write new fields
  //   this._fields = newFields
  //
  //   return true;
  // }
  
  // moveRight(): boolean
  // {
  //   const capWidth = this._cap.getWidthInCells()
  //
  //   // check can we do this
  //   // and we can when if index not on last position
  //   let blockOnEdge = this._fields.find((index:number) => {
  //     // calculate x position
  //     const theXPosition = index % capWidth
  //
  //     // if it has max index
  //     return theXPosition >= capWidth - 1
  //   })
  //
  //   if (blockOnEdge !== undefined) return false;
  //
  //   // calculate new position on fields
  //   let newFields:Array<number> = this._fields.map((f:number) => f + 1);
  //
  //   // check intersections with cup
  //   if (!this._cap.canPlace(newFields)) {
  //     return false;
  //   }
  //
  //   // move center down
  //   this.center.x += 1;
  //
  //   // write new fields
  //   this._fields = newFields
  //
  //   return true;
  // }
  
  /**
   * Move figure down
   */
  // moveDown(): boolean
  // {
  //   // const figureFields = this.getFields()
  //
  //   const capWidth = this._cap.getWidthInCells()
  //
  //   // check can we do this
  //   // and we can when if index not on last position
  //   let hasBlockInZeroLine:number = this._fields.findIndex((index:number) => {
  //     // is we have a block with coords in first line
  //     return index < capWidth
  //   })
  //
  //   if (hasBlockInZeroLine !== -1) return false;
  //
  //   // calculate new position on fields
  //   let newFields:Array<number> = this._fields.map((f) => f - capWidth);
  //
  //   // check intersections with cup
  //   if (!this._cap.canPlace(newFields)) {
  //     return false;
  //   }
  //
  //   // move center down
  //   this.center.y -= 1;
  //
  //   // write new fields
  //   this._fields = newFields
  //
  //   return true;
  // }
  
  /**
   * Rotate to right
   */
  rotateClockwise():boolean
  {
    // change state position
    // todo: refactor to enum
    let nextPosition = this._position + 1
    if (nextPosition > 3) nextPosition = 0
    
    // update fields
    const capWidth = this._cap.getWidthInCells()
    
    // this center if we need to move it
    let centerX = this.center.x
    
    // this is special situation
    // if center next to right age
    // we move center for rotate
    if (this._position === 0 && this.center.x === 0) {
      centerX += 1
    }
    
    // this is special situation
    // if center next to right age
    // we move center for rotate
    if (this._position === 2 && this.center.x === capWidth -2) {
      centerX -= 1
    }
    
    // fields after rotate
    const coordsAfterRotate = this.getCoordsOfAllCellsByStateAndCenter(nextPosition, centerX, this.center.y)
    
    // check can we update
    const sinfulnessIndex:number = coordsAfterRotate.findIndex((c:Coords) =>
    {
      // check min max
      if (c.x < 0) return true
      if (c.y < 0) return true
      if (c.x >= capWidth) return true
      // if (c.y > this.) check in it higher than top
      
      // cell index in field coords
      const createIndexByCoords = this._cap.getCellIndexByCoords(c)
      
      // check in fields
      if (this._cap.getFieldValueByIndex(createIndexByCoords) > -1) {
        return true
      }
      
      return false
    });
    
    //
    if (-1 !== sinfulnessIndex){
      return false
    }
    
    // update fields
    this.updateFieldsByCoords(coordsAfterRotate, capWidth)
    
    // save position
    this._position = nextPosition
    
    // move center if id happens
    this.center.x = centerX;
    
    return true;
  }
  
  rotateCounterClockwise(): boolean
  {
    // todo: refactor to enum
    let previousPosition = this._position - 1
    if (previousPosition < 0) previousPosition = 3
    
    // update fields
    const capWidth = this._cap.getWidthInCells()
    
    // this center if we need to move it
    let centerX = this.center.x
    
    // this is special situation
    // if center next to right age
    // we move center for rotate
    if (this._position === 2 && this.center.x === 0) {
      centerX += 1
    }
    
    // this is special situation
    // if center next to right age
    // we move center for rotate
    if (this._position === 0 && this.center.x === capWidth -2) {
      centerX -= 1
    }
    
    // the center is presented in coords 0
    // const center = this._cap.getCoordsByIndex(this._fields[0]);
    
    // fields after rotate
    const coordsAfterRotate = this.getCoordsOfAllCellsByStateAndCenter(previousPosition, centerX, this.center.y)
    
    // update buy position
    // this.updateByPosition(this._position);
    
    // check can we update
    const sinfulnessIndex = coordsAfterRotate.findIndex((c:{x:number, y:number}) =>
    {
      // check min max
      if (c.x < 0) return true
      if (c.y < 0) return true
      if (c.x >= capWidth) return true
      // if (c.y > this.) check in it higher than top
      
      // cell index in field coords
      const createIndexByCoords = this._cap.getCellIndexByCoords(c)
      
      // check in fields
      if (this._cap.getFieldValueByIndex(createIndexByCoords) > -1) {
        return true
      }
      
      return false
    });
    
    if (sinfulnessIndex !== -1){
      return false
    }
    
    // update fields
    this.updateFieldsByCoords(coordsAfterRotate, capWidth)
    
    // save position
    this._position = previousPosition
    
    // move center if id happens
    this.center.x = centerX;
    
    return true;
  }
  
  /**
   * returns an array of points with coordinates after rotation
   * @var number state horse's state from 0 to 3
   */
  abstract getCoordsOfAllCellsByStateAndCenter (state:number, centerX:number, centerY:number): Array<Coords>
  
  
  updateByPosition = (position:number):void =>
  {
    
    //
    const capWidth = this._cap.getWidthInCells()
    
    // the center is presented in coords 0
    const center = this._cap.getCoordsByIndex(this._fields[0]);
    
    // O
    // 0OO
    if (position === 0)
    {
      const p1 = {x: center.x + 1, y: center.y} // center
      const p2 = {x: center.x + 2, y: center.y}
      const p3 = {x: center.x, y: center.y + 1}
      
      this._fields[1] = p1.y * capWidth + p1.x
      this._fields[2] = p2.y * capWidth + p2.x
      this._fields[3] = p3.y * capWidth + p3.x
    }
    
    //  O
    //  O
    // O0
    else if (position === 1)
    {
      const p1 = {x: center.x - 1, y: center.y} // center
      const p2 = {x: center.x, y: center.y + 1}
      const p3 = {x: center.x, y: center.y + 2}
      
      this._fields[1] = p1.y * capWidth + p1.x
      this._fields[2] = p2.y * capWidth + p2.x
      this._fields[3] = p3.y * capWidth + p3.x
    }
    
    // OO0
    //   O
    else if (position === 2)
    {
      const p1 = {x: center.x - 1, y: center.y} // center
      const p2 = {x: center.x - 2, y: center.y}
      const p3 = {x: center.x, y: center.y - 1}
      
      this._fields[1] = p1.y * capWidth + p1.x
      this._fields[2] = p2.y * capWidth + p2.x
      this._fields[3] = p3.y * capWidth + p3.x
    }
    
    // 0O
    // O
    // O
    else
    {
      const p1 = {x: center.x, y: center.y - 1} // center
      const p2 = {x: center.x, y: center.y - 2}
      const p3 = {x: center.x + 1, y: center.y}
      
      this._fields[1] = p1.y * capWidth + p1.x
      this._fields[2] = p2.y * capWidth + p2.x
      this._fields[3] = p3.y * capWidth + p3.x
    }
  }
  

}
