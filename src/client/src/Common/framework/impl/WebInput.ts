/**
 * Interface for input
 */
export interface WebInputEventListener {
  onKeyDown: (code:string) => void
  onKeyUp: (code:string) => void
}

/**
 *
 * @version 0.0.1
 */
export class WebInput
{
  /**
   * @private
   */
  private listener?:WebInputEventListener;
  
  bind():void
  {
    // intercept keyboards events
    document.addEventListener("keydown", this.onKeyDown);
    document.addEventListener("keyup", this.onKeyUp);
  }
  
  unBind():void {
    // clear keyboard intercept
    document.removeEventListener("keydown", this.onKeyDown);
    document.removeEventListener("keyup", this.onKeyUp);
  }
  
  public setListener(listener:WebInputEventListener){
    this.listener = listener
  }

  public clearListener (){
    this.listener = undefined
  }
  
  /**
   * Callback mouse down event
   * @param event
   */
  onKeyDown = (event:KeyboardEvent) =>
  {
    // disable page scroll on space
    // todo: use here array of keys that uses in controll
    if (event.code === "Space") {
      event.preventDefault();
    }
    
    
    if (this.listener){
      this.listener.onKeyDown(event.code)
    }
  }
  
  /**
   * On document key up
   * @param event
   */
  onKeyUp = (event:KeyboardEvent) =>
  {
  
  }
}
