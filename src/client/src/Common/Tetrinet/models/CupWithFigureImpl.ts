import {Figure} from "./Figure";
import {CapWithFigure} from "./CupWithFigure";

import {CupImpl} from "./CupImpl";
import {Coords} from "../math/Coords";

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

// export class FigureClass implements Figure
// {
//   private _fields:Array<number> = [];
//
//   constructor(fields:Array<number>) {
//     this._fields = fields;
//   }
//
//   setFields(fields:Array<number>): void {
//     this._fields = fields;
//   }
//
//   getFields(): Array<number> {
//     return this._fields
//   }
//
//   rotateClockwise(): boolean {
//     return false
//   }
//
//   rotateCounterClockwise(): boolean {
//     return false;
//   }
//
// }

export class CupWithFigureImpl extends CupImpl implements CapWithFigure
{
  /**
   * Current figure
   * @private
   */
  private _figure:Figure|null = null
  
  /**
   * Color of figure
   * @private
   */
  private _figureColor:number = 0
  
  /**
   * Event listener
   * @private
   */
  private listener: CupEventListener;
  
  /**
   * Coords to drop new figure
   * @private
   */
  private readonly dropPoint: Coords;
  
  constructor(listener:CupEventListener)
  {
    super();
    
    this.listener = listener;
    
    // calculate drop point
    // todo: set move position on z = 1
    this.dropPoint = new Coords(
      Math.floor(this.widthInCells / 2) - 1,
      // this.heightInCells - 1
        1
    )
  }
  
  /**
   * Start new game
   * it called in on did mount block
   */
  start():void
  {
    // generate new figure
    // this.generateAndPutNewFigure();
  }
  
  setFigure(f:Figure, color:number) {
    this._figure = f;
    this._figureColor = color
  }
  
  getFigure(): Figure|null {
    return this._figure;
  }
  
  getFigureColor(): number {
    return this._figureColor
  }
  
  getDropPoint(): Coords {
    return this.dropPoint;
  }
  
  moveFigureLeft(): boolean {
    if (!this._figure) return false;
    return this._figure.moveLeft();
  }
  
  moveFigureRight(): boolean {
    if (!this._figure) return false;
    return this._figure.moveRight();
  }
  
  /**
   * First we try to move figure down
   * and if it fails we add figure to cup
   */
  moveFigureDown():boolean
  {
    if (!this._figure) return false;
    
    // move figure
    // const moveResult = this.tryToMoveFigureDown(this._figure)
    const moveResult:boolean = this._figure.moveDown();
    
    // if move down is failed we should check may be it is the end of the game
    // or palace a new figure
    if (!moveResult)
    {
      // manage when figure down
      this.transferFigureToCupWithTail();
      
      //
      return true;
    }
    
    return true;
  }
  
  /**
   * It almost like move down but with to the end
   */
  dropFigureDown ():boolean
  {
    if (!this._figure) return false;
    
    let hasMoved = false;
    while (this._figure.moveDown()) {
      hasMoved = true;
    }
    
    //
    if (!hasMoved) {
      // if not move figere in to cup
      this.transferFigureToCupWithTail();
    }
    
    return hasMoved;
  }
  
  /**
   * First move figure to cup fields array
   * second check and clear full lines
   * third ww rise callback in listener about figure moving
   * third generates new figure and try to insert it into cup
   * and if it fails it means game over
   * @private
   */
  private transferFigureToCupWithTail ():void
  {
    if (!this._figure) return;
    
    // move figure to the cup
    this._figure.getFields().forEach((f:number) => {
      // move figure
      this._state.fields[f] = this._figureColor;
      
      // move color
      // this.colors[f] = this._figureColor;
    })
    
    // clear full lines
    const clearData = this.clearAndMoveLines();
    
    // rise callback about clear lines
    if (clearData.countLines > 0) this.listener.onLineCleared(clearData)
    
    // rise callback event
    this.listener.onFigureMovedToCup()
    
    // if a new figure not putted it means....
    // if (!this.generateAndPutNewFigure()) {
    //   this.listener.onGameOver()
    // }
  }
  
  rotateClockwise():boolean {
    if (!this._figure) return false;
    return this._figure.rotateClockwise();
  }
  
  rotateCounterClockwise():boolean {
    if (!this._figure) return false;
    return this._figure.rotateCounterClockwise();
  }
  
  /**
   * Clear lines after figure moved to cup
   * and move down cup on clear place
   * returns number of cleared lines
   */
  private clearAndMoveLines():{countLines: number, bonuses: number[]}
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
      return {countLines: 0, bonuses: []};
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
    
    return {countLines: fullLines.length, bonuses: bonuses};
  }

}
