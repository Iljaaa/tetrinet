import {Cup} from "./Cup";
import {Figure} from "./Figure";

export interface CupWithFigure extends Cup
{

  /**
   * Place new drop figure on top of cup
   * @param f
   */
  setFigureToDropPoint(f:Figure): void
  
  /**
   * Get figure
   */
  getFigure(): Figure|null;

  /**
   * Update timer that figure must go down
   */
  // updateFigureDownTimer (deltaTime:number): void
  
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

  /**
   * This method generates new next figure
   */
  generateNextFigure(): void

  /**
   * Return next figure
   */
  getNextFigure():Figure|undefined
}
