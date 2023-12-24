/**
 * @varsion 0.0.1
 */
export interface Texture {
  
  /**
   * Load file
   */
  load(url:string, onLoad:(url:string)=>void):void

}
