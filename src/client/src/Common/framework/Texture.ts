/**
 * @varsion 0.0.2
 */
export interface Texture
{
  /**
   * Load file from url and after rise callback
   */
  //load(url:string, onLoad:(url:string)=>void):void
  
  /**
   * @deprecated this wrong use just get height and get width
   * Get image for binding
   */
  // getImage():HTMLImageElement

  /**
   * Texture width
   */
  getWidth():number

  /**
   * Texture height
   */
  getHeight():number

  /**
   * Here we load image into video
   * @param gl
   */
  init(gl:WebGL2RenderingContext):void
  
  /**
   * Bind image to gl
   * jus for use
   */
  bind(gl:WebGL2RenderingContext):void
}
