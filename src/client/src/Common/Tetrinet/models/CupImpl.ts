import {Coords} from "../math/Coords";
import {Cup} from "./Cup";
import {CupData} from "./CupData";
import {GenerateRandomColor} from "../../../process/GenerateRandomColor";
import {CupState} from "../types/CupState";

/**
 *
 */
export type CupEventListener =
{
  /**
   * When lines cleared
   * @param countLines
   */
  onLineCleared: (clearData:{countLines:number, bonuses: Array<number>}) => void,

  /**
   * When figure moved to cup
   */
  onFigureMovedToCup: () => void,
}


/**
 * todo: split to cup and cup with super blocks
 */
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
   * Event listener
   */
  protected listener: CupEventListener|null = null;

  /**
   */
  protected _state:CupData = {
    state: CupState.online,
    fields: [],
    bonuses: [],
    // bonusFields
  }
  
  constructor(listener:CupEventListener|null)
  {
    if (listener) this.listener = listener

    // init field with start value
    // console.log ('CapClass.constructor');
    this.cleanBeforeNewGame();
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
  cleanBeforeNewGame ()
  {
    // clear bonuses
    this._state.bonuses = []

    // clear field
    this._state.fields = new Array<number>(this.widthInCells * this.heightInCells).fill(-1)

    // this is from top
    // temp cup state

    this._state.fields[100] = 1;
    this._state.fields[102] = 1;
    this._state.fields[103] = 0;

    this._state.fields[150] = 1;
    this._state.bonuses[150] = 0;

    this._state.fields[160] = 1;
    this._state.fields[161] = 1;
    this._state.fields[162] = 1;
    this._state.fields[165] = 1;
    this._state.fields[164] = 1;
    this._state.fields[166] = 1;
    this._state.fields[167] = 1;
    this._state.fields[168] = 1;
    this._state.fields[169] = 1;

    this._state.fields[170] = 1;
    this._state.fields[171] = 1;
    this._state.fields[172] = 1;
    this._state.fields[175] = 1;
    this._state.fields[174] = 1;
    this._state.fields[176] = 1;
    this._state.fields[177] = 1;
    this._state.fields[178] = 1;
    this._state.fields[179] = 1;

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

  getBonusFields():Array<number> {
    return this._state.bonuses;
  }

  /**
   * Get field info
   * todo: refactor this method when we goes to objects
   * todo: move this method to interface
   * @param x
   * @param y
   */
  getFieldByCoords(x: number, y:number):{field:number, bonus:number} {
    return this.getFieldByIndex(this.getCellIndex(x, y));
  }
  /**
   * Get field info
   * todo: refactor this method when we goes to objects
   * todo: move this method to interface
   * @param index
   */
  getFieldByIndex(index:number):{field:number, bonus:number} {
    return {
      field: this._state.fields[index],
      bonus: this._state.bonuses[index]
    }
  }

  /**
   * Set field info
   * todo: refactor this method when we goes to objects
   * todo: move this method to interface
   * @param x
   * @param y
   * @param field
   */
  setFieldByCoordinates(x: number, y:number, field:{field:number, bonus:number}):void {
    this.setFieldByIndex(this.getCellIndex(x, y), field);
  }

  /**
   * Set field info
   * todo: refactor this method when we goes to objects
   * todo: move this method to interface
   */
  setFieldByIndex (index:number, field:{field:number, bonus:number}):void{
    this._state.fields[index] = field.field
    this._state.bonuses[index] = field.bonus
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
   * @param c
   */
  getCellIndexByCoords(c: Coords): number {
      // return c.y * this.widthInCells + c.x
      return this.getCellIndex(c.x, c.y)
  }

  /**
   * Cell index
   */
  getCellIndex(x: number, y:number): number {
      return y * this.widthInCells + x
  }
  
  getCoordsByIndex(cellIndex: number): Coords {
    return {
      x:  cellIndex % this.widthInCells,
      y:  Math.floor(cellIndex / this.widthInCells)
    }
  }

  /**
   * Move block if it possible
   * @param sourcePosition
   * @param destPosition
   * @private
   */
  copyBlockByCoords (sourcePosition:Coords, destPosition:Coords)
  {
    // move block
    if (destPosition.x < 0) return;
    if (destPosition.x > this.widthInCells - 1) return;
    if (destPosition.y < 0) return;
    if (destPosition.y > this.heightInCells -1) return;

    const sourceIndex = this.getCellIndexByCoords(sourcePosition)
    const destIndex = this.getCellIndexByCoords(destPosition)

    // todo: remake in on object
    this._state.fields[destIndex] = this._state.fields[sourceIndex]
    this._state.bonuses[destIndex] = this._state.bonuses[sourceIndex]
  }

  public clearBlockByCoords (position:Coords) {
    this.clearBlock(this.getCellIndex(position.x, position.y))
  }

  /**
   * Clear block
   * @param index
   */
  public clearBlock (index:number) {
    this._state.fields[index] = -1;
    this._state.bonuses[index] = -1;
  }

  /**
   *
   * @param fIndex
   * @param bonusIndex
   */
  addBonusFiled(fIndex: number, bonusIndex: number): void {
    this._state.bonuses[fIndex] = bonusIndex
  }

  /**
   *
   * @deprecated todo: move to play screen
   * This method add row bellow
   * @param countLines Number of lines to add
   */
  addRandomRowBellow(countLines:number): void
  {
    for (let i = 0; i < countLines; i++) {
      this.addOneRandomLineBellow ()
    }
  }

  /**
   * @deprecated todo: move to play screen
   * Add one random line
   * @private
   */
  private addOneRandomLineBellow ()
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

        // move bonus fields
        if (this._state.bonuses[currentBlockIndex] > -1) {
          this._state.bonuses[indexOfBlockAbove] = this._state.bonuses[currentBlockIndex]; // -1 it's mean that fiend if empty that we move them down
          this._state.bonuses[currentBlockIndex] = -1;
        }
      }
    }
  }

  /**
   * Remove rows bellow cup
   */
  removeRowsBellow(countLines:number):void
  {
    for (let i = 0; i < countLines; i++) {
      this.removeOneRowBelow ()
    }
  }

  /**
   *
   */
  private removeOneRowBelow()
  {
    // clear line
    this.clearBottomLine();

    // move cup down
    this.moveCupDown();
  }

  private clearBottomLine()
  {
    const rowIndex = this.heightInCells - 1;
    for (let col = 0; col < this.widthInCells; col++)
    {
      const blockIndex = this.getCellIndexByCoords({x: col, y: rowIndex})
      this._state.fields[blockIndex] = -1;

      //
      if (this._state.bonuses[blockIndex] !== -1) {
        this._state.bonuses[blockIndex] = -1;
      }
    }
  }

  /**
   * Move all lines up
   */
  private moveCupDown ()
  {
    // move cup up
    for (let row = this.heightInCells -1; row >= 0; row--)
    {
      for (let col = 0; col < this.widthInCells; col++)
      {
        const currentBlockIndex = this.getCellIndexByCoords({x: col, y: row})

        // const indexOfBlockAbove = this.getCellIndexByCoords({x: col, y: row + 1})
        const indexOfBlockAbove = currentBlockIndex - this.widthInCells;

        // if there is a block we move them above
        if (this._state.fields[indexOfBlockAbove] > -1) {
          this._state.fields[currentBlockIndex] = this._state.fields[indexOfBlockAbove];
          this._state.fields[indexOfBlockAbove] = -1;
        }

        // move bonus fields
        if (this._state.bonuses[indexOfBlockAbove] > -1) {
          this._state.bonuses[currentBlockIndex] = this._state.bonuses[indexOfBlockAbove];
          this._state.bonuses[indexOfBlockAbove] = -1;
        }
      }
    }
  }

  /**
   * Clear lines after figure moved to cup
   * and move down cup on clear place
   * returns number of cleared lines
   */
  // public clearAndMoveLines(callCallback:boolean = true):{countLines: number, bonuses: number[]}
  public clearAndMoveLines(callCallback:boolean = true):void
  {
    // we find full lines
    const fullLines:Array<number> = [];
    for (let row = 0; row < this.heightInCells; row++)
    {
      const startIndex = row * this.widthInCells;
      const endIndex = startIndex +  this.widthInCells

      let fullLine:boolean = true;
      for (let i = startIndex; i < endIndex; i++)
      {
        if (this._state.fields[i] === -1) {
          fullLine = false
          break
        }
      }

      // if we have full line
      if (fullLine) fullLines.push(row)
    }

    if (fullLines.length === 0) {
      // return {countLines: 0, bonuses: []};
      return;
    }

    // clear lines
    const bonuses:number[] = [];
    fullLines.forEach((fullLineIndex:number) => {
      for (let i = 0; i < this.widthInCells; i++) {
        let index = this.getCellIndexByCoords({x: i, y: fullLineIndex})
        this._state.fields[index] = -1

        // if there is bonus
        if (this._state.bonuses[index] > -1)
        {
          // add to return array
          bonuses.push(this._state.bonuses[index])

          // clear bonus field
          this._state.bonuses[index] = -1
        }

      }
    })

    // move blocks to cleared lines
    // from top to bottom
    // fullLines.reverse().forEach((fullLineIndex:number) =>
    fullLines.forEach((fullLineIndex:number) =>
    {
      for (let row = fullLineIndex; row > 0; row--)
        // for (let row = fullLineIndex; row < this.heightInCells; row++)
      {
        for (let col = 0; col < this.widthInCells; col++)
        {
          //
          const currentBlockIndex = this.getCellIndexByCoords({x: col, y: row})

          // const indexOfBlockAbove = this.getCellIndexByCoords({x: col, y: row + 1})
          const indexOfBlockAbove = currentBlockIndex - this.widthInCells;

          // if there is a block we move them
          if (this._state.fields[indexOfBlockAbove] > -1){
            this._state.fields[currentBlockIndex] = this._state.fields[indexOfBlockAbove];
            this._state.fields[indexOfBlockAbove] = -1; // -1 it's mean that fiend if empty that we move them down
          }

          // if there is a bonus
          if (this._state.bonuses[indexOfBlockAbove] > -1) {
            this._state.bonuses[currentBlockIndex] = this._state.bonuses[indexOfBlockAbove];
            this._state.bonuses[indexOfBlockAbove] = -1;
          }
        }
      }
    })

    // const clearData = {countLines: fullLines.length, bonuses: bonuses}

    // rise callback about clear lines
    if (fullLines.length > 0 && this.listener && callCallback) {
      this.listener.onLineCleared({countLines: fullLines.length, bonuses: bonuses})
    }

    // return clearData;
  }

}
