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
  protected fields:Array<boolean> = [];
  
  /**
   * Array of color
   * @protected
   */
  public colors:Array<number> = [];
  
  constructor()
  {
    // console.log ('CapClass.constructor');
    
    // make fields array
    this.fields = new Array<boolean>(this.widthInCells * this.heightInCells).fill(false)
    
    // temp cup state
    this.fields[0] = true;
    this.fields[1] = true;
    this.fields[2] = true;
    this.fields[5] = true;
    this.fields[4] = true;
    this.fields[6] = true;
    this.fields[7] = true;
    this.fields[8] = true;
    this.fields[9] = true;
    
    this.fields[10] = true;
    this.fields[11] = true;
    this.fields[12] = true;
    this.fields[15] = true;
    this.fields[14] = true;
    this.fields[16] = true;
    this.fields[17] = true;
    this.fields[18] = true;
    this.fields[19] = true;
    // this.fields[12] = true;
    // this.fields[22] = true;
  }
  
  getFields = ():Array<boolean> => {
    return this.fields;
  }
  
  /**
   * Check intersect between array of indexes wits blocks in the cup
   * @param newFields
   */
  canPlace (newFields:Array<number>): boolean
  {
    const i:number = newFields.findIndex((cellIndex:number) => {
      return this.fields[cellIndex]
    });
    
    return i === -1;
  }
  
  getFieldValueByIndex(index: number): boolean {
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
  
  
}
