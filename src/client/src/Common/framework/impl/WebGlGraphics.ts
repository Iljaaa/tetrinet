import {Graphics} from "../interfaces/Graphics";

/**
 * @version 0.0.1
 */
export class WebGlGraphics implements Graphics
{
  private _gl: WebGL2RenderingContext|null = null;
  
  /**
   * Web gl setter
   * @param gl
   */
  public setGl(gl:WebGL2RenderingContext){
    this._gl = gl;
  }
  
  /**
   * Get gl object
   */
  public getGl(): WebGL2RenderingContext {
    if (!this._gl) throw new Error("Gl is not inited")
    return this._gl;
  }
  
  // public useProgram ():void
  
  /**
   * Create shader
   * @param gl
   * @param type gl.VERTEX_SHADER or gl.FRAGMENT_SHADER
   * @param source
   */
  // public static createShader (gl:WebGL2RenderingContext, type:number, source:string):WebGLShader|null
  // {
  //   const shader:WebGLShader|null = gl.createShader(type);
  //   if (!shader) return null;
  //
  //   // создание шейдера
  //   gl.shaderSource(shader, source);      // устанавливаем шейдеру его программный код
  //   gl.compileShader(shader);             // компилируем шейдер
  //   const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  //   if (success) {                        // если компиляция прошла успешно - возвращаем шейдер
  //     return shader;
  //   }
  //
  //   console.error(gl.getShaderInfoLog(shader));
  //   gl.deleteShader(shader);
  //   return null;
  // }
  //
  // /**
  //  *
  //  * @param gl
  //  * @param vertexShader
  //  * @param fragmentShader
  //  */
  // public static createProgram = (gl:WebGL2RenderingContext, vertexShader:WebGLShader, fragmentShader:WebGLShader): WebGLProgram|null =>
  // {
  //   const program = gl.createProgram();
  //   if (!program) return null;
  //
  //   gl.attachShader(program, vertexShader);
  //   gl.attachShader(program, fragmentShader);
  //
  //   // when i comment this row it stop working at all
  //   gl.linkProgram(program);
  //
  //   const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  //   if (success) {
  //     return program;
  //   }
  //
  //   console.error(gl.getProgramInfoLog(program));
  //   gl.deleteProgram(program);
  //   return null;
  // }
  
}
