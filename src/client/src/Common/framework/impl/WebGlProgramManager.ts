
/**
 * This is all about WebGlPrograms
 */
export class WebGlProgramManager
{
  
  /**
   * Mixed program instance
   * @private
   */
  private static mixedProgram: WebGLProgram|null = null;
  
  /**
   * Texture program
   * @private
   */
  private static textureProgram: WebGLProgram|null = null;
  
  /**
   * Color program
   * @private
   */
  private static colorProgram: WebGLProgram|null = null;
  
  /**
   * Create and get the mixed program
   */
  public static getMixedProgram(gl:WebGL2RenderingContext): WebGLProgram
  {
    if (WebGlProgramManager.mixedProgram) return WebGlProgramManager.mixedProgram
    
    // create new
    WebGlProgramManager.mixedProgram = WebGlProgramManager._createMixedProgram(gl);
    
    // use program
    WebGlProgramManager._useMixedProgram(gl, WebGlProgramManager.mixedProgram)
    
    return WebGlProgramManager.mixedProgram;
  }
  
  /**
   *
   */
  public static getTextureProgram (gl:WebGL2RenderingContext): WebGLProgram
  {
    if (WebGlProgramManager.textureProgram) return WebGlProgramManager.textureProgram
    
    WebGlProgramManager.textureProgram = WebGlProgramManager._createTextureProgram(gl);
    
    // use program
    WebGlProgramManager._startUseTextureProgram(gl, WebGlProgramManager.textureProgram)
    
    return WebGlProgramManager.textureProgram;
  }
  
  /**
   *
   */
  public static getColorProgram (gl:WebGL2RenderingContext): WebGLProgram
  {
    if (WebGlProgramManager.colorProgram) return WebGlProgramManager.colorProgram
    
    WebGlProgramManager.colorProgram = WebGlProgramManager._createColorProgram(gl);
    
    // use program
    WebGlProgramManager._useColorProgram(gl, WebGlProgramManager.colorProgram)
    
    return WebGlProgramManager.colorProgram;
  }
  
  /**
   * Enable texture program
   * @param gl
   */
  public static sUseTextureProgram(gl:WebGL2RenderingContext):void {
    WebGlProgramManager._startUseTextureProgram(gl, WebGlProgramManager.getTextureProgram(gl));
  }
  
  /**
   * Write into texture program image size
   */
  public static setUpIntoMixedProgramImageSize (gl:WebGL2RenderingContext, width:number, height:number):void
  {
    if (!WebGlProgramManager.mixedProgram) return;
    const textureSizeLocation:WebGLUniformLocation|null = gl.getUniformLocation(WebGlProgramManager.mixedProgram, "texSize");
    gl.uniform2f(textureSizeLocation, width, height)
  }
  
  /**
   * Write into texture program image size
   */
  public static setUpIntoTextureProgramImageSize (gl:WebGL2RenderingContext, width:number, height:number):void
  {
    if (!WebGlProgramManager.textureProgram) return;
    const textureSizeLocation:WebGLUniformLocation|null = gl.getUniformLocation(WebGlProgramManager.textureProgram, "texSize");
    gl.uniform2f(textureSizeLocation, width, height)
  }
  
  /**
   * White into texture program base translation
   */
  public static setUpIntoTextureProgramTranslation (gl:WebGL2RenderingContext, x:number, y:number): void{
    if (!WebGlProgramManager.textureProgram) return;
    const textureSizeLocation:WebGLUniformLocation|null = gl.getUniformLocation(WebGlProgramManager.textureProgram, "translation");
    gl.uniform2f(textureSizeLocation, x, y)
  }
  
