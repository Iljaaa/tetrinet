import {Coords} from "../math/Coords";
import {Cup} from "./Cup";
import {CupData} from "./CupData";
import {GenerateRandomColor} from "../../../process/GenerateRandomColor";
import {CupState} from "../types/CupState";


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
  protected _state:CupData = {
    state: CupState.online,
    fields: [],
    bonuses: [],
    // bonusFields
  }
  
  constructor()
  {
    // init field with start value
    // console.log ('CapClass.constructor');
    this.cleanFields();
  }

  getState(): CupState {
    return this._state.state;
  }

  setState(state:CupState): void {
    this._state.state = state;
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
  
  getData = ():CupData => {
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

  /**
   * todo: refactor coords object to x and y
   * @param c
   */
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

  /**
   * This method add row bellow
   * @param countLines Number of lines to add
   */
  addRandomRowBellow(countLines:number): void
  {
    for (let i = 0; i < countLines; i++) {
      this.addOneLine ()
    }
  }

  /**
   * Add one line
   * @private
   */
  private addOneLine ()
  {
    //
    this.moveCupUp();

    // add row
    const randomClearField = Math.floor(Math.random() * this.widthInCells);
    const firstBlockIndex = this.getCellIndexByCoords({x: 0, y: this.heightInCells - 1})
    // add line to bottom
    for (let col = 0; col < this.widthInCells; col++) {
      if (col !== randomClearField) {
        const i = firstBlockIndex + col
        this._state.fields[i] = GenerateRandomColor()
      }
    }
  }

  /**
   * Move all lines up
   */
  private moveCupUp ()
  {
    // move cup up
    for (let row = 0; row < this.heightInCells; row++)
    {
      // row start and end for this indexes
      // const startIndex = row * this.widthInCells;
      // const endIndex = startIndex +  this.widthInCells
      for (let col = 0; col < this.widthInCells; col++)
      {
        const currentBlockIndex = this.getCellIndexByCoords({x: col, y: row})

        // const indexOfBlockAbove = this.getCellIndexByCoords({x: col, y: row + 1})
        const indexOfBlockAbove = currentBlockIndex - this.widthInCells;

        // if there is a block we move them above
        if (this._state.fields[currentBlockIndex] > -1) {
          this._state.fields[indexOfBlockAbove] = this._state.fields[currentBlockIndex]; // -1 it's mean that fiend if empty that we move them down
          this._state.fields[currentBlockIndex] = -1;
        }
      }
    }
  }
  
  
}
