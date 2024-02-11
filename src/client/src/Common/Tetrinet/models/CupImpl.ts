import {Coords} from "../math/Coords";
import {Cup} from "./Cup";
import {CupState} from "./CupState";


export class CupImpl implements Cup
{
  /**
   * Cup width in cells
   * todo: move it to constructor
   * @private
   */
  protected widthInCells = 10;
  
  /**
   * Cup height in cells
   * todo: move it to constructor
   * @private
   */
  protected heightInCells = 20;

  
  /**
   */
  protected _state:CupState = {
    fields: [],
    // bonusFields
  }
  
  constructor()
  {
    // init field with start value
    // console.log ('CapClass.constructor');
    this.cleanFields();
  }

  /**
   * Clean up field
   */
  cleanFields ()
  {
    this._state.fields = new Array<number>(this.widthInCells * this.heightInCells).fill(-1)

    // this is from top
    // temp cup state
    this._state.fields[180] = 1;
    this._state.fields[181] = 1;
    this._state.fields[182] = 1;
    this._state.fields[185] = 1;
    this._state.fields[184] = 1;
    this._state.fields[186] = 1;
    this._state.fields[187] = 1;
    this._state.fields[188] = 1;
    this._state.fields[189] = 1;

    this._state.fields[190] = 1;
    this._state.fields[191] = 1;
    this._state.fields[192] = 1;
    this._state.fields[195] = 1;
    this._state.fields[194] = 1;
    this._state.fields[196] = 1;
    this._state.fields[197] = 1;
    this._state.fields[198] = 1;
    this._state.fields[199] = 1;
  }
  
  getFields = ():Array<number> => {
    return this._state.fields;
  }
  
  setFields(fields: Array<number>): void {
    this._state.fields = fields;
  }
  
  getState = ():CupState => {
    return this._state;
  }
  
  /**
   * Check intersect between array of indexes wits blocks in the cup
   * @param newFields
   */
  canPlace (newFields:Array<number>): boolean
  {
    const i:number = newFields.findIndex((cellIndex:number) => {
      return this._state.fields[cellIndex] > -1
    });
    
    return i === -1;
  }
  
  getFieldValueByIndex(index: number): number {
    return this._state.fields[index]
  }
  
  getHeightInCells(): number {
    return this.heightInCells;
  }
  
  getWidthInCells(): number {
    return this.widthInCells;
  }
  
  getCellIndexByCoords(c: Coords): number {
      return c.y * this.widthInCells + c.x
  }
  
  getCoordsByIndex(cellIndex: number): Coords {
    return {
      x:  cellIndex % this.widthInCells,
      y:  Math.floor(cellIndex / this.widthInCells)
    }
  }
  
  /**
   *
   * @param fIndex
   * @param bonusIndex
   */
  addBonusFiled(fIndex: number, bonusIndex: number): void {
    this._state.fields[fIndex] = bonusIndex
  }
  
  
}