  /**
   * This program include and color and texils
   */
  private static _createMixedProgram (gl:WebGL2RenderingContext):WebGLProgram
  {
    // Vertex shader source code.
    const vertCode =
      // describe position in vertices array
      "attribute vec2 coordinates;" +
      
      // describe color position in vertices array
      "attribute vec4 rgba;" +
      
      // describe texture position in vertices array
      "attribute vec2 textilsPos;" +
      
      // var to pass color into fragment shader
      "varying highp vec4 rgbaForFrag;" +
      
      // var tp pass textils coords to fragment shader
      "varying highp vec2 texPosForFrag;" +
      
      // canvas size, used to map local coords to pixels
      "uniform vec2 canvasSize;" +
      
      // texture size
      "uniform vec2 texSize;" +
      
      // translation
      "uniform vec2 translation;" +
      
      "void main(void) {" +
      // create and move position
      " vec2 drawPos = coordinates + translation;" +
      // Divide the pixel position by our current canvas size, because webGL wants a number from -1 to 1
      " drawPos = drawPos / canvasSize * 2.0;" +
      // We are passing in only 2D coordinates. Then Z is always 0.0 and the divisor is always 1.0
      " gl_Position = vec4(drawPos.x - 1.0, drawPos.y - 1.0, 0.0, 1.0);" +
      // Pass the color and transparency to the fragment shader.
      " rgbaForFrag = vec4(rgba.xyz / 255.0, rgba.w);" +
      // Pass the texture position to the fragment shader.
      // WebGL wants numbers from 0 to 1, but we are passing in pixel positions.
      " texPosForFrag = textilsPos / texSize;" +
      "}"
    
    // Create a vertex shader object.
    // let vertShader = gl.createShader(gl.VERTEX_SHADER)
    let vertShader = WebGlProgramManager.createShader(gl, gl.VERTEX_SHADER, vertCode)
    if (!vertShader) throw new Error("vertShader was not created");
    // gl.shaderSource(vertShader, vertCode)
    // gl.compileShader(vertShader)
    
    // Fragment shader source code.
    var fragCode =
      // color var from vertex function
      "varying highp vec4 rgbaForFrag;" +
      // texture var from vertex function
      "varying highp vec2 texPosForFrag;" +
      "uniform sampler2D sampler;" +
      "void main(void) {" +
      " gl_FragColor = texture2D(sampler, texPosForFrag) * rgbaForFrag;" +
      "}"
    
    // Create fragment shader object.
    //var fragShader = gl.createShader(gl.FRAGMENT_SHADER)
    
    let fragShader = WebGlProgramManager.createShader(gl, gl.FRAGMENT_SHADER, fragCode)
    if (!fragShader) throw new Error("fragCode was not created");
    // gl.shaderSource(fragShader, fragCode)
    // gl.compileShader(fragShader)
    
    // Tell webGL to use both my shaders.
    // let shaderProgram = gl.createProgram()
    const program = WebGlProgramManager.createProgram(gl, vertShader, fragShader)
    if (!program) throw new Error("Program was not created");
    
    // Tell webGL to read 2 floats from the vertex array for each vertex
    // and store them in my vec2 shader variable I've named "coordinates"
    // We need to tell it that each vertex takes 24 bytes now (6 floats)
    // const coordAttributeLocation  = gl.getAttribLocation(program, "coordinates")
    // gl.vertexAttribPointer(coordAttributeLocation, 2, gl.FLOAT, false, 32, 0)
    // gl.enableVertexAttribArray(coordAttributeLocation)
    
    // Tell webGL how to get rgba from our vertices array.
    // Tell webGL to read 4 floats from the vertex array for each vertex
    // and store them in my vec4 shader variable I've named "rgba"
    // Start after 8 bytes. (After the 2 floats for x and y)
    // const rgbaAttributeLocation = gl.getAttribLocation(program, "rgba")
    // gl.vertexAttribPointer(rgbaAttributeLocation, 4, gl.FLOAT, false, 32, 8)
    // gl.enableVertexAttribArray(rgbaAttributeLocation)
    
    // Tell webGL to read 2 floats from the vertex array for each vertex
    // and store them in my vec2 shader variable I've named "texPos"
    // const textilsAttributeLocation = gl.getAttribLocation(program, "textilsPos")
    // gl.vertexAttribPointer(textilsAttributeLocation, 2, gl.FLOAT, false, 32, 24) // 4 bytes * 2:coords + 4 bytes * 4:color
    // gl.enableVertexAttribArray(textilsAttributeLocation)
    
    return program
  }
  
