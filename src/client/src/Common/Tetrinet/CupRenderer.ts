import {Cup} from "./models/Cup";
import {CupWithFigure} from "./models/CupWithFigure";
import {Coords} from "./math/Coords";
import {Figure} from "./models/Figure";

const BLOCK_SIZE_PX = 32;

export class CupRenderer
{
  private readonly gl: WebGL2RenderingContext;
  private readonly program: WebGLProgram | null = null;
  
  /**
   * Pointer to location
   * @private
   */
  private readonly translationLocation: WebGLUniformLocation | null = null;
  
  /**
   * Pointer to color
   * @private
   */
  private readonly colorLocation: WebGLUniformLocation | null = null;
  
  /**
   * Pointer to texils coords
   * @private
   */
  private texCoordLocation: GLint;
  
  /**
   * Cap size in pixels
   * @private
   */
  private readonly cupWidth: number = 0;
  private readonly cupHeight: number = 0;
  
  
  private textureBuffer: WebGLBuffer | null;
  private postionBuffer: WebGLBuffer | null;
  private positionAttributeLocation: GLint;
  // private _aaaaat: WebGLTexture | null;
  
  /**
   * todo: again canvas get here content
   * todo: split on two classes, first will be render cup second figure
   * @param gl
   * @param cup
   */
  constructor(gl:WebGL2RenderingContext, cup:Cup)
  {

    this.gl = gl;
    
    // calculate cup size in pixels
    this.cupWidth = cup.getWidthInCells() * BLOCK_SIZE_PX;
    this.cupHeight = cup.getHeightInCells() * BLOCK_SIZE_PX;
    
    // webglUtils.resizeCanvasToDisplaySize(this.gl.canvas);
    
    // set viewport
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    
    // очищаем canvas
    this.gl.clearColor(1, 1, 0, 1);
    
    // create shaders
    // const vertexShader = this.createVertexShaderForColorTheme();
    const vertexShader = this.createVertexShaderWithTextils();
    if (!vertexShader) throw new Error("Vertex shader was not created")
   
    //
    // const fragmentShader = this.createFragmentShaderForColorTheme();
    const fragmentShader = this.createFragmentShaderWithTextils();
    if (!fragmentShader) throw new Error("Fragment shader was not created")
    
    // create program
    this.program = this.createProgram(this.gl, vertexShader, fragmentShader);
    if (!this.program) throw new Error("Fragment shader was not created")
    
    //
    
    /**
     * makes locations
     */
    
    // set resolution
    const resolutionUniformLocation = this.gl.getUniformLocation(this.program, "u_resolution");
    // this.gl.uniform2f(resolutionUniformLocation, this.gl.canvas.width, this.gl.canvas.height);
    // this.gl.uniform2f(resolutionUniformLocation, 1280, 1024);
    
    // pointer to textexure
    this.texCoordLocation = gl.getAttribLocation(this.program, "a_texCoord");
    
    // pointer to location
    this.translationLocation = this.gl.getUniformLocation(this.program, "u_translation");
    
    // link to color variable
    this.colorLocation = this.gl.getUniformLocation(this.program, "u_color");
    
    
    // use our programm with shades
    this.gl.useProgram(this.program)
    
    
    // it must go after this.gl.useProgram(this.program)
    this.gl.uniform2f(resolutionUniformLocation, 320, 640);
    
    
    
    
    // let positionBuffer = gl.createBuffer();
    this.postionBuffer = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.postionBuffer);
    
