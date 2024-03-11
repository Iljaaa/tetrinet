import {WebGlGraphics} from "../framework/impl/WebGlGraphics";
import {Vertices} from "../framework/Vertices";
import {Coords} from "./math/Coords";
import {Cup} from "./models/Cup";
import {Figure} from "./models/Figure";
import {CupState} from "./types/CupState";
import {GameOver} from "./textures/GameOver";
import {WinnerTexture} from "./textures/WinnerTexture";
import {CupWithFigure} from "./models/CupWithFigure";
import {NextBG} from "./textures/NextBG";
import {PlayScreenTexts} from "./textures/PlayScreenTexts";
import {Assets} from "./Assets";
import {WebGlProgramManager} from "../framework/impl/WebGlProgramManager";

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
  private _backgroundVertices: Vertices;

  /**
   * Player name vertices array
   */
  private _playerNameVertices: Vertices;

  /**
   * Game over vertices array
   */
  private _gameOverVertices: Vertices;

  /**
   * Winner vertices array
   */
  private _winnerVertices: Vertices;

  /**
   * @deprecated this is the test block
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

    // init vertices
    // init _backgroundVertices
    this._backgroundVertices = new Vertices(false, true);
    // this._backgroundVertices.setVertices(Vertices.createTextureVerticesArray(
    //   0, 0, cupWidth, cupHeight,
    //   0, 0, cupWidth, cupHeight
    // ))

    this._playerNameVertices = new Vertices(false, true);
    
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

  /**
   * Set cup size for render
   * @param size
   */
  public setCupSize (size:CupSize)
  {
    if (size === CupSize.small16) {
      this.blockSize = 16;
    }
    else if (size === CupSize.middle24){
      this.blockSize = 24;
    }
    else {
      this.blockSize = 32;
    }

    // calculate _backgroundVertices size
    let cupWidth = this.cupSizeInCells.width * this.blockSize
    let cupHeight = this.cupSizeInCells.height * this.blockSize

    // in _backgroundVertices we use only texture
    this._backgroundVertices = new Vertices(false, true);
    this._backgroundVertices.setVertices(Vertices.createTextureVerticesArray(
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
   * Update player vertices block
   * @param size
   * @param cupIndex
   * @param textsTexture
   */
  public setPlayerName (size:CupSize, cupIndex:number, textsTexture:PlayScreenTexts)
  {
    // calculate player name position
    const top = textsTexture.playersBeginEdge + (cupIndex * textsTexture.playerLineHeight)
    this._playerNameVertices.setVertices(Vertices.createTextureVerticesArray (
      0, 0, 300, 200,
      0, top, 300, 200
    ))
  }
  
  /**
   * this method render cup
   * @param gl
   * @param cup
   * @param textsTexture
   */
  public renderCupWithFigure(gl:WebGL2RenderingContext, cup:CupWithFigure, textsTexture:PlayScreenTexts):void
  {
    // render cup state
    // this.renderCup(gl, cup, textsTexture)

    // bind texture
    Assets.sprite.bind(gl)

    // render background
    this.renderBackground(gl)

    // render cup blocks
    this.presentCupBlocks(gl, cup);

    // render figure
    const f = cup.getFigure()
    if (f) this.renderFigure(gl, cup, f)

    // render status texts
    this.renderCupStateMessages(gl, cup, textsTexture)

  }
  
  /**
   * Render cup object
   * @param gl
   * @param cup
   * @param textsTexture
   */
  public renderCup (gl:WebGL2RenderingContext, cup:Cup, textsTexture:PlayScreenTexts)
  {
    // bind texture
    Assets.sprite.bind(gl)

    // render background
    this.renderBackground(gl)

    // render cup blocks
    this.presentCupBlocks(gl, cup);

    // render status texts
    this.renderCupStateMessages(gl, cup, textsTexture)
  }

  /**
   * Render text blocks
   * @param gl
   * @param cup
   * @param textTexture
   */
  private renderCupStateMessages (gl:WebGL2RenderingContext, cup:Cup, textTexture:PlayScreenTexts)
  {
    // if cup over draw game over
    if (cup.getState() === CupState.over) {
      this.presentGameOver(gl, textTexture)
    }
    if (cup.getState() === CupState.winner){
      this.presentWinner(gl, textTexture)
    }
  }

  /**
   * Render player name and cup index
   * @param gl
   * @param index
   * @param textsTexture
   */
  public renderCupIndex (gl:WebGL2RenderingContext, index:number, textsTexture:PlayScreenTexts)
  {

    textsTexture.bind(gl)

    // texture top
    // const top = textsTexture.playersBeginEdge + (index * textsTexture.playerLineHeight)

    //
    // this._block.setVertices(Vertices.createTextureVerticesArray(
    //   0, 0, 300, 200,
    //   0, top, 300, 200
    // ))

    // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._block.vertices), gl.STATIC_DRAW)
    // gl.drawArrays(gl.TRIANGLES, 0, this._block.getVerticesCount())

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._playerNameVertices.vertices), gl.STATIC_DRAW)
    gl.drawArrays(gl.TRIANGLES, 0, this._playerNameVertices.getVerticesCount())
  }

  /**
   * Blocks in cup
   * @private
   */
  private presentCupBlocks(gl: WebGL2RenderingContext, cup:Cup)
  {
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
  private renderFigure (gl: WebGL2RenderingContext, cup:Cup, f: Figure)
  {
    const fields = f.getFields();
    const len = fields.length;
    for (let r = 0; r < len; r++)
    {
      const cellIndex = fields[r]
      
      const c:Coords = cup.getCoordsByIndex(cellIndex);
      if (c.y < 0) continue
      
      const bottom = c.y * this.blockSize;
      const left = c.x * this.blockSize;
      
      const textureLeft = 320 + f.getColor() * this.blockSize;
      
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
   * Render _backgroundVertices
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
    // // in _backgroundVertices we use only texture
    // this._backgroundVertices = new Vertices(false, true);
    // this._backgroundVertices.setVertices(Vertices.createTextureVerticesArray(
    //   0, 0, cupWidth, cupHeight,
    //   0, 0, cupWidth, cupHeight
    // ))
    
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._backgroundVertices.vertices), gl.STATIC_DRAW)
    gl.drawArrays(gl.TRIANGLES, 0, this._backgroundVertices.getVerticesCount())
  }

  /**
   * Game over state present
   * @param gl
   * @param textTexture
   * @private
   */
  private presentGameOver (gl: WebGL2RenderingContext, textTexture:PlayScreenTexts)
  {
    // todo: move bind position before draw texts
    textTexture.bind(gl)
    WebGlProgramManager.setUpIntoTextureProgramImageSize(gl, textTexture.getWidth(), textTexture.getHeight());
    this._block.setVertices(Vertices.createTextureVerticesArray(
      30, 0, 260, 64,
      20, textTexture.gameOverTopPosition, 260, textTexture.lineHeight
    ))

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._block.vertices), gl.STATIC_DRAW)
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  // /**
  //  * Render _backgroundVertices
  //  * @param gl
  //  * @private
  //  */
  // private presentCupIndex (gl:WebGL2RenderingContext, textsTexture:PlayScreenTexts)
  // {
  //   // let cupWidth = cup.getWidthInCells() * this.blockSize
  //   let cupWidth = this.cupSizeInCells.width * this.blockSize
  //   // let cupHeight = cup.getHeightInCells() * this.blockSize
  //   let cupHeight = this.cupSizeInCells.height * this.blockSize
  //
  //   // in _backgroundVertices we use only texture
  //   this._backgroundVertices = new Vertices(false, true);
  //   this._backgroundVertices.setVertices(Vertices.createTextureVerticesArray(
  //     0, 0, cupWidth, cupHeight,
  //     0, 0, cupWidth, cupHeight
  //   ))
  //
  // }

  /**
   * Present winner table
   * @param gl
   * @param textTexture
   * @private
   */
  private presentWinner (gl: WebGL2RenderingContext, textTexture:PlayScreenTexts)
  {
    textTexture.bind(gl)
    WebGlProgramManager.setUpIntoTextureProgramImageSize(gl, textTexture.getWidth(), textTexture.getHeight());
    this._block.setVertices(Vertices.createTextureVerticesArray(
      0, 0, 260, 64,
      20, textTexture.winnerTopPosition, 260, textTexture.lineHeight
    ))

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._block.vertices), gl.STATIC_DRAW)
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    //
    // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._winnerVertices.vertices), gl.STATIC_DRAW)
    // gl.drawArrays(gl.TRIANGLES, 0, this._winnerVertices.getVerticesCount());
  }

  /**
   * Render next figure
   * @param gl
   * @param nextFigure
   */
  public renderNextFigure(gl: WebGL2RenderingContext, nextFigure:Figure)
  {
    // bind texture
    Assets.sprite.bind(gl)

    // render background
    this.renderNextFigureBackground(gl)

    // render figure
    this.renderFigureNextFigure(gl, nextFigure)
  }

  /**
   *
   * @param gl
   * @private
   */
  private renderNextFigureBackground(gl: WebGL2RenderingContext)
  {
    // draw next bg
    this._block.setVertices(Vertices.createTextureVerticesArray(
      0, 0, 160, 160,
      NextBG.texX, NextBG.texY, NextBG.texWidth, NextBG.texHeight
    ))

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._block.vertices), gl.STATIC_DRAW)
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  /**
   *
   * @param gl
   * @param nextFigure
   * @private
   */
  private renderFigureNextFigure (gl: WebGL2RenderingContext, nextFigure:Figure)
  {
    const fields:Array<Array<boolean>> = nextFigure.getPreviewFields();

    const BLOCK_SIZE = 32;

    // calculate number rows
    const rows = fields.length

    // calculate number cols
    const cols = fields[0].length

    // calculate left margin
    const leftMargin = ((4 - cols) / 2) * BLOCK_SIZE + 16;

    // calculate left margin
    const bottomMargin = ((4 - rows) / 2) * BLOCK_SIZE + 16;

    // for (let r = 0; r < rows; r++) {
    fields.reverse().forEach((row:Array<boolean>, rowIndex:number) => {
      row.forEach((col:boolean, colIndex:number) => {
        if (col)
        {
          const left = (colIndex * BLOCK_SIZE) + leftMargin;
          const bottom = (rowIndex * BLOCK_SIZE)  + bottomMargin;

          // const spriteLeft = 320 + this._nextFigureColor * BLOCK_SIZE;
          const spriteLeft = 320 + (nextFigure.getColor() * BLOCK_SIZE);

          this._block.setVertices(Vertices.createTextureVerticesArray(
            left, bottom, BLOCK_SIZE, BLOCK_SIZE,
            spriteLeft, 0, BLOCK_SIZE, BLOCK_SIZE
          ))

          gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._block.vertices), gl.STATIC_DRAW)

          // draw here
          gl.drawArrays(gl.TRIANGLES, 0, 6);
        }

      })
    });
  }

}
