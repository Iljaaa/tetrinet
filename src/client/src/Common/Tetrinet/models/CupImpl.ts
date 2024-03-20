import {Coords} from "../math/Coords";
import {Cup} from "./Cup";
import {CupData} from "./CupData";
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

  /**
   * When figure drop to cup
   */
  onFigureDrop: () => void
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

  /*
   * todo: split on two fields
   */
  // protected _state:CupData = {
  //   state: CupState.online,
  //   fields: [],
  // }

  /**
   * Cup state
   */
  protected state:CupState = CupState.online;

  /**
   * Cup fields
   */
  protected fields:Array<Field> = [];

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
    // return this._state.state;
    return this.state
  }

  setState(state:CupState): void {
    this.state = state;
  }

  /**
   *
   */
  setCupOver(){
    this.state = CupState.over;
  }

  /**
   * Clean up field
   */
  cleanBeforeNewGame ()
  {
    // clear bonuses
    this.state = CupState.online;

    // clear field
    this.fields = new Array<Field>(this.widthInCells * this.heightInCells) // .fill( {block: -1})

    for (let i = 0; i < this.fields.length; i++) {
     this.fields[i] = {block: -1}
      // people.push(person);
    }
   //
   // this.fields[95].block = 2;
   // this.fields[104].block = 1;
   // this.fields[105].block = 1 ;
   // this.fields[106].block = 1;
   // this.fields[113].block = 2;
   // this.fields[114].block = 1;
   //
   // this.fields[115].block = 0;
   // this.fields[115].bonus = Bonus.bomb;
   //
   // this.fields[116].block = 1;
   // this.fields[117].block = 2;
   // this.fields[124].block = 1;
   // this.fields[125].block = 1;
   // this.fields[126].block = 1;
   // this.fields[135].block = 2;

   // this.fields[150].block = 1;
   // this.fields[150].bonus = Bonus.add;
   //
   // this.fields[160].block = 1;
   // this.fields[160].bonus = Bonus.gravity;
   // this.fields[161].block = 1;
   // this.fields[162].block = 1;
   // this.fields[165].block = 1;
   // this.fields[164].block = 1;
   // this.fields[166].block = 1;
   // this.fields[167].block = 1;
   // this.fields[168].block = 1;
   // this.fields[169].block = 1;
   //
   // this.fields[170].block = 1;
   // this.fields[171].block = 1;
   // this.fields[172].block = 1;
   // this.fields[175].block = 1;
   // this.fields[174].block = 1;
   // this.fields[176].block = 1;
   // this.fields[177].block = 1;
   // this.fields[178].block = 1;
   // this.fields[179].block = 1;
   //
   //  // temp cup state
   // this.fields[180].block = 1;
   // this.fields[181].block = 1;
   // this.fields[182].block = 1;
   // this.fields[182].bonus = Bonus.bomb;
   // this.fields[184].block = 1;
   // this.fields[185].block = 1;
   // this.fields[186].block = 1;
   // this.fields[187].block = 1;
   // this.fields[188].block = 1;
   // this.fields[189].block = 1;
   //
   // this.fields[190].block = 1;
   // this.fields[191].block = 1;
   // this.fields[192].block = 1;
   // this.fields[195].block = 1;
   // this.fields[194].block = 1;
   // this.fields[196].block = 1;
   // this.fields[197].block = 1;
   // this.fields[197].bonus = Bonus.bomb;
   // this.fields[198].block = 1;
   // this.fields[199].block = 1;
  }
  
  getFields = ():Array<Field> => {
    return this.fields;
  }
  
  setFields(fields: Array<Field>): void {
   this.fields = fields;
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
    return this.fields[index]
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
   this.fields[index] = field
  }

  /**
   * Export data for request
   */
  getData = ():CupData => {
    return {
      state: this.state,
      fields: this.fields,
    }
  }
  
  /**
   * Check intersect between array of indexes wits blocks in the cup
   * @param newFields
   */
  canPlace (newFields:Array<number>): boolean
  {
    const i:number = newFields.findIndex((cellIndex:number) => {
      if (cellIndex < 0) return false
      return this.fields[cellIndex].block > -1
    });
    
    return i === -1;
  }
  
  // getFieldValueByIndex(index: number): number {
  //   return this.fields[index].block
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

   this.fields[destIndex] = {...this.fields[sourceIndex]}
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
    if (this.fields[index] !== undefined){
      this.setFieldByIndex(index, {block: -1})
    }
  }

  /**
   *
   * @param fIndex
   * @param bonusIndex
   */
  addBonusFiled(fIndex: number, bonusIndex: number): void {
   this.fields[fIndex].bonus = bonusIndex
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
        if (this.fields[i].block === -1) {
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

    // clear lines and add bonus
    const bonuses:Array<Bonus> = [];
    fullLines.forEach((fullLineIndex:number) => {
      for (let i = 0; i < this.widthInCells; i++) {
        let index = this.getCellIndexByCoords(i, fullLineIndex)

        // if there is bonus
        let b =this.fields[index].bonus
        if (b !== undefined) {
          // add to return array
          bonuses.push(b)
        }

        //this.fields[index].block = -1
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
   this.fields[cellIndex].block = -1
   this.fields[cellIndex].bonus = undefined
  }

}
