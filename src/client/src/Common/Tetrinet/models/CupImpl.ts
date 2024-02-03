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
   * @deprecated
   * todo: refactor to this,_state
   * Array of field where if it is true then there block
   * @private
   */
  // protected fields:Array<number> = [];
  
  /**
   */
  protected _state:CupState = {
    fields: [],
    // bonusFields
  }
  
  constructor()
  {
    // console.log ('CapClass.constructor');
    
    // make fields array
    this._state.fields = new Array<number>(this.widthInCells * this.heightInCells).fill(-1)
    
    // temp cup state
    this._state.fields[0] = 1;
    this._state.fields[1] = 1;
    this._state.fields[2] = 1;
    this._state.fields[5] = 1;
    this._state.fields[4] = 1;
    this._state.fields[6] = 1;
    this._state.fields[7] = 1;
    this._state.fields[8] = 1;
    this._state.fields[9] = 1;
    
    this._state.fields[10] = 1;
    this._state.fields[11] = 1;
    this._state.fields[12] = 1;
    this._state.fields[15] = 1;
    this._state.fields[14] = 1;
    this._state.fields[16] = 1;
    this._state.fields[17] = 1;
    this._state.fields[18] = 1;
    this._state.fields[19] = 1;
    // this.fields[12] = true;
    // this.fields[22] = true;
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
