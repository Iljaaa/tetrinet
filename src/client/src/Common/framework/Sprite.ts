/**
 * @deprecated mada it static
 * @version 0.0.1
 */
export abstract class Sprite
{
  public texX:number;
  public texY:number;
  public texWidth:number;
  public texHeight:number;

  /**
   * @param texX
   * @param texY
   * @param texWidth
   * @param texHeight
   */
  constructor(texX: number, texY: number, texWidth: number, texHeight: number) {
    this.texX = texX;
    this.texY = texY;
    this.texWidth = texWidth;
    this.texHeight = texHeight;
  }
}
