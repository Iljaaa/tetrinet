import {Coords} from "../math/Coords";
import {Flash} from "./Flash";

/**
 * the horse figure like in chess
 *
 * 00
 *  00
 *
 */
export class BackFlash extends Flash
{
  
  /**
   * returns an array of points with coordinates after rotation
   * @var number state horse's state from 0 to 3
   */
  getCoordsOfAllCellsByStateAndCenter (isVertical:boolean, centerX:number, centerY:number): Array<Coords>
  {
    //  o
    // 0o
    // o
    if (isVertical)
    {
      return [
        {x: centerX, y: centerY},
        {x: centerX +1, y: centerY},
        {x: centerX +1, y: centerY +1},
        {x: centerX, y: centerY -1}
      ];
    }
    
    // o0
    //  oo
    else
    {
      return [
        {x: centerX, y: centerY},
        {x: centerX-1, y: centerY},
        {x: centerX, y: centerY - 1},
        {x: centerX +1, y: centerY - 1}
      ];
    }
    
  }

}
