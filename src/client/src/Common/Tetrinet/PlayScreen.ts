import {CupEventListener, CupWithFigureImpl} from "./models/CupWithFigureImpl";
import {WebGlScreen} from "../framework/impl/WebGlScreen";
import {GameEventListener, Tetrinet} from "./Tetrinet";
import {WebInputEventListener} from "../framework/impl/WebInput";
import {Assets} from "./Assets";
import {Vertices} from "../framework/Vertices";
import {WebGlProgramManager} from "../framework/impl/WebGlProgramManager";

// import {CupRenderer} from "./CupRenderer";
import {CupRenderer2} from "./CupRenderer2";

/**
 * Game states
 */
enum GameState {
  running = 0,
  over = 100,
}

/**
 * @vaersion 0.0.1
 */
export class PlayScreen extends WebGlScreen implements CupEventListener, WebInputEventListener
{
  /**
   * Cup object
   * @private
   */
  private readonly _cup: CupWithFigureImpl;
  
  /**
   * Render
   * @private
   */
  private _cupRenderer: CupRenderer2 | null = null;
  
  /**
   * Timer for next down
   * @private
   */
  private _downTimer:number = 0;
  
  /**
   * Current game state
   * @private
   */
  private _state:GameState = GameState.running;
  
  /**
   * @private
   */
  private listener: GameEventListener|undefined;
  
  /**
   * Red squere for experiment with vertices
   * @private
   */
  private redSquare:Vertices;
  
  /**
   * this for test two programs
   * @private
   */
  private colorProgram: WebGLProgram | undefined;
  private textureProgram: WebGLProgram | undefined;
  private mixedProgram: WebGLProgram | undefined;
  
  /**
   * In this constructor we create cup
   */
  constructor(game:Tetrinet)
  {
    super(game)
    
    // create cup object
    this._cup =  new CupWithFigureImpl(this);
    
    this._cupRenderer  = new CupRenderer2(game.getGLGraphics(), this._cup)
    
    // todo: we need to create programs here
    
    //
    
    // test red square
    this.redSquare = new Vertices(true, false);
    this.redSquare.setVertices(Vertices.createColorVerticesArray(0, 0, 100, 100, 255,0,0,1))
    
    // bind this to input listener
    this.game.getInput().setListener(this);
  }
  
  /**
   * Set event listener
   * @param listener
   */
  public setGameEventListener (listener:GameEventListener):PlayScreen{
    this.listener = listener;
    return this
  }
  
  /**
   * Init render by canvas element
   */
  init ()
  {
    console.log ('PlayScreen.init');
    // this._cupRenderer = new CupRenderer(this.game.getGLGraphics().getGl(), this._cup);
  }
  
  /**
   * It starts the game
   * must be called after init!
   */
  start ()
  {
    // if (!this._cupRenderer){
    //   throw new Error('Cup render not initialised')
    // }
    
    // init first figure in cup
    this._cup.start();
    
    // first render
    // this._cupRenderer.renderCupWithFigure(this._cup)
    
    console.log('PlayScreen.start')
    
    //
    const gl:WebGL2RenderingContext = this.game.getGLGraphics().getGl();
    
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
    
    // bind texture
    Assets.sprite.bind(gl)
    
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
    WebGlProgramManager.setUpIntoMixedProgramImageSize(gl,Assets.sprite.getImage().width, Assets.sprite.getImage().height);
    
    this.colorProgram = WebGlProgramManager.getColorProgram(gl)
    // gl.useProgram(this._glColorProgram)
    
    //
    this.textureProgram = WebGlProgramManager.getTextureProgram(gl)
    WebGlProgramManager.setUpIntoTextureProgramImageSize(gl,Assets.sprite.getImage().width, Assets.sprite.getImage().height);
    
    
    // Save texture dimensions in our shader.
    // const textureSizeLocation2:WebGLUniformLocation|null = gl.getUniformLocation(this.textureProgram, "texSize");
    // gl.uniform2f(textureSizeLocation2, 640, 640)
    
    
    // back to program
    // WebGlProgramManager._useAndTellGlAboutMixedProgram(gl, this.colorProgram);
  }
  
  
  /**
   * Update cup
   * @param deltaTime
   */
  update (deltaTime:number):void
  {
    if (this._state === GameState.running) {
      this._updateRunning(deltaTime);
    }
    else if (this._state === GameState.over) {
      // this.updatePaused();
    }
  }
  
  /**
   * @param deltaTime
   * @private
   */
  private _updateRunning(deltaTime:number)
  {
    // tick figure down timer
    this._downTimer += deltaTime
    
    // one sec
    if (this._downTimer > 1000) {
      this.onDown();
      this._downTimer = 0;
    }
  }
  
