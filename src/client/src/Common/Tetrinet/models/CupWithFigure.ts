import {Cup} from "./Cup";
import {Figure} from "./Figure";
import {Coords} from "../math/Coords";

export interface CupWithFigure extends Cup
{

  /**
   * Place new drop figure on top of cup
   * @param f
   * @param color color of figure @deprecated
   */
  setFigureToDropPoint(f:Figure, color:number): void
  
  /**
   * Get figure
   */
  getFigure(): Figure|null;
  
  /**
   * Color of figure
   */
  getFigureColor() : number

  /**
   * Update timer that figure must go down
   */
  updateFigureDownTimer (): void
  
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
