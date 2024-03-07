import {Coords} from "../math/Coords";
import {Cup} from "./Cup";
import {CupData} from "./CupData";
import {GenerateRandomColor} from "../process/GenerateRandomColor";
import {CupState} from "../types/CupState";
import {Field} from "./Field";
import {Bonus} from "../types/Bonus";

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
 */
export class CupImpl implements Cup
{
  /**
   * Cup width in cells
   */
  protected widthInCells;
  
  /**
   * Cup height in cells
   */
  protected heightInCells;

  /**
   * Event listener
   */
  protected listener: CupEventListener|null = null;

  /**
   */
  protected _state:CupData = {
    state: CupState.online,
    fields: [],
  }

  /**
   *
   * @param listener
   * @param widthInCells
   * @param heightInCells
   */
  constructor(listener?:CupEventListener, widthInCells:number = 10, heightInCells:number = 20)
  {
    if (listener) this.listener = listener

    this.widthInCells = widthInCells
    this.heightInCells = heightInCells

    // init field with start value
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
    // this._state.bonuses = []

    // clear field
    this._state.fields = new Array<Field>(this.widthInCells * this.heightInCells) // .fill( {block: -1})

    for (let i = 0; i < this._state.fields.length; i++) {
      this._state.fields[i] = {block: -1}
      // people.push(person);
    }

    // this._state.fields[100].block = 1;


    this._state.fields[95].block = 2;
    this._state.fields[104].block = 1;
    this._state.fields[105].block = 1 ;
    this._state.fields[106].block = 1;
    this._state.fields[113].block = 2;
    this._state.fields[114].block = 1;

    this._state.fields[115].block = 0;
    this._state.fields[115].bonus = Bonus.bomb;

    this._state.fields[116].block = 1;
    this._state.fields[117].block = 2;
    this._state.fields[124].block = 1;
    this._state.fields[125].block = 1;
    this._state.fields[126].block = 1;
    this._state.fields[135].block = 2;
    // this._state.fields[103].block = 0;

    this._state.fields[150].block = 1;
    this._state.fields[150].bonus = Bonus.add;

    this._state.fields[160].block = 1;
    this._state.fields[160].bonus = Bonus.gravity;
    this._state.fields[161].block = 1;
    this._state.fields[162].block = 1;
    this._state.fields[165].block = 1;
    this._state.fields[164].block = 1;
    this._state.fields[166].block = 1;
    this._state.fields[167].block = 1;
    this._state.fields[168].block = 1;
    this._state.fields[169].block = 1;

    this._state.fields[170].block = 1;
    this._state.fields[171].block = 1;
    this._state.fields[172].block = 1;
    this._state.fields[175].block = 1;
    this._state.fields[174].block = 1;
    this._state.fields[176].block = 1;
    this._state.fields[177].block = 1;
    this._state.fields[178].block = 1;
    this._state.fields[179].block = 1;

    // temp cup state
    this._state.fields[180].block = 1;
    this._state.fields[181].block = 1;
    this._state.fields[182].block = 1;
    this._state.fields[182].bonus = Bonus.bomb;
    this._state.fields[184].block = 1;
    this._state.fields[185].block = 1;
    this._state.fields[186].block = 1;
    this._state.fields[187].block = 1;
    this._state.fields[188].block = 1;
    this._state.fields[189].block = 1;

    this._state.fields[190].block = 1;
    this._state.fields[191].block = 1;
    this._state.fields[192].block = 1;
    this._state.fields[195].block = 1;
    this._state.fields[194].block = 1;
    this._state.fields[196].block = 1;
    this._state.fields[197].block = 1;
    this._state.fields[197].bonus = Bonus.bomb;
    this._state.fields[198].block = 1;
    this._state.fields[199].block = 1;
  }
  
  getFields = ():Array<Field> => {
    return this._state.fields;
  }
  
  setFields(fields: Array<Field>): void {
    this._state.fields = fields;
  }