  present(): void
  {
    //console.log('PlayScreen.present')
    
    const gl = this.game.getGLGraphics().getGl();
    
    // Clear the screen.
    gl.clear(gl.COLOR_BUFFER_BIT)
    
    // use texture program
    if (this.textureProgram) {
      // WebGlProgramManager._startUseTextureProgram(gl, this.textureProgram)
      
    }
    
    // use texure program
    WebGlProgramManager.sUseTextureProgram(gl);
    
    // reder cup
    this._cupRenderer?.renderCupWithFigure(this._cup);
    
    // render next figure
    
    // if (this.mixedProgram) {
    //   WebGlProgramManager._useAndTellGlAboutMixedProgram(gl, this.mixedProgram)
    // }
    
    
    // if (this.mixedProgram) {
    //
    //   gl.useProgram(this.mixedProgram)
    //
    //   const coordAttributeLocation = gl.getAttribLocation(this.mixedProgram, "coordinates")
    //   gl.vertexAttribPointer(coordAttributeLocation, 2, gl.FLOAT, false, 32, 0)
    //   gl.enableVertexAttribArray(coordAttributeLocation)
    //
    //   // Tell webGL how to get rgba from our vertices array.
    //   // Tell webGL to read 4 floats from the vertex array for each vertex
    //   // and store them in my vec4 shader variable I've named "rgba"
    //   // Start after 8 bytes. (After the 2 floats for x and y)
    //   const rgbaAttributeLocation = gl.getAttribLocation(this.mixedProgram, "rgba")
    //   gl.vertexAttribPointer(rgbaAttributeLocation, 4, gl.FLOAT, false, 32, 8)
    //   gl.enableVertexAttribArray(rgbaAttributeLocation)
    //
    //
    //   // Tell webGL to read 2 floats from the vertex array for each vertex
    //   // and store them in my vec2 shader variable I've named "texPos"
    //   const textilsAttributeLocation = gl.getAttribLocation(this.mixedProgram, "textilsPos")
    //   gl.vertexAttribPointer(textilsAttributeLocation, 2, gl.FLOAT, false, 32, 24) // 4 bytes * 2:coords + 4 bytes * 4:color
    //   gl.enableVertexAttribArray(textilsAttributeLocation)
    // }
    //
    // Draw a wide rectangle.
    // this._drawRectangle(0,370, 200,50, 200,100,10,1)
    //
    // // Tell webGL to draw these triangle this frame.
    // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW)
    //
    // // Draw all the triangles.
    // gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length/8)
    //
    // // Clear vertices. We will fill it every frame.
    // // This way you don't need to delete objects from the screen. You just stop drawing them.
    // this.vertices = []
    
    // Draw the moving image.
    // const x = 250+Math.sin(Date.now()*.004)*250
    // const y = 200
    // const blue = 128 + Math.floor(Math.sin(Date.now()*.01) * 127)
    // const frame = (Date.now()/100)&1
    // this._drawImage(
    //   x, y, 100, 200,
    //   0, 255, blue, 1,
    //   frame*32,32, 32,32
    // )
    //
    // // Tell webGL to draw these triangle this frame.
    // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW)
    //
    // // Draw all the triangles.
    // gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length/8)
    //
    // // Clear vertices. We will fill it every frame.
    // // This way you don't need to delete objects from the screen. You just stop drawing them.
    // // this.vertices = []
    //
    // this.vertices = []
    //
    // // Tell webGL to read 2 floats from the vertex array for each vertex
    // // and store them in my vec2 shader variable I've named "coordinates"
    // // We need to tell it that each vertex takes 24 bytes now (6 floats)
    // if (this.colorProgram)
    // {
    //   WebGlProgramManager._useAndTellGlAboutColorProgram(gl, this.colorProgram)
    //
    //   // Tell webGL to draw these triangle this frame.
    //   // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.redSquare.vertices), gl.STATIC_DRAW)
    //
    //   // Draw all the triangles.
    //   // gl.drawArrays(gl.TRIANGLES, 0, this.redSquare.vertices.length/6)
    //   // gl.drawArrays(gl.TRIANGLES, 0, this.redSquare.getVerticesCount())
    // }
    
    
  }

  

  
  onKeyDown(code:string): void
  {
    // transfer events
    if (code === "KeyD") {
      this.onRight();
    }
    
    if (code === "KeyA") {
      this.onLeft();
    }
    
    if (code === "KeyS") {
      this.onDown();
    }
    
    if (code === "KeyQ") {
      this.onRotateCounterClockwise();
    }
    
    //
    if (code === "KeyE") {
      this.onRotateClockwise();
    }
    
    if (code === "Space") {
      
      // drop figure down
      this.onDrop();
    }
  }
  
  onKeyUp(code:string): void {
  
  }
  
  
  /**
   * Down figure
   */
  onDown()
  {
    if (this._cupRenderer)
    {
      // if figure does not have not moved we need to create a new one
      if (!this._cup.moveFigureDown())
      {
        
        // create a new figure
      }
      
      this._cupRenderer.renderCupWithFigure(this._cup)
    }
  }
  
  /**
   * Drop it almost as down but to the bottom
   */
  onDrop()
  {
    if (this._cupRenderer)
    {
      // if figure does not have not moved we need to create a new one
      if (!this._cup.dropFigureDown())
      {
        // clear next the down step time
        this._downTimer = 0;
        
        // create a new figure
      }
      
      this._cupRenderer.renderCupWithFigure(this._cup)
    }
  }
  
  onRotateClockwise () {
    if (this._cupRenderer)
    {
      // rotate figure in the cup
      this._cup.rotateClockwise();
      
      this._cupRenderer.renderCupWithFigure(this._cup)
    }
  }
  
  onRotateCounterClockwise () {
    if (this._cupRenderer)
    {
      // rotate figure in the cup
      this._cup.rotateCounterClockwise();
      
      // rerender
      this._cupRenderer.renderCupWithFigure(this._cup)
    }
  }
  
  onGameOver(): void {
    this._state = GameState.over
    
    // todo: do something on game over
    alert("game over")
    debugger
  }
  
  /**
   * Callback when line was cleared in the cup
   * @param countLines
   */
  onLineCleared(countLines: number): void {
    if (this.listener) this.listener.onLineCleared(countLines);
  }
  
  onRight() {
    if (this._cupRenderer && this._cup.moveFigureRight()){
      this._cupRenderer.renderCupWithFigure(this._cup)
    }
  }
  
  onLeft() {
    if (this._cupRenderer && this._cup.moveFigureLeft()){
      this._cupRenderer.renderCupWithFigure(this._cup)
    }
  }
}