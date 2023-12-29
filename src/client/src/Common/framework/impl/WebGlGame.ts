import {Game} from "../interfaces/Game"
import {WebGlGraphics} from "./WebGlGraphics";
import {GameScreen} from "../interfaces/GameScreen";


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
  
  
  private currentScreen:GameScreen|null = null;
  
  
  protected constructor() {
    this.graphics = new WebGlGraphics()
  }
  
  /**
   * graphics are initialized after the DOM is created
   */
  initGraphic (canvas:HTMLCanvasElement){
    
    // create gl
    const gl:WebGL2RenderingContext|null = canvas.getContext("webgl2");
    if (!gl) throw new Error("Gl not created");
    
    this.graphics.setGl(gl);
  }
  
  getGLGraphics(): WebGlGraphics {
    return this.graphics;
  }
  
  getCurrentScreen(): GameScreen|null {
    return this.currentScreen;
  }
  
  setScreen(screen:GameScreen): void {
    this.currentScreen = screen;
  }
  
  
}
