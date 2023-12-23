import {Coords} from "../math/Coords";
import {Horse} from "./Horse";

/**
 * the horse figure like in chess
 *
 * 00
 * 0
 * 0
 *
 */
export class ForwardHorse extends Horse
{
  
  /**
   * returns an array of points with coordinates after rotation
   * @var number state horse's state from 0 to 3
   */
  getCoordsOfAllCellsByStateAndCenter (state:number, center:Coords): Array<Coords>
  {
    
    // 0O
    // O
    // O
    if (state === 0)
    {
      return [
        {x: center.x, y: center.y},
        {x: center.x, y: center.y - 1},
        {x: center.x, y: center.y - 2},
        {x: center.x + 1, y: center.y}
      ];
    }
    
    // o0o
    //   o
    else if (state === 1)
    {
      return [
        {x: center.x, y: center.y},
        {x: center.x - 1, y: center.y},
        {x: center.x + 1, y: center.y},
        {x: center.x + 1, y: center.y - 1}
      ];
    }
    
    
    //  o
    // 0o this is not in center figure
    // oo
    if (state === 2)
    {
      return [
        {x: center.x + 1, y: center.y + 1},
        {x: center.x + 1, y: center.y},
        {x: center.x + 1, y: center.y - 1},
        {x: center.x, y: center.y - 1}
      ];
    }
    // 0
    // ooo
    else
    {
      return [
        {x: center.x, y: center.y},
        {x: center.x, y: center.y - 1},
        {x: center.x +1, y: center.y - 1},
        {x: center.x +2, y: center.y - 1}
      ];
    }
    
  }
  
  

}
