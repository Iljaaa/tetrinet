import {Figure} from "./models/Figure";
import {CapWithFigure} from "./models/CupWithFigure";

import {CapImpl} from "./CapImpl";
import {Coords} from "./math/Coords";
import {BackHorse} from "./figures/BackHorse";
import {ForwardHorse} from "./figures/ForwardHorse";
import {ForwardFlash} from "./figures/ForwardFlash";
import {BackFlash} from "./figures/BackFlash";
import {Line} from "./figures/Line";
import {Square} from "./figures/Square";

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

export class CupWithFigureImpl extends CapImpl implements CapWithFigure
{
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
  
  constructor()
  {
    super();
    
    // calculate drop point
    this.dropPoint = new Coords(
      Math.floor(this.widthInCells / 2) - 1,
      this.heightInCells - 1
    )
  }
  
  /**
   * Start new game
   * it called in on did mount block
   */
  start():void
  {
    // generate new figure
    this.addNewFigure();
  }
  
  setFigure(f:Figure) {
    // this._figure = new FigureClass(figure);
    this._figure = f;
  }
  
  getFigure(): Figure|null {
    return this._figure;
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
    const moveResult = this._figure.moveDown();
    
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
   * Create random figure and add
   * @private
   */
  private addNewFigure(): boolean
  {
    // generate new figure
    console.log(this.getDropPoint(), 'drop point');
    
    const nextFigureIndex:number = Math.floor(Math.random() * 6);
    
    let f:Figure;
    switch (nextFigureIndex) {
      case 0: f = new ForwardHorse(this, this.getDropPoint()); break;
      case 1: f = new BackHorse(this, this.getDropPoint()); break;
      case 2: f = new Line(this, this.getDropPoint()); break;
      case 3: f = new ForwardFlash(this, this.getDropPoint()); break;
      case 4: f = new BackFlash(this, this.getDropPoint()); break;
      default: f = new Square(this, this.getDropPoint()); break;
    }
    
    // if (!f) return false;
    
    //
    const newFigureFields:Array<number> = f.getFields()
    
    // check intersections with cup
    if (!this.canPlace(newFigureFields)) {
      return false;
    }
    
    
    // set new figure
    this.setFigure(f)
    return true;
  }
  
  /**
   * First move figure to cup fields array
   * second check and clear full lines
   * third generates new figure and try to insert it into cup
   * and if it fails it means game over
   * @private
   */
  private transferFigureToCupWithTail ():void
  {
    if (!this._figure) return;
    
    // move figure to the cup
    this._figure.getFields().forEach((f:number) => {
      this.fields[f] = true;
    })
    
    // check full lines and clear it
    // todo: move this method into cup
    // we find full lines
    const fullLines:Array<number> = [];
    for (let row = 0; row < this.heightInCells; row++)
    {
      const startIndex = row * this.widthInCells;
      const endIndex = startIndex +  this.widthInCells
      
      let fullLine:boolean = true;
      for (let i = startIndex; i < endIndex; i++)
      {
        if (!this.fields[i]) {
          fullLine = false
          break
        }
      }
      
      // if we have full line
      if (fullLine) fullLines.push(row)
    }
    
    console.log(fullLines, 'fullLines')
    
    // clear full lines
    if (fullLines.length > 0)
    {
      // clear lines
      fullLines.forEach((fullLineIndex:number) => {
        for (let i = 0; i < this.widthInCells; i++) {
          let index = this.getCellIndexByCoords({x: i, y: fullLineIndex})
          this.fields[index] = false
        }
      })
      
      // move blocls from top
      fullLines.reverse().forEach((fullLineIndex:number) =>
      {
        
        for (let row = fullLineIndex; row < this.heightInCells; row++)
        {
          for (let col = 0; col < this.widthInCells; col++)
          {
            let indexOfBlockAbove = this.getCellIndexByCoords({x: col, y: row + 1})
            
            // if field is filled
            if (this.fields[indexOfBlockAbove]){
              let currentBlockIndex = this.getCellIndexByCoords({x: col, y: row})
              this.fields[currentBlockIndex] = true;
              this.fields[indexOfBlockAbove] = false;
            }
          }
          
        }
      })
    }
    
    // if a new figure not putted it means....
    if (!this.addNewFigure()) {
      alert('game over');
    }
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
