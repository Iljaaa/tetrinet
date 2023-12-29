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
  
  
}
