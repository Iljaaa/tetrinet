import {Figure} from "./Figure";
import {CupWithFigure} from "./CupWithFigure";

import {CupEventListener, CupImpl} from "./CupImpl";
import {Coords} from "../math/Coords";
import {GenerateNewFigure} from "../process/GenerateNewFigure";
import {GenerateRandomColor} from "../process/GenerateRandomColor";
import {CupState} from "../types/CupState";


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

export class CupWithFigureImpl extends CupImpl implements CupWithFigure
{
  /**
   * @private
   */
  private _nextFigure: Figure | undefined;

  /**
   * Current figure
   * @private
   */
  private _figure:Figure|null = null

  /**
   * Coords to drop new figure
   * @private
   */
  private readonly dropPoint: Coords;

  /**
   * Timer when figure goes down
   * @private
   */
  private downTimer:number = 0
  
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

    this._nextFigure = GenerateNewFigure(this, GenerateRandomColor())
  }
  
  setFigureToDropPoint(f:Figure) {
    f.setPosition(this.dropPoint.x, this.dropPoint.y)
    this._figure = f;
  }
  
  getFigure(): Figure|null {
    return this._figure;
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
    console.log('CupWithFigureImpl.transferFigureToCupWithTail')
    if (!this._figure) return;
    
    // move figure to the cup
    const figureFields = this._figure.getFields()
    console.log('figureFields', figureFields)
    figureFields.forEach((f:number) =>
    {
      const b = this._state.fields[f]
      console.log('fb', f, b)
      if (!b){
        alert ('block not found, it means something go wrong');
        debugger
        return
      }
      b.block = this._figure ? this._figure.getColor() : 0
    })

    // clean figure
    this._figure = null
    
    // clear full lines
    this.clearAndMoveLines();

    // if we can place next figure to the cup the game continues
    if (this._nextFigure && this.canPlace(this._nextFigure.getFields()))
    {
      // move next figure to drop point
      this.setFigureToDropPoint(this._nextFigure);

      // generate next figure
      this._nextFigure = GenerateNewFigure(this, GenerateRandomColor());
      this._nextFigure.setPosition(this.dropPoint.x, this.dropPoint.y)

      // rise callback event
      if (this.listener) this.listener.onFigureMovedToCup()

      return;
    }

    // set cup state to game over
    this.setState(CupState.over);

    // rise callback event
    if (this.listener) this.listener.onFigureMovedToCup()
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
   * Timer for down figure
   */
  updateFigureDownTimer(deltaTime:number): void
  {
    // nothing to update if cup is ofline
    if (this._state.state !== CupState.online) return;

    // tick figure down timer
    this.downTimer += deltaTime

    if (this.downTimer > 1000) {
      this.moveFigureDown();
      this.downTimer = 0;
    }

  }

  generateNextFigure(): void {
    this._nextFigure = GenerateNewFigure(this, GenerateRandomColor())
  }

  getNextFigure(): Figure|undefined {
    return this._nextFigure;
  }


}
