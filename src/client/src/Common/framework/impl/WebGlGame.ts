import {Game} from "../interfaces/Game"
import {WebGlGraphics} from "./WebGlGraphics";
import {GameScreen} from "../interfaces/GameScreen";
import {WebInput} from "./WebInput";
import {FpsCounter} from "../../Tetrinet/helpers/FpsCounter";
import {WebGlProgramManager} from "./WebGlProgramManager";


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
   * Delta time calculation
   * @private
   */
  private t:number = 0
  
  /**
   *
   * @private
   */
  private fpsCounter:FpsCounter;
  
  
  /**
   * this for test two programs
   * @private
   */
  private colorProgram: WebGLProgram | undefined;
  private textureProgram: WebGLProgram | undefined;
  private mixedProgram: WebGLProgram | undefined;
  
  /**
   * This is a program with color and textils
   * @private
   */
  private _glMixedProgram: WebGLProgram|null = null;
  private _glColorProgram: WebGLProgram|null = null;
  
  /**
   * @protected
   */
  protected constructor()
  {
    this.graphics = new WebGlGraphics()
    this.input = new WebInput();
    
    // init fps counter
    this.fpsCounter = new FpsCounter();
  }
  
  /**
   * graphics are initialized after the DOM is created
   */
  initGraphic (canvas:HTMLCanvasElement)
  {
    // create gl
    const gl:WebGL2RenderingContext|null = canvas.getContext("webgl2");
    if (!gl) throw new Error("Gl not created");
    
    //
    this.graphics.setGl(gl);
    
    // here we create a program
    // Set the viewport size to be the whole canvas.
    gl.viewport(0, 0, 960, 750)
    // gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

    // Set the background color to sky blue.
    gl.clearColor(0, .5, .5, 1)
    
    // Tell webGL that we aren't doing anything special with the vertex buffer, just use a default one.
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
    
    // Tell webGL that when we set the opacity, it should be semi transparent above what was already drawn.
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    gl.enable(gl.BLEND)


    //////////////
    // Init programs
    /////////


    this.mixedProgram = WebGlProgramManager.getMixedProgram(gl);

    
    // create color program
    this.colorProgram = WebGlProgramManager.getColorProgram(gl)

    //
    this.textureProgram = WebGlProgramManager.getTextureProgram(gl)

    
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
    
    // click fps counter
    this.fpsCounter.update(deltaTime)
    
    // request next frame
    window.requestAnimationFrame(this.update)
  }
  
  getGLGraphics(): WebGlGraphics {
    return this.graphics;
  }
  
  getGlProgram(): WebGLProgram {
    if (!this._glMixedProgram) throw new Error("GL program not initialised")
    return this._glMixedProgram;
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
