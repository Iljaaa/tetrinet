/**
 * @varsion 0.0.1
 */
export interface Texture
{
  
  /**
   * Load file from url and after rise callback
   */
  load(url:string, onLoad:(url:string)=>void):void
  
  /**
   * Get image for binding
   */
  getImage():HTMLImageElement
  
}
