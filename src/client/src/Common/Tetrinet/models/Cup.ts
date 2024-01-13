import {Coords} from "../math/Coords";

export interface Cup
{
  /**
   * All fields array
   */
  getFields: () => Array<number>
  
  /**
   * Check can we place this array of indexes into cup
   * @param newFields
   */
  canPlace: (newFields:Array<number>) => boolean
  
  /**
   * Get field value
   */
  getFieldValueByIndex(index:number):number
  
  /**
   * Convert cell index into coords
   */
  getCoordsByIndex(cellIndex:number):Coords
  
  /**
   * Convert coords to field index
   */
  getCellIndexByCoords(c:Coords):number
  
  /**
   * cup width
   */
  getWidthInCells: () => number
  
  /**
   * cup height
   */
  getHeightInCells: () => number
  
  
}
