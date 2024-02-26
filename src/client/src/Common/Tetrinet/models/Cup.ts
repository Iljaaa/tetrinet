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
  getFieldByIndex (index:number): Field|undefined

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
  canPlace (newFields:Array<number>): boolean

  /**
   * This method do:
   * find full rows
   * clear full rows
   * move rows down
   */
  clearAndMoveLines():void

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
   *
   * @param c
   */
  getFieldByCoords (c:Coords):Field

  /**
   * Clear data in block
   */
  clearBlockByCoords (c:Coords):void

  /**
   * Clear data in block
   */
  clearBlockByIndex (cellIndex:number):void

  /**
   * Copy block from one place to another
   * @param source
   * @param target
   */
  copyBlockByCoords (source:Coords, target:Coords):void

  /**
   * cup width
   */
  getWidthInCells (): number

  /**
   * cup height
   */
  getHeightInCells (): number

  /**
   * @deprecated this must be in cup with bonus filed
   * @param filedIndex
   * @param bonusIndex
   */
  addBonusFiled: (filedIndex:number, bonusIndex:number) => void;

  /*
   *
   */
  // blowRandomField() => void

  /**
   @deprecated that not should be here
   * Add random row below in cup
   * @param countLines Number of lines to add
   */
  addRandomRowBellow: (countLines:number) => void

  /**
   * @deprecated this is not should be here
   * Remove rows from bottom of cup
   * @param countLines Number of lines to add
   */
  removeRowsBellow: (countLines:number) => void
}
