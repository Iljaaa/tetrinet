import {CupWithFigureImpl} from "./models/CupWithFigureImpl";
import {WebGlGraphics} from "../framework/impl/WebGlGraphics";
import {Vertices} from "../framework/Vertices";
import {CupImpl} from "./models/CupImpl";
import {Coords} from "./math/Coords";
import {Cup} from "./models/Cup";
import {Figure} from "./models/Figure";
import {WebGlProgramManager} from "../framework/impl/WebGlProgramManager";

const BLOCK_SIZE_PX = 32;

export class CupRenderer2
{
  /**
   * @private
   */
  private graphic: WebGlGraphics;
  
  /**
   * Background vertices array
   * @private
   */
  private background: Vertices;
  private background2: Vertices;
  
  /**
   * Temp field for draw fields
   * @private
   */
  private block: Vertices;
  
  
  constructor(graphic:WebGlGraphics, cup:CupImpl) {
    this.graphic = graphic;
    
    let cupWidth = cup.getWidthInCells() * BLOCK_SIZE_PX
    let cupHeight = cup.getHeightInCells() * BLOCK_SIZE_PX
    
    // in background we use only texture
    this.background = new Vertices(false, true);
    this.background.setVertices(Vertices.createTextureVerticesArray(
      0, 0, cupWidth, cupHeight,
      0, 0, cupWidth, cupHeight
    ))
    
    // in background we use only texture
    this.background2 = new Vertices(false, true);
    this.background2.setVertices(Vertices.createTextureVerticesArray(
      100, 100, cupWidth, cupHeight,
      0, 0, cupWidth, cupHeight
    ))
    
    // in background we use only texture
    this.block = new Vertices(false, true);
    this.block.setVertices(Vertices.createTextureVerticesArray(
      200, 200, BLOCK_SIZE_PX, BLOCK_SIZE_PX,
      0, 0, cupWidth, cupHeight
    ))
  }
  
  /**
   *
   * @param cup
   */
  public renderCupWithFigure(cup:CupWithFigureImpl):void
  {
    let gl:WebGL2RenderingContext = this.graphic.getGl();
   
    // render background
    this.renderBackground(gl)
    
    // render cup state
    this.renderCup(gl, cup)
    
    // render drop point
    
    // render rotate point
    
    // render figure
    const f = cup.getFigure()
    if (f) this.renderFigure(gl, cup, f, cup.getFigureColor())
    
    // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.background2.vertices), gl.STATIC_DRAW)
    
    // Draw all the triangles.
    // gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length/8)
    // gl.drawArrays(gl.TRIANGLES, 0, 6)
    
  }
  
  private renderBackground (gl:WebGL2RenderingContext)
  {
    // move cup
    WebGlProgramManager.setUpIntoTextureProgramTranslation(gl, 32, 32)
    
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.background.vertices), gl.STATIC_DRAW)
    gl.drawArrays(gl.TRIANGLES, 0, this.background.getVerticesCount())
  }
  
  private renderCup (gl:WebGL2RenderingContext, cup:CupWithFigureImpl)
  {
    
    // move cup
    WebGlProgramManager.setUpIntoTextureProgramTranslation(gl, 32, 32)
    
    // draw cup bodies
    const fields = cup.getFields()
    const len = fields.length;
    
    for (let i = 0; i < len; i++)
    {
      if (fields[i])
      {
        
        // bottom
        const row = Math.floor(i / cup.getWidthInCells());
        const bottom = row * BLOCK_SIZE_PX;
        
        const coll = i % cup.getWidthInCells();
        // const coll = i - (row * c.getWidthInCells());
        const left = coll * BLOCK_SIZE_PX;
        
        let f = 320;
        if (cup.colors[coll] !== undefined) {
          f += cup.colors[coll] * BLOCK_SIZE_PX
        }
        
        this.block.setVertices(Vertices.createTextureVerticesArray(
          left, bottom, BLOCK_SIZE_PX, BLOCK_SIZE_PX,
          f, 32, 32, 32
        ))
        
        
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.block.vertices), gl.STATIC_DRAW)
        
        // draw here
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
    }
  }
  
  /**
   * @private
   */
  private renderFigure (gl: WebGL2RenderingContext, cup:Cup, f: Figure, color:number)
  {
    const fields = f.getFields();
    const len = fields.length;
    for (let r = 0; r < len; r++)
    {
      const cellIndex = fields[r]
      
      const c:Coords = cup.getCoordsByIndex(cellIndex);
      
      const bottom = c.y * BLOCK_SIZE_PX;
      const left = c.x * BLOCK_SIZE_PX;
      
      const textureLeft = 320 + color * BLOCK_SIZE_PX;
      
      this.block.setVertices(Vertices.createTextureVerticesArray(
        left, bottom, BLOCK_SIZE_PX, BLOCK_SIZE_PX,
        textureLeft, 0, 32, 32
      ))
      
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.block.vertices), gl.STATIC_DRAW)
      
      // draw here
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      
    }
  }
  
}
