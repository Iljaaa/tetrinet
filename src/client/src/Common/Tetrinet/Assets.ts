import {WebGlTexture} from "../framework/impl/WebGlTexture";

/**
 * This class collect and load assets
 */
export class Assets
{
  
  public static sprite:WebGlTexture;

  /**
   * Load assets
   * @param spriteUrl
   * @param onLoadCallback
   */
  public static load(spriteUrl:string, onLoadCallback: () => void)
  {
    //
    Assets.sprite = new WebGlTexture();
    Assets.sprite.load(spriteUrl, onLoadCallback)
  }
  
}
