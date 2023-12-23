import {Figure} from "../models/Figure";
import {Cup} from "../models/Cup";
import {Coords} from "../math/Coords";
import {BaseFigure} from "../BaseFigure"

/**
 * the horse figure like in chess
 */
export abstract class Flash extends BaseFigure implements Figure
{
  
  // current position of the figure
  protected _vertical:boolean = false
  
  /**
   * @param cap
   * @param center
   */
  constructor(cap:Cup, center:Coords)
  {
    super(cap, center);
    
    // init start figure
    
    // random position
    this._vertical = Math.random() < 0.5;
    
    // this is start fields with center in 33
    // this._fields = [33, 13, 23, 34];
    const coords = this.getCoordsOfAllCellsByStateAndCenter(this._vertical, this.center)
    
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
    
    // we take next position
    // let nextPosition = this._position+1;
    // if (nextPosition > 3) nextPosition = 0
    
    // the center is presented in coords 0
    // const center = this._cap.getCoordsByIndex(this._fields[0]);
    
    // fields after rotate
    const coordsAfterRotate = this.getCoordsOfAllCellsByStateAndCenter(nextPosition, this.center)
    
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
    
    // update feeld coords by points
    this._fields[0] = coordsAfterRotate[0].y * capWidth + coordsAfterRotate[0].x
    this._fields[1] = coordsAfterRotate[1].y * capWidth + coordsAfterRotate[1].x
    this._fields[2] = coordsAfterRotate[2].y * capWidth + coordsAfterRotate[2].x
    this._fields[3] = coordsAfterRotate[3].y * capWidth + coordsAfterRotate[3].x
    
    // save position
    this._vertical = nextPosition
    
    return true;
  }
  
  rotateCounterClockwise(): boolean
  {
    let previousPosition = !this._vertical
    
    // update fields
    const capWidth = this._cap.getWidthInCells()
    
    // the center is presented in coords 0
    // const center = this._cap.getCoordsByIndex(this._fields[0]);
    
    // fields after rotate
    const coordsAfterRotate = this.getCoordsOfAllCellsByStateAndCenter(previousPosition, this.center)
    
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
    
    return true;
  }
  
  /**
   * returns an array of points with coordinates after rotation
   * @var number state horse's state from 0 to 3
   */
  abstract getCoordsOfAllCellsByStateAndCenter (isVertical:boolean, center:Coords): Array<Coords>
  
  
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
