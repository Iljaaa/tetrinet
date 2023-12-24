import {Cup} from "./models/Cup";
import {CapWithFigure} from "./models/CupWithFigure";
import {Coords} from "./math/Coords";
import {Figure} from "./models/Figure";
import {Texture} from "../framework/Texture";

const BLOCK_SIZE_PX = 32;

export class CapRenderer
{
  private readonly gl: null | WebGL2RenderingContext;
  private readonly program: WebGLProgram | null = null;
  
  
  private readonly translationLocation: WebGLUniformLocation | null = null;
  
  private readonly colorLocation: WebGLUniformLocation | null = null;
  
  /**
   * Cap size in pixels
   * @private
   */
  private readonly cupWidth: number = 0;
  private readonly cupHeight: number = 0;
  
  /**
   * Texure
   * @private
   */
  private texture: Texture;
  
  /**
   * todo: again canvas get here content
   * todo: split on two classes, first will be render cup second
   * todo: move texture to asses class
   * @param canvas
   * @param cup
   */
  constructor(canvas:HTMLCanvasElement, cup:Cup, texture:Texture)
  {
    console.log('CapRenderer.constructor')
    
    // save texture
    this.texture = texture;
    
    // let canvas = document.querySelector("#canvas") as HTMLCanvasElement;
    
    // todo: move making ths context upper to methods, in game initialization
    this.gl = !(canvas) ? null : canvas.getContext("webgl2");
    if (!this.gl) return;
    
    // calculate cup size in pixels
    this.cupWidth = cup.getWidthInCells() * BLOCK_SIZE_PX;
    this.cupHeight = cup.getHeightInCells() * BLOCK_SIZE_PX;
    
    // webglUtils.resizeCanvasToDisplaySize(this.gl.canvas);
    
    // set viewport
    // this.gl.viewport(0, 0, 640, 640);
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    
    // очищаем canvas
    this.gl.clearColor(1, 1, 0, 1);
    
    
    // const vertexSource = <HTMLScriptElement> document.querySelector("#vertex-shader-2d");
    // const vertexShaderSource:string = (vertexSource) ? vertexSource.text : '';
    //
    // const fragmentSourceElement = <HTMLScriptElement> document.querySelector("#fragment-shader-2d")
    // const fragmentShaderSource:string = (fragmentSourceElement) ? fragmentSourceElement.text : '';
    
    // Vertex shader source code.
    var vertCode =
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
    
    
    const vertexShader = this.createShader(this.gl, this.gl.VERTEX_SHADER, vertCode);
    if (!vertexShader) return;
    
    // Fragment shader source code.
    var fragCode =
      "precision mediump float;" +
      "uniform vec4 u_color;" +
      "void main(void) {" +
      // We aren't passing in colors right now so all the triangles are green. G=1.0=full green.
      //" gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);" +
      " gl_FragColor = u_color;" +
      "}"
    
    const fragmentShader = this.createShader(this.gl, this.gl.FRAGMENT_SHADER, fragCode);
    if (!fragmentShader) return;
    
    this.program = this.createProgram(this.gl, vertexShader, fragmentShader);
    if (!this.program) return;
    
    // Use our boilerplate utils to compile the shaders and link into a program
    // var program = webglUtils.createProgramFromScripts(this.gl, ["vertex-shader-2d", "fragment-shader-2d"]);
    
    // говорим использовать нашу программу (пару шейдеров)
    this.gl.useProgram(this.program)
    
    
    // set resolution
    const resolutionUniformLocation = this.gl.getUniformLocation(this.program, "u_resolution");
    // this.gl.uniform2f(resolutionUniformLocation, this.gl.canvas.width, this.gl.canvas.height);
    // this.gl.uniform2f(resolutionUniformLocation, 1280, 1024);
    this.gl.uniform2f(resolutionUniformLocation, 320, 640);
    
    
    // point to position
    // const positionAttributeLocation = this.gl.getAttribLocation(this.program, "a_position");
    // this.gl.enableVertexAttribArray(positionAttributeLocation);
    
    
    // Указываем атрибуту, как получать данные от positionBuffer (ARRAY_BUFFER)
    // var size = 2;          // 2 компоненты на итерацию
    // var type = this.gl.FLOAT;   // наши данные - 32-битные числа с плавающей точкой
    // var normalize = false; // не нормализовать данные
    // var stride = 0;        // 0 = перемещаться на size * sizeof(type) каждую итерацию для получения следующего положения
    // var offset = 0;        // начинать с начала буфера
    //this.gl.vertexAttribPointer(positionAttributeLocation, 2, this.gl.FLOAT, false, 0, 0)
    
    
    // pointer to location
    this.translationLocation = this.gl.getUniformLocation(this.program, "u_translation");
    
    
    // link to color variable
    this.colorLocation = this.gl.getUniformLocation(this.program, "u_color");
    
    // let positionBuffer = gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.gl.createBuffer());
    
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
    
    
    // point to position
    const positionAttributeLocation = this.gl.getAttribLocation(this.program, "a_position");
    this.gl.enableVertexAttribArray(positionAttributeLocation);
    
    this.gl.vertexAttribPointer(positionAttributeLocation, 2, this.gl.FLOAT, false, 0, 0)
    
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
   * @param gl
   * @param type gl.VERTEX_SHADER or gl.FRAGMENT_SHADER
   * @param source
   */
  createShader = (gl:WebGL2RenderingContext, type:number, source:string):WebGLShader|null =>
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
  renderCupWithFigure (c: CapWithFigure)
  {
    if (!this.gl || !this.program) return;
    
    // render cup
    this.renderCup(c);
    
    // render a figure if it presented
    const f = c.getFigure();
    if (f)
    {
      // render figure
      this._renderFigure(this.gl, c, f);
      
      //
      this._renderRotateField(this.gl, f.getPosition());
    }
    
    //
    this._renderDropPoint(this.gl, c.getDropPoint());
    
    
    // provide texture coordinates for the rectangle.
    var texcoordBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, texcoordBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([
      0.0,  0.0,
      1.0,  0.0,
      0.0,  1.0,
      0.0,  1.0,
      1.0,  0.0,
      1.0,  1.0,
    ]), this.gl.STATIC_DRAW);
    
    // Create a texture.
    var texture = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    
    // Set the parameters so we can render any size image.
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
    
    // Upload the image into the texture.
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.texture.getImage());
    
    
    // Draw the rectangle.
    var primitiveType = this.gl.TRIANGLES;
    var offset = 0;
    var count = 6;
    this.gl.drawArrays(primitiveType, offset, count);
    
  }
  
  renderCup(c: Cup)
  {
    // this.
    if (!this.gl || !this.program) return;
    
    // loop this method
    // window.requestAnimationFrame(this.gameLoop)
    
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    
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
    gl.uniform4f(this.colorLocation, 1, 0, 0, 1);
    
    // render background
    // три двумерных точки, two triangles in square
    let positions = [
      0, 0,
      this.cupWidth, 0,
      0, this.cupHeight,
      0, this.cupHeight,
      this.cupWidth, 0,
      this.cupWidth, this.cupHeight,
    ];
    
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    
    // move to start
    gl.uniform2fv(this.translationLocation, [0, 0]);
    
    // draw here
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
  
  /**
   * Render field blocks
   * @param gl
   * @param cup
   */
  _renderField (gl: WebGL2RenderingContext, cup:Cup)
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
    gl.uniform4f(this.colorLocation, 0, 0, 1, 1);
    
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
      
      // console.log(cellIndex, left, bottom, row, c.getHeightInCells())
      
      // move
      gl.uniform2fv(this.translationLocation, [left, bottom]);
      
      // draw here
      gl.drawArrays(gl.TRIANGLES, 0, 18);
    }
  }
}
