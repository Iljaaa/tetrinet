import {CupWithFigureImpl} from "./models/CupWithFigureImpl";
import {WebGlGraphics} from "../framework/impl/WebGlGraphics";
import {Vertices} from "../framework/Vertices";

export class CupRenderer2
{
  private graphic: WebGlGraphics;
  
  /**
   * Background vertices array
   * @private
   */
  private background: Vertices;
  
  constructor(graphic:WebGlGraphics) {
    this.graphic = graphic;
    
    // this.cupWidth =
    // this.cupHeight =
    
    // in background we use only texture
    this.background = new Vertices(false, true);
    this.background.setVertices(Vertices.createTextureVerticesArray(100, 100, 200, 300, 0, 100, 200, 300))
  }
  
  /**
   *
   * @param cup
   */
  public renderCupWithFigure(cup:CupWithFigureImpl):void
  {
    this.vertices = []
    
    let gl:WebGL2RenderingContext = this.graphic.getGl();
    
    // Draw a wide rectangle.
    // this._drawImage(100,100, 200,200, 256,256,256,1, 0, 0, 100, 100)
    
    // Tell webGL to draw these triangle this frame.
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.background.vertices), gl.STATIC_DRAW)
    
    // Draw all the triangles.
    // gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length/8)
    gl.drawArrays(gl.TRIANGLES, 0, 6)
    
    
    
  }
  
  
  /**
   * Array with vertices, it clears every loop
   * @type {*[]}
   */
  vertices:Array<number> = [];
  
  /**
   *
   * Draws 2 triangles to make a rectangle.
   *
   * draw size in px
   * @param x
   * @param y
   * @param width
   * @param height
   *
   * color coordinates
   * @param r
   * @param g
   * @param b
   * @param a
   *
   * textils coordinates
   * @param texX
   * @param texY
   * @param texWidth
   * @param texHeight
   */
  _drawImage(x:number, y:number, width:number, height:number, r:number, g:number, b:number, a:number, texX:number, texY:number, texWidth:number, texHeight:number)
  {
    // const x2 = x+width
    // const y2 = y+height
    // const texX2 = texX + texWidth
    // const texY2 = texY + texHeight
    // // first triangle
    // this.vertices.push(
    //   x, y, r, g, b, a, texX, texY,
    //   x, y2, r, g, b, a, texX, texY2,
    //   x2, y2, r, g, b, a, texX2, texY2
    // )
    // // second triangle
    // this.vertices.push(
    //   x, y, r, g, b, a, texX, texY,
    //   x2, y, r, g, b, a, texX2, texY,
    //   x2, y2, r, g, b, a, texX2, texY2
    // )
    
    // this.vertices.push(this._createImageVerticesArray(x, y, width, height, r, g, b, a, texX, texY, texWidth, texHeight))
    this.vertices.push(...this._createImageVerticesArray(x, y, width, height, r, g, b, a, texX, texY, texWidth, texHeight))
  }
  
  
  _createImageVerticesArray (x:number, y:number, width:number, height:number, r:number, g:number, b:number, a:number, texX:number, texY:number, texWidth:number, texHeight:number):number[]{
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
  
}
