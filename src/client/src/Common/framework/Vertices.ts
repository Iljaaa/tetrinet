/**
 * Vertices 2d class
 * @version 0.1.0
 */
export class Vertices
{
  
  public vertices:Array<number> = [];
  
  private hasColor: boolean;
  private hasTexils: boolean;
  
  /**
   *
   * @param hasColor
   * @param hasTexils
   */
  constructor(hasColor:boolean = false, hasTexils:boolean = false)
  {
    this.hasColor = hasColor;
    this.hasTexils = hasTexils;
  }
  
  setVertices (vertices:Array<number>){
    this.vertices = vertices
  }
  
  /**
   * Calculates count vertices
   */
  getVerticesCount():number{
    let countNumbersInRow = 2; // position
    if (this.hasColor) countNumbersInRow += 4;
    if (this.hasTexils) countNumbersInRow += 2
    return countNumbersInRow;
  }
  
  
  /**
   * Create array of vertices array with color and texlist
   * @param x
   * @param y
   * @param width
   * @param height
   * @param r
   * @param g
   * @param b
   * @param a
   * @param texX
   * @param texY
   * @param texWidth
   * @param texHeight
   */
  public static createMixedVerticesArray (x:number, y:number, width:number, height:number, r:number, g:number, b:number, a:number, texX:number, texY:number, texWidth:number, texHeight:number):number[]{
    const x2 = x+width
    const y2 = y+height
    const texX2 = texX + texWidth
    const texY2 = texY + texHeight
    return [
      x, y, r, g, b, a, texX, texY,
      x, y2, r, g, b, a, texX, texY2,
      x2, y2, r, g, b, a, texX2, texY2,
      
      x, y, r, g, b, a, texX, texY,
      x2, y, r, g, b, a, texX2, texY,
      x2, y2, r, g, b, a, texX2, texY2
    ];
  }
  
  /**
   * Create array of vertices with texlist coords
   * @param x
   * @param y
   * @param width
   * @param height
   * @param texX
   * @param texY
   * @param texWidth
   * @param texHeight
   */
  public static createTextureVerticesArray (x:number, y:number, width:number, height:number, texX:number, texY:number, texWidth:number, texHeight:number):number[]{
    const x2 = x+width
    const y2 = y+height
    const texX2 = texX + texWidth
    const texY2 = texY + texHeight
    return [
      x, y, texX, texY,
      x, y2, texX, texY2,
      x2, y2, texX2, texY2,
      
      x, y, texX, texY,
      x2, y, texX2, texY,
      x2, y2, texX2, texY2
    ];
  }
  
  /**
   * Create array of vertices array with color coordinates
   *
   * @param x
   * @param y
   * @param width
   * @param height
   *
   * @param r
   * @param g
   * @param b
   * @param a
   */
  public static createColorVerticesArray (x:number, y:number, width:number, height:number, r:number, g:number, b:number, a:number){
    const x2 = x+width
    const y2 = y+height
    // return [
    //   x, y, r, g, b, a, 0, 0,
    //   x, y2, r, g, b, a, 0, 0,
    //   x2, y2, r, g, b, a, 0, 0,
    //   x, y, r, g, b, a, 0, 0,
    //   x2, y, r, g, b, a, 0, 0,
    //   x2, y2, r, g, b, a, 0, 0,
    // ]
    return [
      x, y, r, g, b, a,
      x, y2, r, g, b, a,
      x2, y2, r, g, b, a,
      x, y, r, g, b, a,
      x2, y, r, g, b, a,
      x2, y2, r, g, b, a,
    ]
    
  }
  
  
  
}
