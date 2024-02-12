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
    console.log ('WebGlGame.initGraphics');
    
    // create gl
    const gl:WebGL2RenderingContext|null = canvas.getContext("webgl2");
    if (!gl) throw new Error("Gl not created");
    
    //
    this.graphics.setGl(gl);
    
    // here we create a program
    // Set the viewport size to be the whole canvas.
    // gl.viewport(0, 0, 500, 500)
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
    
    // Set the background color to sky blue.
    gl.clearColor(.5, .7, 1, 1)
    
    // Tell webGL that we aren't doing anything special with the vertex buffer, just use a default one.
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
    
    // // WebGlGraphics.createProgram()
    // // this._glProgram = this._createMixedProgram(gl);
    // // this._glProgram = WebGlProgramManager.getMixedProgram(gl);
    // this._glMixedProgram = WebGlProgramManager._createMixedProgram(gl);
    //
    // //
    // // gl.useProgram(this._glMixedProgram)
    //
    // // Set shader variable for canvas size. It's a vec2 that holds both width and height.
    // const canvasSizeLocation:WebGLUniformLocation|null = gl.getUniformLocation(this._glMixedProgram, "canvasSize");
    // gl.uniform2f(canvasSizeLocation, gl.canvas.width, gl.canvas.height)
    //
    // // Save texture dimensions in our shader.
    // const textureSizeLocation:WebGLUniformLocation|null = gl.getUniformLocation(this._glMixedProgram, "texSize");
    // gl.uniform2f(textureSizeLocation, 100, 100)
    //
    //
    // this._glColorProgram = WebGlProgramManager._createColorProgram(gl)
    //
    // //
    // // gl.useProgram(this._glColorProgram)
    //
    // // Set shader variable for canvas size. It's a vec2 that holds both width and height.
    // const canvasSizeLocation2:WebGLUniformLocation|null = gl.getUniformLocation(this._glMixedProgram, "canvasSize");
    // gl.uniform2f(canvasSizeLocation2, gl.canvas.width, gl.canvas.height)
    //
    //
    // //
    // WebGlProgramManager._useAndTellGlAboutMixedProgram(gl, this._glMixedProgram);
    
    // Tell webGL that when we set the opacity, it should be semi transparent above what was already drawn.
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    gl.enable(gl.BLEND)
    
    
    //////////////
    // Init programs
    /////////
    
    
    //
    // const gl:WebGL2RenderingContext = this.game.getGLGraphics().getGl();
    
    // Set the viewport size to be the whole canvas.
    // gl.viewport(0, 0, canvas.width, canvas.height)
    // gl.viewport(0, 0, 500, 500)
    // gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
    //
    // // Set the background color to sky blue.
    // gl.clearColor(.5, .7, 1, 1)
    //
    // // Tell webGL that we aren't doing anything special with the vertex buffer, just use a default one.
    // gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
    
    // create program
    // this.mixedProgram = this._createMixedProgram(gl);
    // if (!this.mixedProgram) throw new Error("vertShader was not created");
    //
    // // const mixedProgram = this._createMixedProgram(gl);
    // this.colorProgram = this._createColorProgram(gl);
    // if (!this.colorProgram) throw new Error("vertShader was not created");
    //
    // gl.linkProgram(shaderProgram) // this used in create program function
    
    // it could be here
    // gl.useProgram(shaderProgram)
    
    // // gl.linkProgram(shaderProgram) // this used in create program function
    // gl.useProgram(this.mixedProgram)
    //
    // // UPDATE: Set shader variable for canvas size. It's a vec2 that holds both width and height.
    // const canvasSizeLocation:WebGLUniformLocation|null = gl.getUniformLocation(this.mixedProgram, "canvasSize");
    // gl.uniform2f(canvasSizeLocation, gl.canvas.width, gl.canvas.height)
    //
    // // Save texture dimensions in our shader.
    // const textureSizeLocation:WebGLUniformLocation|null = gl.getUniformLocation(this.mixedProgram, "texSize");
    // gl.uniform2f(textureSizeLocation, 100, 100)
    
    // Create a gl texture from our JS image object.
    // we can use it before use program
    // gl.bindTexture(gl.TEXTURE_2D, gl.createTexture())
    // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, Assets.sprite.getImage())
    
    // Tell gl that when draw images scaled up, smooth it.
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    
    
    //
    // gl.activeTexture(gl.TEXTURE0)
    
    // WebGlGraphics.createProgram()
    // this._glProgram = this._createMixedProgram(gl);
    this.mixedProgram = WebGlProgramManager.getMixedProgram(gl);
    // this.mixedProgram = WebGlProgramManager._createMixedProgram(gl);
    // gl.useProgram(this._glMixedProgram)
    
    // Set shader variable for canvas size. It's a vec2 that holds both width and height.
    // const canvasSizeLocation:WebGLUniformLocation|null = gl.getUniformLocation(this.mixedProgram, "canvasSize");
    // gl.uniform2f(canvasSizeLocation, gl.canvas.width, gl.canvas.height)
    
    // Save texture dimensions in our shader.
    // const textureSizeLocation:WebGLUniformLocation|null = gl.getUniformLocation(this.mixedProgram, "texSize");
    // gl.uniform2f(textureSizeLocation, 640, 640)
    // WebGlProgramManager.setUpIntoMixedProgramImageSize(gl, Assets.sprite.getImage().width, Assets.sprite.getImage().height);
    
    // create color program
    this.colorProgram = WebGlProgramManager.getColorProgram(gl)
    // gl.useProgram(this._glColorProgram)
    
    //
    this.textureProgram = WebGlProgramManager.getTextureProgram(gl)
    
    // bind texture size in texture programm
    // WebGlProgramManager.setUpIntoTextureProgramImageSize(gl,Assets.sprite.getImage().width, Assets.sprite.getImage().height);
    
    
    // Save texture dimensions in our shader.
    // const textureSizeLocation2:WebGLUniformLocation|null = gl.getUniformLocation(this.textureProgram, "texSize");
    // gl.uniform2f(textureSizeLocation2, 640, 640)
    
    
    // back to program
    // WebGlProgramManager._useAndTellGlAboutMixedProgram(gl, this.colorProgram);
    
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
  
  /**
   * This program include and color and texils
   */
  // _createMixedProgram (gl:WebGL2RenderingContext):WebGLProgram
  // {
  //   // Vertex shader source code.
  //   const vertCode =
  //     // describe position in vertices array
  //     "attribute vec2 coordinates;" +
  //
  //     // describe color position in vertices array
  //     "attribute vec4 rgba;" +
  //
  //     // describe texture position in vertices array
  //     "attribute vec2 textilsPos;" +
  //
  //     // var to pass color into fragment shader
  //     "varying highp vec4 rgbaForFrag;" +
  //
  //     // var tp pass textils coords to fragment shader
  //     "varying highp vec2 texPosForFrag;" +
  //
  //     // canvas size, used to map local coords to pixels
  //     "uniform vec2 canvasSize;" +
  //
  //     // texture size
  //     "uniform vec2 texSize;" +
  //
  //     "void main(void) {" +
  //     // Divide the pixel position by our current canvas size, because webGL wants a number from -1 to 1
  //     " vec2 drawPos = coordinates / canvasSize * 2.0;" +
  //     // We are passing in only 2D coordinates. Then Z is always 0.0 and the divisor is always 1.0
  //     " gl_Position = vec4(drawPos.x - 1.0, 1.0 - drawPos.y, 0.0, 1.0);" +
  //     // Pass the color and transparency to the fragment shader.
  //     " rgbaForFrag = vec4(rgba.xyz / 255.0, rgba.w);" +
  //     // Pass the texture position to the fragment shader.
  //     // WebGL wants numbers from 0 to 1, but we are passing in pixel positions.
  //     " texPosForFrag = textilsPos / texSize;" +
  //     "}"
  //
  //   // Create a vertex shader object.
  //   // let vertShader = gl.createShader(gl.VERTEX_SHADER)
  //   let vertShader = WebGlGraphics.createShader(gl, gl.VERTEX_SHADER, vertCode)
  //   if (!vertShader) throw new Error("vertShader was not created");
  //   // gl.shaderSource(vertShader, vertCode)
  //   // gl.compileShader(vertShader)
  //   // console.log(gl.getShaderInfoLog(vertShader))
  //
  //   // Fragment shader source code.
  //   var fragCode =
  //     // color var from vertex function
  //     "varying highp vec4 rgbaForFrag;" +
  //     // texture var from vertex function
  //     "varying highp vec2 texPosForFrag;" +
  //     "uniform sampler2D sampler;" +
  //     "void main(void) {" +
  //     " gl_FragColor = texture2D(sampler, texPosForFrag) * rgbaForFrag;" +
  //     "}"
  //
  //   // Create fragment shader object.
  //   //var fragShader = gl.createShader(gl.FRAGMENT_SHADER)
  //
  //   let fragShader = WebGlGraphics.createShader(gl, gl.FRAGMENT_SHADER, fragCode)
  //   if (!fragShader) throw new Error("fragCode was not created");
  //   // gl.shaderSource(fragShader, fragCode)
  //   // gl.compileShader(fragShader)
  //   // console.log(gl.getShaderInfoLog(fragShader))
  //
  //   // Tell webGL to use both my shaders.
  //   // let shaderProgram = gl.createProgram()
  //   const program = WebGlGraphics.createProgram(gl, vertShader, fragShader)
  //   if (!program) throw new Error("Program was not created");
  //
  //   // Tell webGL to read 2 floats from the vertex array for each vertex
  //   // and store them in my vec2 shader variable I've named "coordinates"
  //   // We need to tell it that each vertex takes 24 bytes now (6 floats)
  //   const coordAttributeLocation  = gl.getAttribLocation(program, "coordinates")
  //   gl.vertexAttribPointer(coordAttributeLocation, 2, gl.FLOAT, false, 32, 0)
  //   gl.enableVertexAttribArray(coordAttributeLocation)
  //
  //   // Tell webGL how to get rgba from our vertices array.
  //   // Tell webGL to read 4 floats from the vertex array for each vertex
  //   // and store them in my vec4 shader variable I've named "rgba"
  //   // Start after 8 bytes. (After the 2 floats for x and y)
  //   const rgbaAttributeLocation = gl.getAttribLocation(program, "rgba")
  //   gl.vertexAttribPointer(rgbaAttributeLocation, 4, gl.FLOAT, false, 32, 8)
  //   gl.enableVertexAttribArray(rgbaAttributeLocation)
  //
  //   // Tell webGL to read 2 floats from the vertex array for each vertex
  //   // and store them in my vec2 shader variable I've named "texPos"
  //   const textilsAttributeLocation = gl.getAttribLocation(program, "textilsPos")
  //   gl.vertexAttribPointer(textilsAttributeLocation, 2, gl.FLOAT, false, 32, 24) // 4 bytes * 2:coords + 4 bytes * 4:color
  //   gl.enableVertexAttribArray(textilsAttributeLocation)
  //
  //   return program
  // }
  //
  //
  // /**
  //  * This program include and color and texils
  //  */
  // _createColorProgram (gl:WebGL2RenderingContext):WebGLProgram
  // {
  //   // Vertex shader source code.
  //   const vertCode =
  //     // describe position in vertices array
  //     "attribute vec2 coordinates;" +
  //
  //     // describe color position in vertices array
  //     "attribute vec4 rgba;" +
  //
  //     // var to pass color into fragment shader
  //     "varying highp vec4 rgbaForFrag;" +
  //
  //     // canvas size, used to map local coords to pixels
  //     "uniform vec2 canvasSize;" +
  //
  //     "void main(void) {" +
  //     // Divide the pixel position by our current canvas size, because webGL wants a number from -1 to 1
  //     " vec2 drawPos = coordinates / canvasSize * 2.0;" +
  //     // We are passing in only 2D coordinates. Then Z is always 0.0 and the divisor is always 1.0
  //     " gl_Position = vec4(drawPos.x - 1.0, 1.0 - drawPos.y, 0.0, 1.0);" +
  //     // Pass the color and transparency to the fragment shader.
  //     " rgbaForFrag = vec4(rgba.xyz / 255.0, rgba.w);" +
  //     "}"
  //
  //   // Create a vertex shader object.
  //   let vertShader = WebGlGraphics.createShader(gl, gl.VERTEX_SHADER, vertCode)
  //   if (!vertShader) throw new Error("vertShader was not created");
  //
  //   // Fragment shader source code.
  //   var fragCode =
  //     // color var from vertex function
  //     "varying highp vec4 rgbaForFrag;" +
  //     "void main(void) {" +
  //     " gl_FragColor = rgbaForFrag;" +
  //     "}"
  //
  //   // Create fragment shader object.
  //   let fragShader = WebGlGraphics.createShader(gl, gl.FRAGMENT_SHADER, fragCode)
  //   if (!fragShader) throw new Error("fragCode was not created");
  //
  //   // Tell webGL to use both my shaders.
  //   // let shaderProgram = gl.createProgram()
  //   const program = WebGlGraphics.createProgram(gl, vertShader, fragShader)
  //   if (!program) throw new Error("Program was not created");
  //
  //   // Tell webGL to read 2 floats from the vertex array for each vertex
  //   // and store them in my vec2 shader variable I've named "coordinates"
  //   // We need to tell it that each vertex takes 24 bytes now (6 floats)
  //   const coordAttributeLocation  = gl.getAttribLocation(program, "coordinates")
  //   gl.vertexAttribPointer(coordAttributeLocation, 2, gl.FLOAT, false, 24, 0)
  //   gl.enableVertexAttribArray(coordAttributeLocation)
  //
  //   // Tell webGL how to get rgba from our vertices array.
  //   // Tell webGL to read 4 floats from the vertex array for each vertex
  //   // and store them in my vec4 shader variable I've named "rgba"
  //   // Start after 8 bytes. (After the 2 floats for x and y)
  //   const rgbaAttributeLocation = gl.getAttribLocation(program, "rgba")
  //   gl.vertexAttribPointer(rgbaAttributeLocation, 4, gl.FLOAT, false, 24, 8)
  //   gl.enableVertexAttribArray(rgbaAttributeLocation)
  //
  //   return program
  // }
}
