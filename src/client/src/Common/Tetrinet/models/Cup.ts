import {Coords} from "../math/Coords";
import {CupData} from "./CupData";
import {CupState} from "../types/CupState";
import {Field} from "./Field";

export interface Cup
{
  /**
   * Current cup state
   */
  getState (): CupState

  /**
   *
   */
  setState (state:CupState): void

  /**
   * All fields array
   */
  getFields (): Array<Field>

  /**
   * Set fields data
   */
  setFields (fields:Array<Field>): void

  /**
   * Clear cup
   */
  cleanBeforeNewGame (): void

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
   * Convert cell index into coords
   */
  getCoordsByIndex(cellIndex:number):Coords

  /**
   * Convert coords to field index
   */
  getCellIndexByCoords(x: number, y:number):number

  /**
   * Super fields array
   */
  // getBonusFields(): Array<number>

  /**
   * Cup state, this is array of fields
   */
  getData (): CupData

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
   * @param x
   * @param y
   */
  getFieldByCoords (x: number, y:number):Field

  /**
   * Clear data in block
   */
  clearBlockByCoords (x:number, y:number):void

  /**
   * Clear data in block
   */
  clearBlockByIndex (cellIndex:number):void

  /**
   * Copy block from one place to another
   * @param sourceX
   * @param sourceY
   * @param targetX
   * @param targetY
   */
  copyBlockByCoords (sourceX:number, sourceY:number, targetX:number, targetY:number):void

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
  addBonusFiled (filedIndex:number, bonusIndex:number): void;

  /**
   * Increase down speed
   */
  increaseSpeed() : void

  /**
   *
   */
  getSpeed(): number

  /**
   *
   */
  setSpeed(newSpeed:number): void

  /*
   *
   */
  // blowRandomField() => void

  /*
   * Add random row below in cup
   * @param countLines Number of lines to add
   */
  // addRandomRowBellow: (countLines:number) => void

  /*
   * Remove rows from bottom of cup
   * @param countLines Number of lines to add
   */
  // removeRowsBellow: (countLines:number) => void
}
