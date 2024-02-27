import {WebGlGraphics} from "../framework/impl/WebGlGraphics";
import {Vertices} from "../framework/Vertices";
import {Coords} from "./math/Coords";
import {Cup} from "./models/Cup";
import {Figure} from "./models/Figure";
import {CupState} from "./types/CupState";
import {GameOver} from "./textures/GameOver";
import {WinnerTexture} from "./textures/WinnerTexture";
import {Numbers} from "./textures/Numbers";
import {CupWithFigure} from "./models/CupWithFigure";

export enum CupSize {
  small16 = 'small16',
  middle24 = 'middle24',
  normal32 = 'normal32'
}

export class CupRenderer2
{
  /**
   * @private
   */
  private graphic: WebGlGraphics;

  /**
   * Cup size set in constructor and then never change
   */
  private cupSizeInCells:{width:number, height:number} = {
    width: 10, height: 20
  }
  
  /**
   * Cup position
   */
  // private position = {
  //   x: 32,
  //   y: 32
  // }

  /**
   *
   * @private
   */
  private gameOverTexture:GameOver;
  private winnerTexture:WinnerTexture;
  
  /**
   * Block size
   * @private
   */
  private blockSize:number = 32;

  /**
   * Background vertices array
   */
  private _background: Vertices;

  /**
   * Game over vertices array
   */
  private _gameOverVertices: Vertices;

  /**
   * Winner vertices array
   */
  private _winnerVertices: Vertices;

  /**
   * Temp field for draw fields
   */
  private _block: Vertices;

  constructor(graphic:WebGlGraphics, cupWidthInCells:number, cupHeightInCell:number) {
    this.graphic = graphic;
    
    //
    this.cupSizeInCells = {
      width: cupWidthInCells,
      height: cupHeightInCell
    }
    let cupWidth = this.cupSizeInCells.width * this.blockSize
    let cupHeight =this.cupSizeInCells.height * this.blockSize
    
    // init _background
    this._background = new Vertices(false, true);
    this._background.setVertices(Vertices.createTextureVerticesArray(
      0, 0, cupWidth, cupHeight,
      0, 0, cupWidth, cupHeight
    ))
    
    // init block
    this._block = new Vertices(false, true);
    this._block.setVertices(Vertices.createTextureVerticesArray(
      200, 200, this.blockSize, this.blockSize,
      0, 0, cupWidth, cupHeight
    ))

    // init textures objects
    this.gameOverTexture = new GameOver();
    this.winnerTexture = new WinnerTexture();

    //
    this._gameOverVertices = new Vertices(false, true);
    this._gameOverVertices.setVertices(Vertices.createTextureVerticesArray(
        0, 0, cupWidth, cupHeight,
        0, 0, this.gameOverTexture.texWidth, this.gameOverTexture.texHeight
    ))

    //
    this._winnerVertices = new Vertices(false, true);
    this._winnerVertices.setVertices(Vertices.createTextureVerticesArray(
        0, 0, cupWidth, cupHeight,
        0, 0, this.winnerTexture.texWidth, this.winnerTexture.texHeight
    ))
  }
  
  /*
   * Set render position
   * @param x
   * @param y
   */
  // public setPosition(x:number, y:number){
  //   this.position.x = x;
  //   this.position.y = y;
  // }
  
  /*
   * Set block size
   * @param blockSize
   */
  // public setBlockSize(blockSize:number) {
  //   this.blockSize = blockSize
  // }

  /**
   * Set cup size for render
   * @param size
   */
  public setCupSize (size:CupSize)
  {
    if (size === CupSize.small16) {
      this.blockSize = 16;
    }
    else {
      this.blockSize = 32;
    }

    // calculate _background size
    let cupWidth = this.cupSizeInCells.width * this.blockSize
    let cupHeight = this.cupSizeInCells.height * this.blockSize

    // in _background we use only texture
    this._background = new Vertices(false, true);
    this._background.setVertices(Vertices.createTextureVerticesArray(
      0, 0, cupWidth, cupHeight,
      0, 0, 320, 640
    ))

    // calculate game ove position
    // const textWidth = this.cupSizeInCells.width * this.blockSize;
    const textHeight =  64 / 320 * cupWidth;
    const marginTop = this.cupSizeInCells.height * this.blockSize * 0.2;

    this._gameOverVertices.setVertices(Vertices.createTextureVerticesArray(
        0, marginTop, cupWidth, textHeight,
        // 320, 192, 320, 64
        this.gameOverTexture.texX, this.gameOverTexture.texY, this.gameOverTexture.texWidth, this.gameOverTexture.texHeight
    ))

    this._winnerVertices.setVertices(Vertices.createTextureVerticesArray(
        46, marginTop, cupWidth, textHeight,
        // 320, 192, 320, 64
        this.winnerTexture.texX, this.winnerTexture.texY, this.winnerTexture.texWidth, this.winnerTexture.texHeight
    ))

  }
  
  /**
   * this method render cup
   * @param cup
   */
  public renderCupWithFigure(cup:CupWithFigure):void
  {
    let gl:WebGL2RenderingContext = this.graphic.getGl();
    
    // render cup state
    this.renderCup(cup)
    
    // render drop point
    
    // render rotate point
    
    // render figure
    const f = cup.getFigure()
    if (f) this.renderFigure(gl, cup, f, f.getColor())
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
    this.renderBackground(gl)

    // render cup blocks
    this.presentCupBlocks(gl, cup);

    // render index
    this.presentCupIndex(gl);

    // this.presentSpecialBlocks();

    // if cup over draw game over
    if (cup.getState() === CupState.over){
      this.presentGameOver(gl)
    }
    if (cup.getState() === CupState.winner){
      this.presentWinner(gl)
    }
  }

