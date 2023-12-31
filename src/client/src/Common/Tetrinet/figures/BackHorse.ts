import {Coords} from "../math/Coords";
import {Horse} from "./Horse";

/**
 * the horse figure like in chess
 *
 * 00
 *  0
 *  0
 *
 */
export class BackHorse extends Horse
{
  
  /**
   * returns an array of points with coordinates after rotation
   * @var number state horse's state from 0 to 3
   */
  getCoordsOfAllCellsByStateAndCenter (state:number, centerX:number, centerY:number): Array<Coords>
  {
    
    // 0o
    //  O
    //  O
    if (state === 0)
    {
      return [
        {x: centerX, y: centerY},
        {x: centerX +1, y: centerY},
        {x: centerX +1, y: centerY -1},
        {x: centerX +1, y: centerY -2}
      ];
    }
    
    //  0o
    // ooo
    else if (state === 1)
    {
      return [
        {x: centerX +1, y: centerY},
        {x: centerX +1, y: centerY - 1},
        {x: centerX, y: centerY - 1},
        {x: centerX -1, y: centerY - 1}
      ];
    }
    
    
    // o
    // 0
    // oo
    if (state === 2)
    {
      return [
        {x: centerX, y: centerY +1},
        {x: centerX, y: centerY},
        {x: centerX, y: centerY - 1},
        {x: centerX + 1, y: centerY - 1}
      ];
    }
    // 0oo
    // o
    else
    {
      return [
        {x: centerX, y: centerY},
        {x: centerX, y: centerY - 1},
        {x: centerX +1, y: centerY},
        {x: centerX +2, y: centerY}
      ];
    }
    
  }
  
  /**
   *
   */
  getPreviewFields(): Array<Array<boolean>>
  {
    // 0o
    //  O
    //  O
    if (this._position === 0)
    {
      return [
        [true, true],
        [false, true],
        [false, true],
      ];
    }
    
    //  0o
    // ooo
    else if (this._position === 1)
    {
      return [
        [false, false, true],
        [true, true, true],
      ];
    }
    
    
    // o
    // 0
    // oo
    if (this._position === 2)
    {
      return [
        [true, false],
        [true, false],
        [true, true],
      ];
    }
    // 0oo
    // o
    else
    {
      return [
        [true, true, true],
        [true, false, false],
      ];
    }
  }

}
