import {Coords} from "../math/Coords";
import {Flash} from "./Flash";

/**
 * the horse figure like in chess
 *
 *  00
 * 00
 */
export class ForwardFlash extends Flash
{
  
  /**
   * returns an array of points with coordinates after rotation
   * @var number state horse's state from 0 to 3
   */
  getCoordsOfAllCellsByStateAndCenter (isVertical:boolean, center:Coords): Array<Coords>
  {
    
    // o
    // 0o
    //  0
    if (isVertical)
    {
      return [
        {x: center.x, y: center.y},
        {x: center.x, y: center.y +1},
        {x: center.x +1, y: center.y},
        {x: center.x +1, y: center.y -1}
      ];
    }
    
    //  0o
    // oo
    else
    {
      return [
        {x: center.x, y: center.y},
        {x: center.x +1, y: center.y},
        {x: center.x, y: center.y - 1},
        {x: center.x -1, y: center.y - 1}
      ];
    }
    
  }

}
