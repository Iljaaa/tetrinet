import {CupWithFigureImpl} from "./models/CupWithFigureImpl";
import {WebGlGraphics} from "../framework/impl/WebGlGraphics";
import {Vertices} from "../framework/Vertices";
import {CupImpl} from "./models/CupImpl";
import {Coords} from "./math/Coords";
import {Cup} from "./models/Cup";
import {Figure} from "./models/Figure";
import {WebGlProgramManager} from "../framework/impl/WebGlProgramManager";
import {CupState} from "./types/CupState";

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
  // private background2: Vertices;
  
  /**
   * Temp field for draw fields
   * @private
   */
  private _block: Vertices;
  
  /**
   * Cup position
   * todo: remove position from this object
   */
  private position = {
    x: 32,
    y: 32
  }
  
  /**
   * Block size
   * @private
   */
  private blockSize:number = 32;
  
  constructor(graphic:WebGlGraphics, cup:CupImpl) {
    this.graphic = graphic;
    
    //
    let cupWidth = cup.getWidthInCells() * this.blockSize
    let cupHeight = cup.getHeightInCells() * this.blockSize
    
    // in background we use only texture
    // todo: move resize of background to other method
    this.background = new Vertices(false, true);
    this.background.setVertices(Vertices.createTextureVerticesArray(
      0, 0, cupWidth, cupHeight,
      0, 0, cupWidth, cupHeight
    ))
    
    // init block
    this._block = new Vertices(false, true);
    this._block.setVertices(Vertices.createTextureVerticesArray(
      200, 200, this.blockSize, this.blockSize,
      0, 0, cupWidth, cupHeight
    ))
  }
  
  /**
   * Set render position
   * @param x
   * @param y
   */
  public setPosition(x:number, y:number){
    this.position.x = x;
    this.position.y = y;
  }
  
  /**
   * Set block size
   * @param blockSize
   */
  public setBlockSize(blockSize:number) {
    this.blockSize = blockSize
  }
  
  /**
   * this method render cup
   * @param cup
   */
  public renderCupWithFigure(cup:CupWithFigureImpl):void
  {
    let gl:WebGL2RenderingContext = this.graphic.getGl();
    
    // render cup state
    this.renderCup(cup)
    
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
  
  /**
   * Render cup object
   * @param cup
   */
  public renderCup (cup:Cup)
  {
    //
    let gl:WebGL2RenderingContext = this.graphic.getGl();
    
    // render background
    this.renderBackground(gl, cup)
    
    // move cup
    WebGlProgramManager.setUpIntoTextureProgramTranslation(gl, this.position.x, this.position.y)
    
    // draw cup bodies
    const fields = cup.getFields()
    const len = fields.length;
    
    for (let i = 0; i < len; i++)
    {
      if (fields[i] > -1)
      {
        
        // bottom
        const row = Math.floor(i / cup.getWidthInCells());
        const bottom = row * this.blockSize;
        
        const coll = i % cup.getWidthInCells();
        const left = coll * this.blockSize;
        
        const fieldValue = fields[i]
        
        // take field color
        let f:number = 320 + (fieldValue * 32);
        
        // update position
        this._block.setVertices(Vertices.createTextureVerticesArray(
          left, bottom, this.blockSize, this.blockSize,
          f, 32, 32, 32
        ))
        
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._block.vertices), gl.STATIC_DRAW)
        
        // draw here
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        
        //
        if (fieldValue > 5) {
          // bonus
          this._block.setVertices(Vertices.createTextureVerticesArray(
            left, bottom, this.blockSize, this.blockSize,
            320, 32 * 4, 32, 32
          ))
          
          gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._block.vertices), gl.STATIC_DRAW)
          
          // draw here
          gl.drawArrays(gl.TRIANGLES, 0, 6);
        }
      }
    }

    // if cup over draw game over
    if (cup.getState() === CupState.over){
      this.presentGameOver(gl)
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
      
      const bottom = c.y * this.blockSize;
      const left = c.x * this.blockSize;
      
      const textureLeft = 320 + color * this.blockSize;
      
      this._block.setVertices(Vertices.createTextureVerticesArray(
        left, bottom, this.blockSize, this.blockSize,
        textureLeft, 0, 32, 32
      ))
      
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._block.vertices), gl.STATIC_DRAW)
      
      // draw here
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      
    }
  }
  
  /**
   * Render background
   * @param gl
   * @param cup
   * @private
   */
  private renderBackground (gl:WebGL2RenderingContext, cup:Cup)
  {
    // todo: move this calculations to set blocksize method
    let cupWidth = cup.getWidthInCells() * this.blockSize
    let cupHeight = cup.getHeightInCells() * this.blockSize
    
    // in background we use only texture
    this.background = new Vertices(false, true);
    this.background.setVertices(Vertices.createTextureVerticesArray(
      0, 0, cupWidth, cupHeight,
      0, 0, cup.getWidthInCells() * 32, cup.getHeightInCells() * 32
    ))
    
    // move cup
    // todo: move position on constants
    WebGlProgramManager.setUpIntoTextureProgramTranslation(gl, this.position.x, this.position.y)
    
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.background.vertices), gl.STATIC_DRAW)
    gl.drawArrays(gl.TRIANGLES, 0, this.background.getVerticesCount())
  }

  /**
   * Game over state present
   * @param gl
   * @private
   */
  private presentGameOver (gl: WebGL2RenderingContext)
  {
    console.log('CupRenderer2.presentPaused')

    // move position to left
    // todo: move to user cup position
    WebGlProgramManager.setUpIntoTextureProgramTranslation(gl, 0, 0)

    // calc left position
    // this._cup.getWidthInCells()

    this._block.setVertices(Vertices.createTextureVerticesArray(
        100, 450, 320, 64,
        320, 192, 320, 64
    ))

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._block.vertices), gl.STATIC_DRAW)

    // draw here
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
}
