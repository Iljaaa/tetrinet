import {Figure} from "../models/Figure";
import {Cup} from "../models/Cup";
import {Coords} from "../math/Coords";
import {FourBlocksFigure} from "./FourBlocksFigure"

/**
 * the horse figure like in chess
 */
export abstract class Flash extends FourBlocksFigure implements Figure
{
  
  // current position of the figure
  protected _vertical:boolean = false
  
  /**
   * @param cup
   * @param color
   */
  constructor(cup:Cup, color:number)
  {
    super(cup, color);
    
    // init start figure
    
    // random position
    this._vertical = Math.random() < 0.5;
    
    this.setPosition(1, 1)
  }
  
  /**
   * Set position
   * @param x
   * @param y
   */
  setPosition(x:number, y:number)
  {
    this.center.x = x
    this.center.y = y
    
    //
    const coords = this.getCoordsOfAllCellsByStateAndCenter(this._vertical, this.center.x, this.center.y)
    
    // move coords to fields
    this._fields = coords.map((c:Coords) => {
      return this._cap.getCellIndexByCoords(c.x, c.y)
    })
  }
  
  /**
   *
   */
  getPreviewFields(): Array<Array<boolean>> {
    return [[]];
  }
  
  /**
   * Rotate to right
   */
  rotateCounterClockwise():boolean
  {
    // change state position
    let nextPosition = !this._vertical
    
    // update fields
    const capWidth = this._cap.getWidthInCells()
    
    // this center if we need to move it
    let centerX = this.center.x
    
    // this is special situation
    if (this._vertical) {
      // if center close to left age
      // we move center for rotate
      if (this.center.x === 0) {
        centerX += 1
      }
    }
    
    // fields after rotate
    const coordsAfterRotate = this.getCoordsOfAllCellsByStateAndCenter(nextPosition, centerX, this.center.y)
    
    
    // update buy position
    // this.updateByPosition(this._position);
    
    // check can we update
    const sinfulnessIndex:number = this.findSinfulnessIndex(coordsAfterRotate)
    
    //
    if (-1 !== sinfulnessIndex){
      return false
    }
    
    // update feeld coords by points
    this._fields[0] = coordsAfterRotate[0].y * capWidth + coordsAfterRotate[0].x
    this._fields[1] = coordsAfterRotate[1].y * capWidth + coordsAfterRotate[1].x
    this._fields[2] = coordsAfterRotate[2].y * capWidth + coordsAfterRotate[2].x
    this._fields[3] = coordsAfterRotate[3].y * capWidth + coordsAfterRotate[3].x
    
    // save position
    this._vertical = nextPosition
    
    // move center if id happens
    this.center.x = centerX;
    
    return true;
  }

  rotateClockwise(): boolean
  {
    let previousPosition = !this._vertical
    
    // update fields
    const capWidth = this._cap.getWidthInCells()
    
    // this center if we need to move it
    let centerX = this.center.x
    
    // this is special situation
    if (this._vertical) {
      // if center close to left age
      // we move center for rotate
      if (this.center.x === 0) {
        centerX += 1
      }
    }
    
    // fields after rotate
    const coordsAfterRotate = this.getCoordsOfAllCellsByStateAndCenter(previousPosition, centerX, this.center.y)
    
    // update buy position
    // this.updateByPosition(this._position);
    
    // check can we update
    const sinfulnessIndex = this.findSinfulnessIndex(coordsAfterRotate)
    
    if (sinfulnessIndex !== -1){
      return false
    }
    
    // update feeld coords by points
    this._fields[0] = coordsAfterRotate[0].y * capWidth + coordsAfterRotate[0].x
    this._fields[1] = coordsAfterRotate[1].y * capWidth + coordsAfterRotate[1].x
    this._fields[2] = coordsAfterRotate[2].y * capWidth + coordsAfterRotate[2].x
    this._fields[3] = coordsAfterRotate[3].y * capWidth + coordsAfterRotate[3].x
    
    // save position
    this._vertical = previousPosition
    
    // move center if id happens
    this.center.x = centerX;
    
    return true;
  }
  
  /**
   * returns an array of points with coordinates after rotation
   * @var number state horse's state from 0 to 3
   */
  abstract getCoordsOfAllCellsByStateAndCenter (isVertical:boolean, centerX:number, centerY:number): Array<Coords>
  

}
