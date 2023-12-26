import {Texture} from "../../framework/Texture";

/**
 *
 */
export class WebGlTexture implements Texture
{
  /**
   * Image url
   * @private
   */
  private url:string|undefined;
  
  /**
   * @private
   */
  private image: HTMLImageElement;
  
  
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
  
  getImage(): HTMLImageElement {
    return this.image;
  }
  
  
}