  /**
   *
   */
  private static _useMixedProgram (gl:WebGL2RenderingContext, program:WebGLProgram ):void
  {
    gl.useProgram(program)
    
    // Tell webGL to read 2 floats from the vertex array for each vertex
    // and store them in my vec2 shader variable I've named "coordinates"
    // We need to tell it that each vertex takes 24 bytes now (6 floats)
    const coordAttributeLocation  = gl.getAttribLocation(program, "coordinates")
    gl.vertexAttribPointer(coordAttributeLocation, 2, gl.FLOAT, false, 32, 0)
    gl.enableVertexAttribArray(coordAttributeLocation)
    
    // Tell webGL how to get rgba from our vertices array.
    // Tell webGL to read 4 floats from the vertex array for each vertex
    // and store them in my vec4 shader variable I've named "rgba"
    // Start after 8 bytes. (After the 2 floats for x and y)
    const rgbaAttributeLocation = gl.getAttribLocation(program, "rgba")
    gl.vertexAttribPointer(rgbaAttributeLocation, 4, gl.FLOAT, false, 32, 8)
    gl.enableVertexAttribArray(rgbaAttributeLocation)
    
    // Tell webGL to read 2 floats from the vertex array for each vertex
    // and store them in my vec2 shader variable I've named "texPos"
    const textilsAttributeLocation = gl.getAttribLocation(program, "textilsPos")
    gl.vertexAttribPointer(textilsAttributeLocation, 2, gl.FLOAT, false, 32, 24) // 4 bytes * 2:coords + 4 bytes * 4:color
    gl.enableVertexAttribArray(textilsAttributeLocation)
    
    // Set shader variable for canvas size. It's a vec2 that holds both width and height.
    const canvasSizeLocation:WebGLUniformLocation|null = gl.getUniformLocation(program, "canvasSize");
    gl.uniform2f(canvasSizeLocation, gl.canvas.width, gl.canvas.height)
  }
  
  /**
   * This program include and color and texils
   */
  private static _createTextureProgram (gl:WebGL2RenderingContext):WebGLProgram
  {
    // Vertex shader source code.
    const vertCode =
      // describe position in vertices array
      "attribute vec2 coordinates;" +
      
      // describe texture position in vertices array
      "attribute vec2 textilsPos;" +
      
      // var tp pass textils coords to fragment shader
      "varying highp vec2 texPosForFrag;" +
      
      // canvas size, used to map local coords to pixels
      "uniform vec2 canvasSize;" +
      
      // texture size
      "uniform vec2 texSize;" +
      
      // translation
      "uniform vec2 translation;" +
      
      "void main(void) {" +
      // create and move position
      " vec2 drawPos = coordinates + translation;" +
      // Divide the pixel position by our current canvas size, because webGL wants a number from -1 to 1
      " drawPos = drawPos / canvasSize * 2.0;" +

      // We are passing in only 2D coordinates. Then Z is always 0.0 and the divisor is always 1.0
      // " gl_Position = vec4(drawPos.x - 1.0, drawPos.y - 1.0, 0.0, 1.0);" +

      // this made all upside down
      " gl_Position = vec4(drawPos.x - 1.0, -1.0 * (drawPos.y - 1.0), 0.0, 1.0);" +

        // Pass the texture position to the fragment shader.
      // WebGL wants numbers from 0 to 1, but we are passing in pixel positions.
      " texPosForFrag = textilsPos / texSize;" +
      // " texPosForFrag = vec2(textilsPos.x / texSize.x, (1.0 - textilsPos.y) / texSize.y);" +

      "}"
    
    // Create a vertex shader object.
    let vertShader = WebGlProgramManager.createShader(gl, gl.VERTEX_SHADER, vertCode)
    if (!vertShader) throw new Error("vertShader was not created");
    
    // shader rotated by top
    //const fragCode =
    //   // texture var from vertex function
    //   "precision highp float;" +
    //   "varying highp vec2 texPosForFrag;" +
    //   "uniform sampler2D sampler;" +
    //   "void main(void) {" +
    //   " vec2 texCoord = vec2(texPosForFrag.x, 1.0 - texPosForFrag.y);" +
    //   " gl_FragColor = texture2D(sampler, texCoord);" +
    //   "}"

    // Fragment shader source code.
    const fragCode =
      "varying highp vec2 texPosForFrag;" +
      "uniform sampler2D sampler;" +
      "void main(void) {" +
      " gl_FragColor = texture2D(sampler, texPosForFrag);" +
      "}"

    // Create fragment shader object.
    //var fragShader = gl.createShader(gl.FRAGMENT_SHADER)
    
    let fragShader = WebGlProgramManager.createShader(gl, gl.FRAGMENT_SHADER, fragCode)
    if (!fragShader) throw new Error("fragCode was not created");
    
    // Tell webGL to use both my shaders.
    // let shaderProgram = gl.createProgram()
    const program = WebGlProgramManager.createProgram(gl, vertShader, fragShader)
    if (!program) throw new Error("Program was not created");
    
    return program
  }
  
