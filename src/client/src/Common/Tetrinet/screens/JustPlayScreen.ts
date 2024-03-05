import {WebGlScreen} from "../../framework/impl/WebGlScreen";
import {Tetrinet} from "../Tetrinet";
import {WebGlProgramManager} from "../../framework/impl/WebGlProgramManager";
import {CupRenderer2, CupSize} from "../CupRenderer2";

import {CupWithFigure} from "../models/CupWithFigure";
import {CupWithFigureImpl} from "../models/CupWithFigureImpl";
import {GenerateNewFigure} from "../process/GenerateNewFigure";
import {GenerateRandomColor} from "../process/GenerateRandomColor";
import {CupState} from "../types/CupState";
import {Assets} from "../Assets";
import {Vertices} from "../../framework/Vertices";
import {SearchForAGame} from "../textures";

/**
 * @vaersion 0.0.1
 */
export class JustPlayScreen extends WebGlScreen
{
  
  /**
   * Cup object
   * @private
   */
  private readonly _cup: CupWithFigure;
  
  /**
   * Render
   * @private
   */
  private readonly _cupRenderer: CupRenderer2 | null = null;

  /**
   * Timer for update cup data
   * @private
   */
  // private requestDataTimer:number = 0;


  /**
   * Temp field for draw fields
   * @private
   */
  private _block: Vertices;
  
  /**
   * In this constructor we create cup
   */
  constructor(game:Tetrinet)
  {
    super(game)
    console.log ('JustPlayScreen constructor');


    this._block = new Vertices(false, true);
    
    // create cup object
    this._cup =  new CupWithFigureImpl();
    
    // init renderer
    this._cupRenderer  = new CupRenderer2(game.getGLGraphics(), this._cup.getWidthInCells(), this._cup.getHeightInCells())

    // bind this to input listener
    this.game.getInput().setListener(this);

    //
    this.startNewGame ()
  }

  startNewGame ()
  {
    //
    this._cup.cleanBeforeNewGame();

    //
    this._cup.setState(CupState.online)

    // create new figure
    const f = GenerateNewFigure(this._cup, GenerateRandomColor());
    this._cup.setFigureToDropPoint(f);

    // generate new next figure
    this._cup.generateNextFigure()
  }
  
  /**
   * Update cup
   * @param deltaTime
   */
  update (deltaTime:number):void
  {
    // todo: get game state

    this._cup.updateFigureDownTimer(deltaTime);
  }
  
  
  present(): void
  {
    const gl = this.game.getGLGraphics().getGl();

    // Clear the screen.
    gl.clear(gl.COLOR_BUFFER_BIT)
    //
    // const textureSizeLocation:WebGLUniformLocation|null = gl.getUniformLocation(WebGlProgramManager.textureProgram, "translation");
    // gl.uniform2f(textureSizeLocation, x, y)

    // use texture program
    WebGlProgramManager.sUseTextureProgram(gl);

    Assets.sprite.bind(gl)
    gl.activeTexture(gl.TEXTURE0)

    WebGlProgramManager.setUpIntoTextureProgramImageSize(gl, Assets.sprite.getImage().width, Assets.sprite.getImage().height);

    // render cup
    WebGlProgramManager.setUpIntoTextureProgramTranslation(gl, 232, 32);
    this._cupRenderer?.setCupSize(CupSize.normal32);
    this._cupRenderer?.renderCupWithFigure(this._cup);

    // render next figure
    WebGlProgramManager.setUpIntoTextureProgramTranslation(gl, 570, 32)
    this.presentNextFigure(gl);

    // render test text
    this.presentExperiment(gl)
  }

  /**
   * Draw next figure
   * @param gl
   * @private
   */
  private presentNextFigure(gl: WebGL2RenderingContext)
  {
    const nextFigure = this._cup.getNextFigure();
    if (!nextFigure) return

    //
    this._cupRenderer?.renderNextFigure(gl, nextFigure)
  }

  /**
   * Experiment with text
   * http://delphic.me.uk/tutorials/webgl-text
   * @private
   */
  private presentExperiment (gl: WebGL2RenderingContext)
  {
    let canvas:HTMLCanvasElement|null = document.getElementById('textureCanvas') as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = "#333333"; 	// This determines the text colour, it can take a hex value or rgba value (e.g. rgba(255,0,0,0.5))
    ctx.textAlign = "center";	// This determines the alignment of text, e.g. left, center, right
    ctx.textBaseline = "middle";	// This determines the baseline of the text, e.g. top, middle, bottom
    ctx.font = "12px monospace";
    ctx.fillText("HTML5 Rocks!", canvas.width/2, canvas.height/2);
    ctx.fillRect(0, 0, 100, 100)

    let canvasTexture = gl.createTexture();

    // this is vertical flip
    // gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    gl.activeTexture(1)
    gl.bindTexture(gl.TEXTURE_2D, canvasTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas); // This is the important line!
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // gl.generateMipmap(gl.TEXTURE_2D);
    gl.activeTexture(1)


    WebGlProgramManager.setUpIntoTextureProgramImageSize(gl, 300, 150);


    this._block.setVertices(Vertices.createTextureVerticesArray(
      0, 100, 320, 150,
      // 320, 256, 192, 64
      100, 100, 300, 150
    ))

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._block.vertices), gl.STATIC_DRAW)

    // draw here
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    gl.bindTexture(gl.TEXTURE_2D, null);
  }


  /**
   * @param code
   */
  onKeyDown(code:string): void
  {
    switch (code) {
      case "KeyD": this.onRight(); break;
      case "KeyA": this.onLeft(); break;
      case "KeyQ": this.onRotateCounterClockwise(); break;
      case "KeyE": this.onRotateClockwise(); break;
      case "KeyS": this.onDown(); break;
      case "Space": this.onDrop(); break;
      // case "Backquote": this.sendBonusToMe(); break;
      // case "Digit1": this.sendBonusToOpponent(1); break;
      // case "Digit2": this.sendBonusToOpponent(2); break;
      // case "Digit3": this.sendBonusToOpponent(3); break;
      // case "Digit4": this.sendBonusToOpponent(4); break;
      // case "Digit5": this.sendBonusToOpponent(5); break;
      // case "Digit6": this.sendBonusToOpponent(6); break;
      // case "Digit7": this.sendBonusToOpponent(7); break;
      // case "Digit8": this.sendBonusToOpponent(8); break;
      // case "Digit9": this.sendBonusToOpponent(9); break;
    }
  }

  onKeyUp(code:string): void {

  }

  onRight(){
    this._cup.moveFigureRight();
  }

  onLeft() {
    this._cup.moveFigureLeft();
  }

  /**
   * Down figure
   */
  onDown(){
    this._cup.moveFigureDown();
  }

  /**
   * Drop it almost as down but to the bottom
   */
  onDrop(){
    this._cup.dropFigureDown();
  }

  onRotateClockwise (){
    this._cup.rotateClockwise();
  }

  onRotateCounterClockwise (){
    this._cup.rotateCounterClockwise();
  }
  
}
