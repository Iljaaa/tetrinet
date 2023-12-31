import {Figure} from "../models/Figure";
import {Cup} from "../models/Cup";
import {Coords} from "../math/Coords";
import {FourBlocksFigure} from "./FourBlocksFigure"

/**
 * the horse figure like in chess
 */
export class Line extends FourBlocksFigure implements Figure
{
  
  // current position of the figure
  protected _vertical:boolean = false
  
  /**
   * @param cap
   */
  constructor(cap:Cup)
  {
    super(cap);
    
    // init start figure
    
    // random position
    this._vertical = Math.random() < 0.5;
    
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
    const coords = this.getCoordsOfAllCellsByStateAndCenter(this._vertical, this.center.x, this.center.y)
    
    // move coords to fields
    this._fields = coords.map((c:Coords) => {
      return this._cap.getCellIndexByCoords(c)
    })
  }
  
  /**
   * Rotate to right
   */
  rotateClockwise():boolean
  {
    // change state position
    let nextPosition = !this._vertical
    
    // update fields
    const capWidth = this._cap.getWidthInCells()
    
    // this center if we need to move it
    let centerX = this.center.x
    
    // this is special situation
    if (this._vertical) {
      // if center next to right age
      // we move center for rotate
      if (this.center.x === 0) {
        centerX += 1
      }
      
      if (this.center.x === capWidth -1) {
        centerX -= 2
      }
      
      if (this.center.x === capWidth -2) {
        centerX -= 1
      }
    }
    
    // fields after rotate
    const coordsAfterRotate = this.getCoordsOfAllCellsByStateAndCenter(nextPosition, centerX, this.center.y)
    
    // update buy position
    // this.updateByPosition(this._position);
    
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
      if (this._cap.getFieldValueByIndex(createIndexByCoords)) {
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
    this._vertical = nextPosition
    
    // move center if id happens
    this.center.x = centerX;
    
    return true;
  }
  
  rotateCounterClockwise(): boolean
  {
    // change state position
    let previousPosition = !this._vertical
    
    // update fields
    const capWidth = this._cap.getWidthInCells()
    
    // this center if we need to move it
    let centerX = this.center.x
    
    // this is special situation
    if (this._vertical) {
      // if center next to right age
      // we move center for rotate
      if (this.center.x === 0) {
        centerX += 1
      }
      
      if (this.center.x === capWidth -1) {
        centerX -= 2
      }
      
      if (this.center.x === capWidth -2) {
        centerX -= 1
      }
    }
    
    // fields after rotate
    const coordsAfterRotate = this.getCoordsOfAllCellsByStateAndCenter(previousPosition, centerX, this.center.y)
    
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
      if (this._cap.getFieldValueByIndex(createIndexByCoords)) {
        return true
      }
      
      return false
    });
    
    if (sinfulnessIndex !== -1){
      return false
    }
    
    // update feeld coords by points
    this._fields[0] = coordsAfterRotate[0].y * capWidth + coordsAfterRotate[0].x
    this._fields[1] = coordsAfterRotate[1].y * capWidth + coordsAfterRotate[1].x
    this._fields[2] = coordsAfterRotate[2].y * capWidth + coordsAfterRotate[2].x
    this._fields[3] = coordsAfterRotate[3].y * capWidth + coordsAfterRotate[3].x
    
    // save position
    this._vertical = previousPosition
    
    // move center if id happens
    this.center.x = centerX;
    
    return true;
  }
  
  
  
  /**
   * returns an array of points with coordinates after rotation
   * @var number state horse's state from 0 to 3
   */
  getCoordsOfAllCellsByStateAndCenter (isVertical:boolean, centerX:number, centerY:number): Array<Coords>
  {
    
    // o
    // 0
    // o
    // o
    if (isVertical)
    {
      return [
        {x: centerX, y: centerY},
        {x: centerX, y: centerY +1},
        {x: centerX, y: centerY -1},
        {x: centerX, y: centerY -2}
      ];
    }
    
    // o0oo
    else
    {
      return [
        {x: centerX, y: centerY},
        {x: centerX -1, y: centerY},
        {x: centerX +1, y: centerY},
        {x: centerX +2, y: centerY}
      ];
    }
    
  }
  
  

}
