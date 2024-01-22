import {Coords} from "../math/Coords";
import {Cup} from "./Cup";


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
   * Array of field where if it is true then there block
   * @private
   */
  protected fields:Array<number> = [];
  
  constructor()
  {
    // console.log ('CapClass.constructor');
    
    // make fields array
    this.fields = new Array<number>(this.widthInCells * this.heightInCells).fill(-1)
    
    // temp cup state
    this.fields[0] = 1;
    this.fields[1] = 1;
    this.fields[2] = 1;
    this.fields[5] = 1;
    this.fields[4] = 1;
    this.fields[6] = 1;
    this.fields[7] = 1;
    this.fields[8] = 1;
    this.fields[9] = 1;
    
    this.fields[10] = 1;
    this.fields[11] = 1;
    this.fields[12] = 1;
    this.fields[15] = 1;
    this.fields[14] = 1;
    this.fields[16] = 1;
    this.fields[17] = 1;
    this.fields[18] = 1;
    this.fields[19] = 1;
    // this.fields[12] = true;
    // this.fields[22] = true;
  }
  
  getFields = ():Array<number> => {
    return this.fields;
  }
  
  /**
   * Check intersect between array of indexes wits blocks in the cup
   * @param newFields
   */
  canPlace (newFields:Array<number>): boolean
  {
    const i:number = newFields.findIndex((cellIndex:number) => {
      return this.fields[cellIndex] > -1
    });
    
    return i === -1;
  }
  
  getFieldValueByIndex(index: number): number {
    return this.fields[index]
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
    this.fields[fIndex] = bonusIndex
  }
  
  
}
