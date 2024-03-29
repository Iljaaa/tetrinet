import {Figure} from "../models/Figure";
import {Cup} from "../models/Cup";
import {Coords} from "../math/Coords";
import {FourBlocksFigure} from "./FourBlocksFigure"

/**
 * the horse figure like in chess
 */
export class Square extends FourBlocksFigure implements Figure
{
  
  /**
   * @param cap
   * @param color
   */
  constructor(cap:Cup, color:number)
  {
    super(cap, color);
    
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
    const coords = this.getCoordsOfAllCellsByStateAndCenter(this.center)
    
    // move coords to fields
    this._fields = coords.map((c:Coords) => {
      return this._cap.getCellIndexByCoords(c.x, c.y)
    })
  }
  
  /**
   *
   */
  getPreviewFields(): Array<Array<boolean>> {
    return [
      [true, true],
      [true, true]
    ];
  }
  
  /**
   * Rotate to right
   */
  rotateClockwise():boolean
  {
    return false;
  }
  
  rotateCounterClockwise(): boolean
  {
    return false;
  }
  
  /**
   * returns an array of points with coordinates after rotation
   * @var number state horse's state from 0 to 3
   */
  getCoordsOfAllCellsByStateAndCenter (center:Coords): Array<Coords>
  {
    // 0o
    // oo
    return [
      {x: center.x, y: center.y},
      {x: center.x +1, y: center.y},
      {x: center.x +1, y: center.y -1},
      {x: center.x, y: center.y -1}
    ];
    
  }
}
