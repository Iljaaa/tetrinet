import {WebGlProgramManager} from "./WebGlProgramManager";

/**
 * this is texture with generate by static canvas
 * @version 0.0.1
 */
export abstract class WebGlGeneratedTexture
{

  /**
   * Width in pixels
   */
  public abstract getWidth(): number;

  /**
   * Height in pixels
   */
  public abstract getHeight(): number;

  /**
   * This is index of texture
   * @private
   */
  private textureIndex?: number;

  /**
   * Inited texture id
   */
  private textureId: WebGLTexture | null = null;

  /**
   *
   * @private
   */
  private canvas:HTMLCanvasElement

  /**
   * Context
   */
  protected context:CanvasRenderingContext2D

  constructor()
  {

    this.canvas = document.createElement('canvas');
    this.canvas.width = this.getWidth()
    this.canvas.height = this.getHeight()

    let context = this.canvas.getContext('2d');
    if (!context) throw new Error('2d context not creates')
    this.context = context

    // generate context
    // this.context = this.generateContext(this.width, this.height)
  }

  
  // getImage(): HTMLImageElement {
  //   return this.image;
  // }

  
  /**
   * Bind texture into gl
   * @param gl
   * @param textureIndex
   */
  init(gl:WebGL2RenderingContext, textureIndex:number): void
  {
    if (!this.context){
      throw new Error('Content not generated')
    }

    this.textureIndex = textureIndex;

    // now it not do anything, but when we will be use different textures
    // gl.activeTexture(gl.TEXTURE0)
    // gl.activeTexture(this.textureIndex)
    this.textureId = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, this.textureId)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.canvas)

    // Tell gl that when draw images scaled up, smooth it.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)

    // gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, null)
    // gl.activeTexture(this.textureIndex)

  }

  /**
   * @param width
   * @param height
   * @private
   */
  // private generateContext (width:number, height:number):CanvasRenderingContext2D
  // {
  //   let canvas:HTMLCanvasElement = document.createElement('canvas');
  //   canvas.width = width
  //   canvas.height = height
  //   let context = canvas.getContext('2d');
  //   if (!context) throw new Error('2d context not creates')
  //   return context
  // }

  /**
   * Bind texurei into gl
   * @param gl
   */
  bind(gl:WebGL2RenderingContext): void
  {
    if (!this.textureId){
      throw new Error('Texture was not init')
    }

    if (this.textureIndex === undefined) {
      alert ('textureIndexUndefined');
      return;
    }

    //gl.activeTexture(this.textureIndex)
    gl.bindTexture(gl.TEXTURE_2D, this.textureId)

    WebGlProgramManager.setUpIntoTextureProgramImageSize(gl, this.getWidth(), this.getHeight());
  }
}
