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
  getCoordsOfAllCellsByStateAndCenter (state:number, centerX:number, centerY:number): Array<Coords>
  {
    
    // 0O
    // O
    // O
    if (state === 0)
    {
      return [
        {x: centerX, y: centerY},
        {x: centerX, y: centerY - 1},
        {x: centerX, y: centerY - 2},
        {x: centerX + 1, y: centerY}
      ];
    }
    
    // o0o
    //   o
    else if (state === 1)
    {
      return [
        {x: centerX, y: centerY},
        {x: centerX - 1, y: centerY},
        {x: centerX + 1, y: centerY},
        {x: centerX + 1, y: centerY - 1}
      ];
    }
    
    
    //  o
    // 0o this is not in center figure
    // oo
    if (state === 2)
    {
      return [
        {x: centerX + 1, y: centerY + 1},
        {x: centerX + 1, y: centerY},
        {x: centerX + 1, y: centerY - 1},
        {x: centerX, y: centerY - 1}
      ];
    }
    // 0
    // ooo
    else
    {
      return [
        {x: centerX, y: centerY},
        {x: centerX, y: centerY - 1},
        {x: centerX +1, y: centerY - 1},
        {x: centerX +2, y: centerY - 1}
      ];
    }
    
  }
  
  /**
   *
   */
  getPreviewFields(): Array<Array<boolean>>
  {
    // 0O
    // O
    // O
    if (this._position === 0)
    {
      return [
       [true, true],
       [true, false],
       [true, false],
      ];
    }
    
    // o0o
    //   o
    else if (this._position === 1)
    {
      return [
        [true, true, true],
        [false, false, true],
      ];
    }
    
    
    //  o
    // 0o this is not in center figure
    // oo
    if (this._position === 2)
    {
      return [
        [false, true],
        [false, true],
        [true, true],
      ];
    }
    // 0
    // ooo
    else
    {
      return [
        [true, false, false],
        [true, true, true],
      ];
    }
  }

}