  // getBonusFields():Array<number> {
  //   return this._state.bonuses;
  // }

  /**
   * Get field info
   * @param x
   * @param y
   */
  getFieldByCoords(x: number, y: number):Field {
    return this.getFieldByIndex(this.getCellIndex(x, y));
  }
  /**
   * Get field info
   * @param index
   */
  getFieldByIndex(index:number):Field {
    return this._state.fields[index]
  }

  /**
   * Set field info
   * @param x
   * @param y
   * @param field
   */
  setFieldByCoordinates(x: number, y:number, field:Field):void {
    this.setFieldByIndex(this.getCellIndex(x, y), field);
  }

  /**
   * Set field info
   */
  setFieldByIndex (index:number, field:Field):void{
    this._state.fields[index] = field
  }

  /**
   * Export data for request
   */
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
      if (cellIndex < 0) return false
      return this._state.fields[cellIndex].block > -1
    });
    
    return i === -1;
  }
  
  // getFieldValueByIndex(index: number): number {
  //   return this._state.fields[index].block
  // }
  
  getHeightInCells(): number {
    return this.heightInCells;
  }
  
  getWidthInCells(): number {
    return this.widthInCells;
  }

  /**
   * @param x
   * @param y
   */
  getCellIndexByCoords(x:number, y:number): number {
      return this.getCellIndex(x, y)
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
   * @private
   * @param sourceX
   * @param sourceY
   * @param destX
   * @param destY
   */
  copyBlockByCoords (sourceX:number, sourceY:number, destX:number, destY:number)
  {
    // move block
    if (destX < 0) return;
    if (destX > this.widthInCells - 1) return;
    if (destY < 0) return;
    if (destY > this.heightInCells -1) return;

    const sourceIndex = this.getCellIndexByCoords(sourceX, sourceY)
    const destIndex = this.getCellIndexByCoords(destX, destY)

    this._state.fields[destIndex] = {...this._state.fields[sourceIndex]}
    // this._state.bonuses[destIndex] = this._state.bonuses[sourceIndex]
  }

  public clearBlockByCoords (x: number, y: number) {
    this.clearBlock(this.getCellIndex(x, y))
  }

  /**
   * Clear block
   * @param index
   */
  public clearBlock (index:number) {
    if (this._state.fields[index] !== undefined){
      this.setFieldByIndex(index, {block: -1})
    }
  }

  /**
   *
   * @param fIndex
   * @param bonusIndex
   */
  addBonusFiled(fIndex: number, bonusIndex: number): void {
    this._state.fields[fIndex].bonus = bonusIndex
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
    // const firstBlockIndex = this.getCellIndexByCoords({x: 0, y: this.heightInCells - 1})
    // add line to bottom
    for (let col = 0; col < this.widthInCells; col++) {
        this.setFieldByCoordinates(col, this.heightInCells - 1, {
          block: (col === randomClearField) ? - 1 : GenerateRandomColor(),
          // bonus: undefined
        })
        // const i = firstBlockIndex + col
        // this._state.fields[i].block = GenerateRandomColor()
        // this._state.fields[i].bonus = undefined
    }
  }

  /**
   * Move all lines up
   */
  private moveCupUp ()
  {
    // move cup up
    for (let row = 0; row < this.heightInCells - 1; row++)
    {
      for (let col = 0; col < this.widthInCells; col++)
      {
        this.copyBlockByCoords(col, row + 1, col, row)
        /*const currentBlockIndex = this.getCellIndexByCoords({x: col, y: row})

        // const indexOfBlockAbove = this.getCellIndexByCoords({x: col, y: row + 1})
        const indexOfBlockAbove = currentBlockIndex - this.widthInCells;

        // if there is a block we move them above
        if (this._state.fields[currentBlockIndex].block > -1) {
          this._state.fields[indexOfBlockAbove] = this._state.fields[currentBlockIndex]; // -1 it's mean that fiend if empty that we move them down
          this._state.fields[currentBlockIndex].block = -1;
        }

        // move bonus fields
        if (this._state.fields[currentBlockIndex].bonus !== undefined) {
          this._state.fields[indexOfBlockAbove] = this._state.fields[currentBlockIndex]; // -1 it's mean that fiend if empty that we move them down
          this._state.fields[currentBlockIndex].bonus = undefined;
        }*/

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
      this.setFieldByCoordinates(col, rowIndex, {
        block: -1
      })
      // const blockIndex = this.getCellIndexByCoords({x: col, y: rowIndex})
      // this._state.fields[blockIndex].block = -1;
      //
      // //
      // if (this._state.fields[blockIndex].bonus) {
      //   this._state.fields[blockIndex].bonus = undefined;
      // }
    }
  }

  /**
   * Move all lines up
   */
  private moveCupDown ()
  {
    for (let row = this.heightInCells -1; row > 0; row--) {
      for (let col = 0; col < this.widthInCells; col++) {
        this.copyBlockByCoords(col, row -1, col, row)

        // const currentBlockIndex = this.getCellIndexByCoords({x: col, y: row})
        //
        // // const indexOfBlockAbove = this.getCellIndexByCoords({x: col, y: row + 1})
        // const indexOfBlockAbove = currentBlockIndex - this.widthInCells;
        //
        // // if there is a block we move them above
        // if (this._state.fields[indexOfBlockAbove].block > -1) {
        //   this._state.fields[currentBlockIndex] = this._state.fields[indexOfBlockAbove];
        //   this._state.fields[indexOfBlockAbove].block = -1;
        // }
        //
        // // move bonus fields
        // if (this._state.fields[indexOfBlockAbove]) {
        //   this._state.fields[currentBlockIndex].bonus = this._state.fields[indexOfBlockAbove].bonus;
        //   this._state.fields[indexOfBlockAbove].bonus = -1;
        // }
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
    console.log ('CupImpl.clearAndMoveLines');

    // we find full lines
    const fullLines:Array<number> = [];
    for (let row = 0; row < this.heightInCells; row++)
    {
      const startIndex = row * this.widthInCells;
      const endIndex = startIndex +  this.widthInCells

      let fullLine:boolean = true;
      for (let i = startIndex; i < endIndex; i++)
      {
        if (this._state.fields[i].block === -1) {
          fullLine = false
          break
        }
      }

      // if we have full line
      if (fullLine) fullLines.push(row)
    }

    if (fullLines.length === 0) {
      return;
    }

    console.log ('full lines', fullLines);

    // clear lines and add bonus
    const bonuses:Array<Bonus> = [];
    fullLines.forEach((fullLineIndex:number) => {
      for (let i = 0; i < this.widthInCells; i++) {
        let index = this.getCellIndexByCoords(i, fullLineIndex)

        // if there is bonus
        let b = this._state.fields[index].bonus
        if (b !== undefined) {
          // add to return array
          bonuses.push(b)
        }

        // this._state.fields[index].block = -1
        this.clearBlock(index)
      }
    })

    // move blocks to cleared lines
    // from top to bottom
    fullLines.forEach((fullLineIndex:number) => {
      for (let row = fullLineIndex; row > 0; row--) {
        for (let col = 0; col < this.widthInCells; col++) {
          // copy block above
          this.copyBlockByCoords(col, row - 1, col, row)

          // clear block above
          // this.clearBlockByCoords({x: col, y: row - 1})
        }
      }
    })

    // rise callback about clear lines
    if (fullLines.length > 0 && this.listener && callCallback) {
      this.listener.onLineCleared({countLines: fullLines.length, bonuses: bonuses})
    }

    // return clearData;
  }

  clearBlockByIndex(cellIndex: number): void {
    this._state.fields[cellIndex].block = -1
    this._state.fields[cellIndex].bonus = undefined
  }

}