  /**
   * Blocks in cup
   * @private
   */
  private presentCupBlocks(gl: WebGL2RenderingContext, cup:Cup)
  {
    // move cup
    // WebGlProgramManager.setUpIntoTextureProgramTranslation(gl, this.position.x, this.position.y)

    // draw cup bodies
    const fields = cup.getFields()
    const len = fields.length;

    for (let i = 0; i < len; i++)
    {
      // draw block
      if (fields[i].block > -1)
      {
        const row = Math.floor(i / this.cupSizeInCells.width);
        const bottom = row * this.blockSize;

        const coll = i % this.cupSizeInCells.width;
        const left = coll * this.blockSize;

        const fieldValue = fields[i].block

        // take field color
        let f:number = 320 + (fieldValue * 32);

        // update position
        this._block.setVertices(Vertices.createTextureVerticesArray(
            left, bottom, this.blockSize, this.blockSize,
            f, 32, 32, 32
        ))

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._block.vertices), gl.STATIC_DRAW)
        // gl.drawArrays(gl.TRIANGLES, 0, 6);
        gl.drawArrays(gl.TRIANGLES, 0, this._block.getVerticesCount());

      }

      // draw super block
      if (fields[i].bonus !== undefined)
      {
        const row = Math.floor(i / this.cupSizeInCells.width);
        const bottom = row * this.blockSize;

        const coll = i % this.cupSizeInCells.width;
        const left = coll * this.blockSize;

        // todo: make here select
        const fieldValue = fields[i].bonus as number

        // take field color
        let f:number = 320 + (fieldValue * 32);

        // update position
        this._block.setVertices(Vertices.createTextureVerticesArray(
            left, bottom, this.blockSize, this.blockSize,
            f, 128, 32, 32
        ))

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._block.vertices), gl.STATIC_DRAW)
        // gl.drawArrays(gl.TRIANGLES, 0, 6);
        gl.drawArrays(gl.TRIANGLES, 0, this._block.getVerticesCount());
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
   * Render _background
   * @param gl
   * @private
   */
  private renderBackground (gl:WebGL2RenderingContext)
  {
    // // let cupWidth = cup.getWidthInCells() * this.blockSize
    // let cupWidth = this.cupSizeInCells.width * this.blockSize
    // // let cupHeight = cup.getHeightInCells() * this.blockSize
    // let cupHeight = this.cupSizeInCells.height * this.blockSize
    //
    // // in _background we use only texture
    // this._background = new Vertices(false, true);
    // this._background.setVertices(Vertices.createTextureVerticesArray(
    //   0, 0, cupWidth, cupHeight,
    //   0, 0, cupWidth, cupHeight
    // ))

    // move cup
    // WebGlProgramManager.setUpIntoTextureProgramTranslation(gl, this.position.x, this.position.y)
    
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._background.vertices), gl.STATIC_DRAW)
    gl.drawArrays(gl.TRIANGLES, 0, this._background.getVerticesCount())
  }

  /**
   * Game over state present
   * @param gl
   * @private
   */
  private presentGameOver (gl: WebGL2RenderingContext)
  {
    console.log('CupRenderer2.presentGameOver')

    // move cup
    // WebGlProgramManager.setUpIntoTextureProgramTranslation(gl, this.position.x, this.position.y)

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._gameOverVertices.vertices), gl.STATIC_DRAW)
    gl.drawArrays(gl.TRIANGLES, 0, this._gameOverVertices.getVerticesCount());
  }


  /**
   * Render _background
   * @param gl
   * @private
   */
  private presentCupIndex (gl:WebGL2RenderingContext)
  {
    // // let cupWidth = cup.getWidthInCells() * this.blockSize
    // let cupWidth = this.cupSizeInCells.width * this.blockSize
    // // let cupHeight = cup.getHeightInCells() * this.blockSize
    // let cupHeight = this.cupSizeInCells.height * this.blockSize
    //
    // // in _background we use only texture
    // this._background = new Vertices(false, true);
    // this._background.setVertices(Vertices.createTextureVerticesArray(
    //   0, 0, cupWidth, cupHeight,
    //   0, 0, cupWidth, cupHeight
    // ))

    // move cup
    // WebGlProgramManager.setUpIntoTextureProgramTranslation(gl, this.position.x, this.position.y)

    this._block.setVertices(Vertices.createTextureVerticesArray(
      8, 0, 16, 32,
      // 320, 192, 320, 64
      Numbers.one.texX, Numbers.one.texY, Numbers.one.texWidth, Numbers.one.texHeight
    ))

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._block.vertices), gl.STATIC_DRAW)
    gl.drawArrays(gl.TRIANGLES, 0, this._block.getVerticesCount())
  }

  /**
   * Game over state present
   * @param gl
   * @private
   */
  private presentWinner (gl: WebGL2RenderingContext)
  {
    console.log('CupRenderer2.presentWinner')

    // move cup
    // WebGlProgramManager.setUpIntoTextureProgramTranslation(gl, this.position.x, this.position.y)

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._winnerVertices.vertices), gl.STATIC_DRAW)
    gl.drawArrays(gl.TRIANGLES, 0, this._winnerVertices.getVerticesCount());
  }
}
