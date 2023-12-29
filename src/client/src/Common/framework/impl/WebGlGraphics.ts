import {Graphics} from "../interfaces/Graphics";

/**
 * @version 0.0.1
 */
export class WebGlGraphics implements Graphics
{
  private _gl: WebGL2RenderingContext|null = null;
  
  public setGl(gl:WebGL2RenderingContext){
    this._gl = gl;
  }
  
  public getGl(): WebGL2RenderingContext {
    if (!this._gl) throw new Error("Gl is not inited")
    return this._gl;
  }
}