    // три двумерных точки, two triangles in square
    let positions = [
      0, 0,
      32, 0,
      0, 32,
      0, 32,
      32, 0,
      32, 32,
    ];
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.STATIC_DRAW);
    
    
    
    // provide texture coordinates for the rectangle.
    // var texcoordBuffer = gl.createBuffer();
    this.textureBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      0.0,  0.0,
      1.0,  0.0,
      0.0,  1.0,
      0.0,  1.0,
      1.0,  0.0,
      1.0,  1.0,
    ]), gl.STATIC_DRAW);

    // Create a texture.
    // this._aaaaat = gl.createTexture();
    // gl.bindTexture(gl.TEXTURE_2D, this._aaaaat);
    //
    // // Set the parameters so we can render any size image.
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    //
    // // Upload the image into the texture.
    // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, Assets.sprite.getImage());
    
    
    
    
    
    // point to position
    this.positionAttributeLocation = this.gl.getAttribLocation(this.program, "a_position");

    // Создаём буфер для хранения положений
    // var positionBuffer = this.gl.createBuffer();
    // Связываем его с ARRAY_BUFFER (можно сказать, что ARRAY_BUFFER = positionBuffer).
    // this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.gl.createBuffer());
    
    // this.setGeometry(this.gl, 0, 0);
    
    // set color of square
    // this.gl.uniform4f(this.colorLocation, 1, 0, 0, 1);
    
    
    // first F
    
    // this.gameLoop();
    
  }
  
  /**
   *
   * @private
   */
  private createVertexShaderForColorTheme ()
  {
    // Vertex shader source code.
    const vertCode =
      "attribute vec2 a_position;" +
      "uniform vec2 u_resolution;" +
      "uniform vec2 u_translation;" +
      "void main(void) {" +
      // We are passing in only 2D X,Y coordinates. Then Z is always 0.0 and the divisor is always 1.0
      " vec2 position = a_position + u_translation;" +
      " vec2 zeroToOne = position / u_resolution;" +
      " vec2 zeroToTwo = zeroToOne * 2.0;" +
      " vec2 clipSpace = zeroToTwo - 1.0;" +
      " gl_Position = vec4(clipSpace, 0, 1);" + // translate y
      // " gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);" + // trnslate y
      "}"
    
    return this.createShader(this.gl, this.gl.VERTEX_SHADER, vertCode);
    
  }
  /**
   *
   * @private
   */
  private createVertexShaderWithTextils ()
  {
    // Vertex shader source code.
    const vertCode =
      "attribute vec2 a_position;" +
      "attribute vec2 a_texCoord;" +
      "uniform vec2 u_resolution;" +
      "uniform vec2 u_translation;" +
      "varying vec2 v_texCoord;" +
      "void main(void) {" +
      // We are passing in only 2D X,Y coordinates. Then Z is always 0.0 and the divisor is always 1.0
      " vec2 position = a_position + u_translation;" +
      " vec2 zeroToOne = position / u_resolution;" +
      " vec2 zeroToTwo = zeroToOne * 2.0;" +
      " vec2 clipSpace = zeroToTwo - 1.0;" +
      " gl_Position = vec4(clipSpace, 0, 1);" + // translate y
      " v_texCoord = a_texCoord;" + // translate y
      // " gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);" + // trnslate y
      
      "}"
    
    return this.createShader(this.gl, this.gl.VERTEX_SHADER, vertCode);
    
  }
  
  /**
   * It creates fragment shader
   * @private
   */
  private createFragmentShaderForColorTheme () {
    // Fragment shader source code.
    const fragCode =
      "precision mediump float;" +
      "uniform vec4 u_color;" +
      "void main(void) {" +
      // We aren't passing in colors right now so all the triangles are green. G=1.0=full green.
      //" gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);" +
      " gl_FragColor = u_color;" +
      "}"
    
    return this.createShader(this.gl, this.gl.FRAGMENT_SHADER, fragCode);
  }
  
  /**
   * It creates fragment shader
   * @private
   */
  private createFragmentShaderWithTextils () {
    // Fragment shader source code.
    const fragCode =
      "precision mediump float;" +
      // "uniform vec4 u_color;" +
      "uniform sampler2D u_image;" +
      "varying vec2 v_texCoord;" +
      "void main(void) {" +
      //" gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);" +
      // " gl_FragColor = u_color;" +
      " gl_FragColor = texture2D(u_image, v_texCoord);" +
      "}"
    
    return this.createShader(this.gl, this.gl.FRAGMENT_SHADER, fragCode);
  }
  
  /**
   *
   * @param gl
   * @param type gl.VERTEX_SHADER or gl.FRAGMENT_SHADER
   * @param source
   */
  private createShader = (gl:WebGL2RenderingContext, type:number, source:string):WebGLShader|null =>
  {
    const shader:WebGLShader|null = gl.createShader(type);
    if (!shader) return null;
    
    // создание шейдера
    gl.shaderSource(shader, source);      // устанавливаем шейдеру его программный код
    gl.compileShader(shader);             // компилируем шейдер
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {                        // если компиляция прошла успешно - возвращаем шейдер
      return shader;
    }
    
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  
  /**
   *
   * @param gl
   * @param vertexShader
   * @param fragmentShader
   */
  createProgram = (gl:WebGL2RenderingContext, vertexShader:WebGLShader, fragmentShader:WebGLShader): WebGLProgram|null =>
  {
    const program = gl.createProgram();
    if (!program) return null;
    
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    
    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
      return program;
    }
  
    console.error(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  
  setGeometry = (gl:WebGL2RenderingContext, x:number, y:number) =>
  {
    const width = 100;
    const height = 150;
    const thickness = 30;
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        // вертикальный столб
        x, y,
        x + thickness, y,
        x, y + height,
        x, y + height,
        x + thickness, y,
        x + thickness, y + height,
        
        // верхняя перекладина
        x + thickness, y,
        x + width, y,
        x + thickness, y + thickness,
        x + thickness, y + thickness,
        x + width, y,
        x + width, y + thickness,
        
        // перекладина посередине
        x + thickness, y + thickness * 2,
        x + width * 2 / 3, y + thickness * 2,
        x + thickness, y + thickness * 3,
        x + thickness, y + thickness * 3,
        x + width * 2 / 3, y + thickness * 2,
        x + width * 2 / 3, y + thickness * 3,
      ]),
      gl.STATIC_DRAW);
  }
  
  /**
   * Render cup with figure
   * @param c
   */
  renderCupWithFigure (c: CupWithFigure)
  {
    if (!this.gl || !this.program) return;
    
    // render cup
    // this.renderCup(c);
    //
    // // render a figure if it presented
    // const f = c.getFigure();
    // if (f)
    // {
    //   // render figure
    //   this._renderFigure(this.gl, c, f);
    //
    //   //
    //   this._renderRotateField(this.gl, f.getPosition());
    // }
    //
    // //
    // this._renderDropPoint(this.gl, c.getDropPoint());
    //
    
    
  }
  
  renderCup(c: Cup)
  {
    // this.
    if (!this.gl || !this.program) return;
    
    // loop this method
    // window.requestAnimationFrame(this.gameLoop)
    
    // this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    
    // link to color variable
    // const colorUniformLocation = this.gl.getUniformLocation(this.program, "u_color");
    
    this._renderBackGround(this.gl);
    
    //
    this._renderField(this.gl, c)
    
  }
  
  /**
   * Render background
   * @param gl
   */
  private _renderBackGround(gl: WebGL2RenderingContext)
  {
    // set color of square
    // gl.uniform4f(this.colorLocation, 1, 0, 0, 1);
    
    // this.postionBuffer = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, this.postionBuffer);
    let positions = [
      0, 0,
      this.cupWidth, 0,
      0, this.cupHeight,
      0, this.cupHeight,
      this.cupWidth, 0,
      this.cupWidth, this.cupHeight,
    ];
    
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    
    this.gl.enableVertexAttribArray(this.positionAttributeLocation);
    
    this.gl.vertexAttribPointer(this.positionAttributeLocation, 2, this.gl.FLOAT, false, 0, 0)
    
    // move
    gl.uniform2fv(this.translationLocation, [0 ,0]);
    // gl.uniform2fv(this.translationLocation, [0 ,0]);
    
    
    // move to start
    // gl.uniform2fv(this.translationLocation, [0, 0]);
    
    
    
    // THIS IS CORRECT ORDER
    this.textureBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      0.0,  1.0,
      0.5,  1.0,
      0.0,  0.0,
      0.0,  0.0,
      0.5,  1.0,
      0.5,  0.0,
    ]), gl.STATIC_DRAW);
    
    // Create a texture.
    // var texture = gl.createTexture();
    // gl.bindTexture(gl.TEXTURE_2D, texture);
    //
    // // Set the parameters so we can render any size image.
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    //
    // // Upload the image into the texture.
    // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.texture.getImage());
    
    
    
    
    // Turn on the texcoord attribute
    gl.enableVertexAttribArray(this.texCoordLocation);
    
    // bind the texcoord buffer.
    // gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
    
    // Tell the texcoord attribute how to get data out of texcoordBuffer (ARRAY_BUFFER)
    gl.vertexAttribPointer(this.texCoordLocation, 2, gl.FLOAT, false, 0, 0);
    
    
    
    // draw here
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
  
  /**
   * Render field blocks
   * @param gl
   * @param cup
   */
  private _renderField (gl: WebGL2RenderingContext, cup:Cup)
  {
    // render blocks
    let positions2 = [
      0, 0,
      32, 0,
      0, 32,
      0, 32,
      32, 0,
      32, 32,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions2), gl.STATIC_DRAW);
    
    // set color of square
    gl.uniform4f(this.colorLocation, 0, 1, 0, 1);
    
    this.gl.enableVertexAttribArray(this.positionAttributeLocation);
    
    this.gl.vertexAttribPointer(this.positionAttributeLocation, 2, this.gl.FLOAT, false, 0, 0)
    
    this.textureBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      0.0,  0.0,
      1.0,  0.0,
      0.0,  1.0,
      0.0,  1.0,
      1.0,  0.0,
      1.0,  1.0,
    ]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(this.texCoordLocation);
    gl.vertexAttribPointer(this.texCoordLocation, 2, gl.FLOAT, false, 0, 0);
    
    
    // draw cup bodies
    const fields = cup.getFields()
    const len = fields.length;
    
    for (let i = 0; i < len; i++)
    {
      if (fields[i])
      {
        
        // bottom
        const row = Math.floor(i / cup.getWidthInCells());
        const bottom = row * BLOCK_SIZE_PX;
        
        const coll = i % cup.getWidthInCells();
        // const coll = i - (row * c.getWidthInCells());
        const left = coll * BLOCK_SIZE_PX;
        
        

        
        // move
        gl.uniform2fv(this.translationLocation, [left, bottom]);
        
        
        // draw here
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
    }
  }
  
  /**
   * This is for render any field
   * @param gl
   * @param c
   * @private
   */
  private _renderRotateField (gl: WebGL2RenderingContext, c:Coords)
  {
    // set color of square
    gl.uniform4f(this.colorLocation, .5, 1, .5, 1);
    
    // render blocks
    let positions2 = [
      0, 0,
      32, 0,
      0, 32,
      0, 32,
      32, 0,
      32, 32,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions2), gl.STATIC_DRAW);
  
    const bottom = c.y * BLOCK_SIZE_PX;
    const left = c.x * BLOCK_SIZE_PX;
    
    // move
    gl.uniform2fv(this.translationLocation, [left, bottom]);
    
    this.textureBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      0.0,  0.0,
      1.0,  0.0,
      0.0,  1.0,
      0.0,  1.0,
      1.0,  0.0,
      1.0,  1.0,
    ]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(this.texCoordLocation);
    gl.vertexAttribPointer(this.texCoordLocation, 2, gl.FLOAT, false, 0, 0);
    
    // draw here
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
  
  /**
   * This is for render any field
   * @param gl
   * @param c
   * @private
   */
  private _renderDropPoint (gl: WebGL2RenderingContext, c:Coords)
  {
    // set color of square
    gl.uniform4f(this.colorLocation, 1, 1, .5, 1);
    
    // render blocks
    let positions2 = [
      0, 0,
      32, 0,
      0, 32,
      0, 32,
      32, 0,
      32, 32,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions2), gl.STATIC_DRAW);
  
    const bottom = c.y * BLOCK_SIZE_PX;
    const left = c.x * BLOCK_SIZE_PX;
    
    // move
    gl.uniform2fv(this.translationLocation, [left, bottom]);
    
    
    this.textureBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      0.0,  0.0,
      1.0,  0.0,
      0.0,  1.0,
      0.0,  1.0,
      1.0,  0.0,
      1.0,  1.0,
    ]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(this.texCoordLocation);
    gl.vertexAttribPointer(this.texCoordLocation, 2, gl.FLOAT, false, 0, 0);
    
    // draw here
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
  
  /**
   * Render figure field
   * @param gl
   * @param cup
   * @param f
   */
  private _renderFigure (gl: WebGL2RenderingContext, cup:Cup, f: Figure)
  {
    // set color of square
    // gl.uniform4f(this.colorLocation, 0, 0, 1, 1);
    
    this.textureBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      0.0,  0.0,
      1.0,  0.0,
      0.0,  1.0,
      0.0,  1.0,
      1.0,  0.0,
      1.0,  1.0,
    ]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(this.texCoordLocation);
    gl.vertexAttribPointer(this.texCoordLocation, 2, gl.FLOAT, false, 0, 0);
    
    const fields = (f) ? f.getFields() : [];
    const len = fields.length;
    for (let r = 0; r < len; r++)
    {
      const cellIndex = fields[r]
      
      // this is position of figure
      // let positionRow = 10;
      // let positionCol = 5;
      // let left = positionCol * BLOCK_SIZE_PX + l * BLOCK_SIZE_PX
      // let bottom = positionRow * BLOCK_SIZE_PX + r * BLOCK_SIZE_PX
      
      const c:Coords = cup.getCoordsByIndex(cellIndex);
      
      const bottom = c.y * BLOCK_SIZE_PX;
      const left = c.x * BLOCK_SIZE_PX;
      
      // bottom
      // const row = Math.floor(cellIndex / c.getWidthInCells());
      // const bottom = row * BLOCK_SIZE_PX;
      //
      // const cell = cellIndex % c.getWidthInCells();
      // const left = cell * BLOCK_SIZE_PX;
      
      // move
      gl.uniform2fv(this.translationLocation, [left, bottom]);
      
      // draw here
      gl.drawArrays(gl.TRIANGLES, 0, 18);
    }
  }
}
