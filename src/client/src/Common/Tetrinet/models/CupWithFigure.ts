import {Cup} from "./Cup";
import {Figure} from "./Figure";
import {Coords} from "../math/Coords";

export interface CapWithFigure extends Cup
{
  
  /**
   * Start new game
   */
  start(): void
  
  /**
   * Set new drop figure
   * @param f
   */
  setFigure(f:Figure): void
  
  /**
   * Get figure
   */
  getFigure(): Figure|null;
  
  /**
   * Get position where we should drop new figure
   * it must be cup top point
   */
  getDropPoint: () => Coords
  
  /**
   * Move figure right
   */
  moveFigureRight (): boolean
  
  /**
   * Move the figure to the left
   */
  moveFigureLeft (): boolean
  
  /**
   * Move figure down
   */
  moveFigureDown (): boolean
  
  /**
   * Down figure to the bottom of cup
   */
  dropFigureDown (): boolean
  
  /**
   * Rotate figure
   */
  rotateClockwise (): boolean
  
  /**
   * Rotate figure
   */
  rotateCounterClockwise (): boolean
}