  /**
   *
   */
  private static _startUseTextureProgram (gl:WebGL2RenderingContext, program:WebGLProgram )
  {
    gl.useProgram(program)
    
    // Tell webGL to read 2 floats from the vertex array for each vertex
    // and store them in my vec2 shader variable I've named "coordinates"
    // We need to tell it that each vertex takes 24 bytes now (6 floats)
    const coordAttributeLocation  = gl.getAttribLocation(program, "coordinates")
    gl.vertexAttribPointer(coordAttributeLocation, 2, gl.FLOAT, false, 16, 0)
    gl.enableVertexAttribArray(coordAttributeLocation)
    
    // Tell webGL to read 2 floats from the vertex array for each vertex
    // and store them in my vec2 shader variable I've named "texPos"
    const textilsAttributeLocation = gl.getAttribLocation(program, "textilsPos")
    gl.vertexAttribPointer(textilsAttributeLocation, 2, gl.FLOAT, false, 16, 8)
    gl.enableVertexAttribArray(textilsAttributeLocation)
    
    // Set shader variable for canvas size. It's a vec2 that holds both width and height.
    const canvasSizeLocation:WebGLUniformLocation|null = gl.getUniformLocation(program, "canvasSize");
    gl.uniform2f(canvasSizeLocation, gl.canvas.width, gl.canvas.height)
  }
  
  
  /**
   * This program include only color coordinates
   */
  private static _createColorProgram (gl:WebGL2RenderingContext):WebGLProgram
  {
    // Vertex shader source code.
    const vertCode =
      // describe position in vertices array
      "attribute vec2 coordinates;" +
      
      // describe color position in vertices array
      "attribute vec4 rgba;" +
      
      // var to pass color into fragment shader
      "varying highp vec4 rgbaForFrag;" +
      
      // canvas size, used to map local coords to pixels
      "uniform vec2 canvasSize;" +
      
      // translation
      "uniform vec2 translation;" +
      
      "void main(void) {" +
      // create and move position
      " vec2 drawPos = coordinates + translation;" +
      // Divide the pixel position by our current canvas size, because webGL wants a number from -1 to 1
      " drawPos = coordinates / canvasSize * 2.0;" +
      // We are passing in only 2D coordinates. Then Z is always 0.0 and the divisor is always 1.0
      " gl_Position = vec4(drawPos.x - 1.0, drawPos.y - 1.0, 0.0, 1.0);" +
      // Pass the color and transparency to the fragment shader.
      " rgbaForFrag = vec4(rgba.xyz / 255.0, rgba.w);" +
      "}"
    
    // Create a vertex shader object.
    let vertShader = WebGlProgramManager.createShader(gl, gl.VERTEX_SHADER, vertCode)
    if (!vertShader) throw new Error("vertShader was not created");
    
    // Fragment shader source code.
    var fragCode =
      // color var from vertex function
      "varying highp vec4 rgbaForFrag;" +
      "void main(void) {" +
      " gl_FragColor = rgbaForFrag;" +
      "}"
    
    // Create fragment shader object.
    let fragShader = WebGlProgramManager.createShader(gl, gl.FRAGMENT_SHADER, fragCode)
    if (!fragShader) throw new Error("fragCode was not created");
    
    // Tell webGL to use both my shaders.
    // let shaderProgram = gl.createProgram()
    const program = WebGlProgramManager.createProgram(gl, vertShader, fragShader)
    if (!program) throw new Error("Program was not created");
    
    // Tell webGL to read 2 floats from the vertex array for each vertex
    // and store them in my vec2 shader variable I've named "coordinates"
    // We need to tell it that each vertex takes 24 bytes now (6 floats)
    // const coordAttributeLocation  = gl.getAttribLocation(program, "coordinates")
    // gl.vertexAttribPointer(coordAttributeLocation, 2, gl.FLOAT, false, 24, 0)
    // gl.enableVertexAttribArray(coordAttributeLocation)
    
    // Tell webGL how to get rgba from our vertices array.
    // Tell webGL to read 4 floats from the vertex array for each vertex
    // and store them in my vec4 shader variable I've named "rgba"
    // Start after 8 bytes. (After the 2 floats for x and y)
    // const rgbaAttributeLocation = gl.getAttribLocation(program, "rgba")
    // gl.vertexAttribPointer(rgbaAttributeLocation, 4, gl.FLOAT, false, 24, 8)
    // gl.enableVertexAttribArray(rgbaAttributeLocation)
    
    return program
  }
  
