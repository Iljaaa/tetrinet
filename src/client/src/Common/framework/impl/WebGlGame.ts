import {Game} from "../interfaces/Game"
import {WebGlGraphics} from "./WebGlGraphics";
import {GameScreen} from "../interfaces/GameScreen";
import {WebInput} from "./WebInput";


/**
 * @version 0.1.0
 */
export abstract class WebGlGame implements Game
{
  /**
   * Graphic object
   * @private
   */
  private readonly graphics: WebGlGraphics;
  
  /**
   * Input object
   * @private
   */
  private readonly input: WebInput;
  
  /**
   * Instance of current screen
   * @private
   */
  private currentScreen:GameScreen|null = null;
  
  /**
   * Timer
   * @private
   */
  private t:number = 0
  
  /**
   * @protected
   */
  protected constructor() {
    this.graphics = new WebGlGraphics()
    this.input = new WebInput();
  }
  
  /**
   * graphics are initialized after the DOM is created
   */
  initGraphic (canvas:HTMLCanvasElement)
  {
    // create gl
    const gl:WebGL2RenderingContext|null = canvas.getContext("webgl2");
    if (!gl) throw new Error("Gl not created");
    
    this.graphics.setGl(gl);
  }
  
  /**
   * Update function
   * @param timeStamp
   */
  protected update = (timeStamp:number):void =>
  {
    const deltaTime:number = timeStamp - this.t
    this.t = timeStamp
    
    // update screen
    this.getCurrentScreen()?.update(deltaTime)
    
    // present screen
    this.getCurrentScreen()?.present()
    
    // request next frame
    window.requestAnimationFrame(this.update)
  }
  
  getGLGraphics(): WebGlGraphics {
    return this.graphics;
  }
  
  setScreen(screen:GameScreen): void {
    this.currentScreen = screen;
  }
  
  getCurrentScreen(): GameScreen|null {
    return this.currentScreen;
  }
  
  getInput(): WebInput {
    return this.input;
  }
}
