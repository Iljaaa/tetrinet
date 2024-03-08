import {Texture} from "../Texture";

/**
 * @version 0.0.1
 */
export class WebGlTexture implements Texture
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
  private readonly textureIndex: number;

  /**
   * Inited texture
   * @private
   */
  private textureId: WebGLTexture | null = null;


  /**
   * @param textureIndex
   */
  constructor(textureIndex:number)
  {
    this.textureIndex = textureIndex;
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
  
  getImage(): HTMLImageElement {
    return this.image;
  }
  
  /**
   * Bind texurei into gl
   * @param gl
   */
  init(gl:WebGL2RenderingContext): void
  {
    if (this.textureId === null) {
      this.textureId = gl.createTexture()
    }

    console.log(this.textureId, 'this.textureId')

    // now it not do anything, but when we will be use different textures
    // gl.activeTexture(gl.TEXTURE0)
    gl.activeTexture(this.textureIndex)
    gl.bindTexture(gl.TEXTURE_2D, this.textureId)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.image)
    
    // Tell gl that when draw images scaled up, smooth it.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)

    // gl.activeTexture(gl.TEXTURE0)
    gl.activeTexture(this.textureIndex)

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

    // now it not do anything, but when we will be use different textures
    // gl.activeTexture(gl.TEXTURE0)
    gl.activeTexture(this.textureIndex)
    gl.bindTexture(gl.TEXTURE_2D, this.textureId)
    // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.image)
    //
    // // Tell gl that when draw images scaled up, smooth it.
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)

    // gl.activeTexture(gl.TEXTURE0)
    // gl.activeTexture(0)

  }


  
  
}