  /**
   *
   * @param gl
   * @param program
   */
  private static _useColorProgram (gl:WebGL2RenderingContext, program:WebGLProgram)
  {
    gl.useProgram(program)
    
    // Tell webGL to read 2 floats from the vertex array for each vertex
    // and store them in my vec2 shader variable I've named "coordinates"
    // We need to tell it that each vertex takes 24 bytes now (6 floats)
    const coordAttributeLocation  = gl.getAttribLocation(program, "coordinates")
    gl.vertexAttribPointer(coordAttributeLocation, 2, gl.FLOAT, false, 24, 0)
    gl.enableVertexAttribArray(coordAttributeLocation)
    
    // Tell webGL how to get rgba from our vertices array.
    // Tell webGL to read 4 floats from the vertex array for each vertex
    // and store them in my vec4 shader variable I've named "rgba"
    // Start after 8 bytes. (After the 2 floats for x and y)
    const rgbaAttributeLocation = gl.getAttribLocation(program, "rgba")
    gl.vertexAttribPointer(rgbaAttributeLocation, 4, gl.FLOAT, false, 24, 8)
    gl.enableVertexAttribArray(rgbaAttributeLocation)
    
    // Set shader variable for canvas size. It's a vec2 that holds both width and height.
    const canvasSizeLocation:WebGLUniformLocation|null = gl.getUniformLocation(program, "canvasSize");
    gl.uniform2f(canvasSizeLocation, gl.canvas.width, gl.canvas.height)
  }
  
  
  /**
   * Create shader
   * @param gl
   * @param type gl.VERTEX_SHADER or gl.FRAGMENT_SHADER
   * @param source
   */
  private static createShader (gl:WebGL2RenderingContext, type:number, source:string):WebGLShader|null
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
  private static createProgram = (gl:WebGL2RenderingContext, vertexShader:WebGLShader, fragmentShader:WebGLShader): WebGLProgram|null =>
  {
    const program = gl.createProgram();
    if (!program) return null;
    
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    
    // when i comment this row it stop working at all
    gl.linkProgram(program);
    
    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
      return program;
    }
    
    console.error(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  
}
