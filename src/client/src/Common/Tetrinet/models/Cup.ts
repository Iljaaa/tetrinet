import {Coords} from "../math/Coords";
import {CupData} from "./CupData";
import {CupState} from "../types/CupState";

export interface Cup
{
  /**
   * Current cup state
   */
  getState: () => CupState

  /**
   *
   */
  setState: (state:CupState) => void

  /**
   * @deprecated use get state
   * All fields array
   */
  getFields: () => Array<number>

  /**
   * Set fields data
   */
  setFields: (fields:Array<number>) => void

  /**
   * Cup state, this is array of fields
   */
  getData: () => CupData

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

  /**
   * Add random row below in cup
   * @param countLines Number of lines to add
   */
  addRandomRowBellow: (countLines:number) => void

  /**
   * @param filedIndex
   * @param bonusIndex
   */
  addBonusFiled: (filedIndex:number, bonusIndex:number) => void;

  /**
   *
   */
  // blowRandomField() => void
}
