import {Figure} from "./Figure";
import {CapWithFigure} from "./CupWithFigure";

import {CupEventListener, CupImpl} from "./CupImpl";
import {Coords} from "../math/Coords";



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
   * Coords to drop new figure
   * @private
   */
  private readonly dropPoint: Coords;
  
  constructor(listener?:CupEventListener)
  {
    super(listener);
    
    // calculate drop point
    // todo: set move position on z = 1
    this.dropPoint = new Coords(
      Math.floor(this.widthInCells / 2) - 1,
      // this.heightInCells - 1
        1
    )
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
      this._state.fields[f].block = this._figureColor;
      
      // move color
      // this.colors[f] = this._figureColor;
    })
    
    // clear full lines
    // const clearData = this.clearAndMoveLines();
    this.clearAndMoveLines();

    // rise callback about clear lines
    // if (clearData.countLines > 0) this.listener.onLineCleared(clearData)

    // rise callback event
    if (this.listener) this.listener.onFigureMovedToCup()
    
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
  


}
