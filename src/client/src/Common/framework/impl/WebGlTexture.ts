import {WebGlProgramManager} from "./WebGlProgramManager";

/**
 * this is texture with was loaded by url
 * @version 0.0.2
 */
export class WebGlTexture
{
  /**
   * Image url
   * @private
   */
  private url:string|undefined;
  
  /**
   */
  private readonly image: HTMLImageElement;

  /**
   * This is index of texture
   * @private
   */
  private textureIndex?: number;

  /**
   * Inited texture
   * @private
   */
  private textureId: WebGLTexture | null = null;


  /**
   *
   */
  constructor()
  {
    this.image = new Image();
  }
  
  /**
   * Load image and call method after load
   * @param url
   * @param onLoad
   */
  load(url: string, onLoad:(url:string)=>void): void
  {
    this.url = url;
    
    this.image.crossOrigin = "anonymous" // this line enables a cross origin request
    this.image.src = this.url; // "https://webglfundamentals.org/webgl/resources/leaves.jpg";  // ДОЛЖНА НАХОДИТЬСЯ НА ТОМ ЖЕ ДОМЕНЕ!!!
    this.image.onload = () => {
      onLoad(url);
    }
  }
  
  // getImage(): HTMLImageElement {
  //   return this.image;
  // }

  getHeight(): number {
    return this.image.height;
  }

  getWidth(): number {
    return this.image.width;
  }
  
  /**
   * Bind texture into gl
   * @param gl
   * @param textureIndex
   */
  init(gl:WebGL2RenderingContext, textureIndex:number): void
  {
    this.textureIndex = textureIndex;

    // now it not do anything, but when we will be use different textures
    // gl.activeTexture(gl.TEXTURE0)
    // gl.activeTexture(this.textureIndex)
    this.textureId = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, this.textureId)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.image)
    
    // Tell gl that when draw images scaled up, smooth it.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)

    // gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, null)
    // gl.activeTexture(this.textureIndex)

  }

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
      alert ('textureIndexUndefines');
      return;
    }

    // now it not do anything, but when we will be use different textures
    // gl.activeTexture(gl.TEXTURE0)
    // gl.activeTexture(this.textureIndex)
    gl.bindTexture(gl.TEXTURE_2D, this.textureId)
    // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.image)
    //
    // // Tell gl that when draw images scaled up, smooth it.
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)

    // gl.activeTexture(gl.TEXTURE0)
    // gl.activeTexture(0)


    // describe texture size
    WebGlProgramManager.setUpIntoTextureProgramImageSize(gl, this.getWidth(), this.getHeight());

  }


  
  
}
