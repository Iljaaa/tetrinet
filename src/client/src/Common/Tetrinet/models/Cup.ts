import {Coords} from "../math/Coords";
import {CupData} from "./CupData";
import {CupState} from "../types/CupState";
import {Field} from "./Field";

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
   * All fields array
   */
  getFields: () => Array<Field>

  /**
   * Set fields data
   */
  setFields (fields:Array<Field>): void

  /**
   *
   * @param index
   */
  getFieldByIndex (index:number): Field

  /**
   * @param x
   * @param y
   * @param field
   */
  setFieldByCoordinates(x: number, y:number, field:Field):void

  /**
   * Set field info
   */
  setFieldByIndex (index:number, field:Field):void

  /**
   * Super fields array
   */
  // getBonusFields(): Array<number>

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
  // getFieldValueByIndex(index:number):number

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
   * @param filedIndex
   * @param bonusIndex
   */
  addBonusFiled: (filedIndex:number, bonusIndex:number) => void;

  /*
   *
   */
  // blowRandomField() => void

  /**
   * Add random row below in cup
   * @param countLines Number of lines to add
   */
  addRandomRowBellow: (countLines:number) => void

  /**
   * Remove rows from bottom of cup
   * @param countLines Number of lines to add
   */
  removeRowsBellow: (countLines:number) => void
}
