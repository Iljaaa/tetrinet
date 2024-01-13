import {Figure} from "../models/Figure";
import {Cup} from "../models/Cup";
import {Coords} from "../math/Coords";
import {FourBlocksFigure} from "./FourBlocksFigure"

enum CamelState {
  top = 0,
  right = 1,
  bottom = 2,
  left = 3
}

/**
 * It is a camel
 */
export class Camel extends FourBlocksFigure implements Figure
{
  // current position of the figure
  protected _state:CamelState = CamelState.bottom
  
  /**
   * @param cap
   */
  constructor(cap:Cup)
  {
    super(cap);
    
    // random position
    const enumValues = Object.keys(CamelState).map(n => Number.parseInt(n))
    const randomIndex = Math.floor(Math.random() * 4) // 4 it is a magic, you know is count of states
    this._state = enumValues[randomIndex] as CamelState
    
    
    // move to position 9
    this.setPosition(1, 1)
    //
    // const coords = this.getCoordsOfAllCellsByStateAndCenter(this._state, this.center.x, this.center.y)
    //
    // // move coords to fields
    // this._fields = coords.map((c:Coords) => {
    //   return this._cap.getCellIndexByCoords(c)
    // })
  }
  
  /**
   *
   */
  getPreviewFields(): Array<Array<boolean>>
  {
    //  o
    // o0o
    if (this._state === CamelState.top)
    {
      return [
        [false, true, false],
        [true, true, true],
      ];
    }
    
    // o
    // 0o
    // o
    else if (this._state === CamelState.right)
    {
      return [
        [true, false],
        [true, true],
        [true, false],
      ];
    }
    
    
    // o0o
    //  o
    if (this._state === CamelState.bottom)
    {
      return [
        [true, true, true],
        [false, true, false],
      ];
    }
    
    //  o
    // o0
    //  o
    else
    {
      return [
        [false, true],
        [true, true],
        [false, true],
      ];
    }
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
    const coords = this.getCoordsOfAllCellsByStateAndCenter(this._state, this.center.x, this.center.y)
    
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
    
    // check can we update
    const capWidth = this._cap.getWidthInCells()
    
    // this center if we need to move it
    let centerX = this.center.x
    
    // this is special situation
    // if center next to right age
    // we move center for rotate
    if (this._state === CamelState.left && this.center.x === capWidth - 1) {
      centerX -= 1
    }
    
    // this is special situation
    // if center next to right age
    // we move center for rotate
    if (this._state === CamelState.right && this.center.x === 0) {
      centerX += 1
    }
    
    // fields after rotate
    const coordsAfterRotate = this.getCoordsOfAllCellsByStateAndCenter(nextPosition, centerX, this.center.y)
    
    // update buy position
    // this.updateByPosition(this._position);
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
      if (this._cap.getFieldValueByIndex(createIndexByCoords) > -1) {
        return true
      }
      
      return false
    });
    
    //
    if (-1 !== sinfulnessIndex){
      return false
    }
    
    // update fields by coords
    this.updateFieldsByCoords(coordsAfterRotate, capWidth)
    
    // save position
    this._state = nextPosition
    
    // move center if id happens
    this.center.x = centerX;
    
    return true;
  }
  
  rotateCounterClockwise(): boolean
  {
    // previous rotate state
    let previousPosition;
    switch (this._state) {
      case CamelState.top: previousPosition = CamelState.left; break;
      case CamelState.right: previousPosition = CamelState.top; break;
      case CamelState.bottom:  previousPosition = CamelState.right; break;
      default: previousPosition = CamelState.bottom; break;
    }
    
    const capWidth = this._cap.getWidthInCells()
    
    // this center if we need to move it
    let centerX = this.center.x
    
    // this is special situation
    // if center next to right age
    // we move center for rotate
    if (this._state === CamelState.left) {
      if (this.center.x === capWidth - 1){
        centerX -= 1
      }
    }
    
    // this is special situation
    // if center next to right age
    // we move center for rotate
    if (this._state === CamelState.right && this.center.x === 0) {
      centerX += 1
    }
    
    // fields after rotate
    const coordsAfterRotate = this.getCoordsOfAllCellsByStateAndCenter(previousPosition, centerX, this.center.y)
    
    // update buy position
    // this.updateByPosition(this._position);
    const sinfulnessIndex = coordsAfterRotate.findIndex((c:{x:number, y:number}) =>
    {
      // check min max
      if (c.x < 0) return true
      if (c.y < 0) return true
      if (c.x >= capWidth) return true
      // if (c.y > this.) check in it higher than top
      
      // cell index in field coords
      const createIndexByCoords = this._cap.getCellIndexByCoords(c)
      
      // check is field is busy in cup
      if (this._cap.getFieldValueByIndex(createIndexByCoords) > -1) {
        return true
      }
      
      return false
    });
    
    if (sinfulnessIndex !== -1){
      return false
    }
    
    // update fields by coords
    this.updateFieldsByCoords(coordsAfterRotate, capWidth)
    
    // save position
    this._state = previousPosition
    
    // move cennter if id happens
    this.center.x = centerX;
    
    return true;
  }
  
  /**
   * returns an array of points with coordinates after rotation
   * @var number state horse's state from 0 to 3
   */
  getCoordsOfAllCellsByStateAndCenter (state:CamelState, centerX:number, centerY:number): Array<Coords>
  {
    //  o
    // o0o
    if (state === CamelState.top)
    {
      return [
        {x: centerX, y: centerY},
        {x: centerX -1, y: centerY},
        {x: centerX +1, y: centerY},
        {x: centerX, y: centerY +1}
      ];
    }
    
    // o
    // 0o
    // o
    else if (state === CamelState.right)
    {
      return [
        {x: centerX, y: centerY},
        {x: centerX, y: centerY -1},
        {x: centerX, y: centerY +1},
        {x: centerX + 1, y: centerY}
      ];
    }
    
    
    // o0o
    //  o
    if (state === CamelState.bottom)
    {
      return [
        {x: centerX, y: centerY},
        {x: centerX +1, y: centerY},
        {x: centerX -1, y: centerY},
        {x: centerX, y: centerY -1}
      ];
    }
    
    //  o
    // o0
    //  o
    else
    {
      return [
        {x: centerX, y: centerY},
        {x: centerX, y: centerY - 1},
        {x: centerX, y: centerY + 1},
        {x: centerX -1, y: centerY}
      ];
    }
    
  }
  
  
  
}
