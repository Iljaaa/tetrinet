import {Figure} from "../models/Figure";
import {Cup} from "../models/Cup";
import {Coords} from "../math/Coords";
import {BaseFigure} from "../BaseFigure"

enum CamelState {
  top = 0,
  right = 1,
  bottom = 2,
  left = 3
}

/**
 * It is a camel
 */
export class Camel extends BaseFigure implements Figure
{
  // current position of the figure
  protected _state:CamelState = CamelState.bottom
  
  /**
   * @param cap
   * @param center
   */
  constructor(cap:Cup, center:Coords)
  {
    super(cap, center);
    
    // random position
    const enumValues = Object.keys(CamelState).map(n => Number.parseInt(n))
    const randomIndex = Math.floor(Math.random() * enumValues.length)
    this._state = enumValues[randomIndex] as CamelState
    
    //
    const coords = this.getCoordsOfAllCellsByStateAndCenter(this._state, this.center)
    
    // move coords to fields
    this._fields = coords.map((c:Coords) => {
      return this._cap.getCellIndexByCoords(c)
    })
  }
  
  
  
  /**
   * Rotate to right
   */
  rotateClockwise():boolean
  {
    // change state position
    let nextPosition;
    switch (this._state) {
      case CamelState.top: nextPosition = CamelState.right; break;
      case CamelState.right: nextPosition = CamelState.bottom; break;
      case CamelState.bottom:  nextPosition = CamelState.left; break;
      default: nextPosition = CamelState.top; break;
    }
    
    
    // update fields
    const capWidth = this._cap.getWidthInCells()
    
    // we take next position
    // let nextPosition = this._position+1;
    // if (nextPosition > 3) nextPosition = 0
    
    // the center is presented in coords 0
    // const center = this._cap.getCoordsByIndex(this._fields[0]);
    
    // fields after rotate
    const coordsAfterRotate = this.getCoordsOfAllCellsByStateAndCenter(nextPosition, this.center)
    
    // update buy position
    // this.updateByPosition(this._position);
    
    // check can we update
    const sinfulnessIndex:number = coordsAfterRotate.findIndex((c:Coords) =>
    {
      // check min max
      if (c.x < 0) return true
      if (c.y < 0) return true
      if (c.x >= capWidth) return true
      // if (c.y > this.) check in it higher than top
      
      // cell index in field coords
      const createIndexByCoords = this._cap.getCellIndexByCoords(c)
      
      // check in fields
      if (this._cap.getFieldValueByIndex(createIndexByCoords)) {
        return true
      }
      
      return false
    });
    
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
    this._state = nextPosition
    
    return true;
  }
  
  rotateCounterClockwise(): boolean
  {
    let previousPosition;
    switch (this._state) {
      case CamelState.top: previousPosition = CamelState.left; break;
      case CamelState.right: previousPosition = CamelState.top; break;
      case CamelState.bottom:  previousPosition = CamelState.right; break;
      default: previousPosition = CamelState.bottom; break;
    }
    
    // update fields
    const capWidth = this._cap.getWidthInCells()
    
    // the center is presented in coords 0
    // const center = this._cap.getCoordsByIndex(this._fields[0]);
    
    // fields after rotate
    const coordsAfterRotate = this.getCoordsOfAllCellsByStateAndCenter(previousPosition, this.center)
    
    // update buy position
    // this.updateByPosition(this._position);
    
    // check can we update
    const sinfulnessIndex = coordsAfterRotate.findIndex((c:{x:number, y:number}) =>
    {
      // check min max
      if (c.x < 0) return true
      if (c.y < 0) return true
      if (c.x >= capWidth) return true
      // if (c.y > this.) check in it higher than top
      
      // cell index in field coords
      const createIndexByCoords = this._cap.getCellIndexByCoords(c)
      
      // check in fields
      if (this._cap.getFieldValueByIndex(createIndexByCoords)) {
        return true
      }
      
      return false
    });
    
    if (sinfulnessIndex !== -1){
      return false
    }
    
    // update feeld coords by points
    this._fields[0] = coordsAfterRotate[0].y * capWidth + coordsAfterRotate[0].x
    this._fields[1] = coordsAfterRotate[1].y * capWidth + coordsAfterRotate[1].x
    this._fields[2] = coordsAfterRotate[2].y * capWidth + coordsAfterRotate[2].x
    this._fields[3] = coordsAfterRotate[3].y * capWidth + coordsAfterRotate[3].x
    
    // save position
    this._state = previousPosition
    
    return true;
  }
  
  
  /**
   * returns an array of points with coordinates after rotation
   * @var number state horse's state from 0 to 3
   */
  getCoordsOfAllCellsByStateAndCenter (state:CamelState, center:Coords): Array<Coords>
  {
    
    //  o
    // o0o
    if (state === CamelState.top)
    {
      return [
        {x: center.x, y: center.y},
        {x: center.x -1, y: center.y},
        {x: center.x +1, y: center.y},
        {x: center.x, y: center.y +1}
      ];
    }
    
    // o
    // 0o
    // o
    else if (state === CamelState.right)
    {
      return [
        {x: center.x, y: center.y},
        {x: center.x, y: center.y -1},
        {x: center.x, y: center.y +1},
        {x: center.x + 1, y: center.y}
      ];
    }
    
    
    // o0o
    //  o
    if (state === CamelState.bottom)
    {
      return [
        {x: center.x, y: center.y},
        {x: center.x +1, y: center.y},
        {x: center.x -1, y: center.y},
        {x: center.x, y: center.y -1}
      ];
    }
    
    //  o
    // o0
    //  o
    else
    {
      return [
        {x: center.x, y: center.y},
        {x: center.x, y: center.y - 1},
        {x: center.x, y: center.y + 1},
        {x: center.x -1, y: center.y}
      ];
    }
    
  }
  
  
  
}
