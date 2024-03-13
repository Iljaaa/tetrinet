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
import {PlayScreenTexts} from "../textures/PlayScreenTexts";
import {GameState} from "../types";
import {Vertices} from "../../framework/Vertices";

/**
 * @vaersion 0.0.1
 */
export class JustPlayScreen extends WebGlScreen
{

  /**
   * Here we use only two states
   * pause and running
   * @private
   */
  private _state: GameState  = GameState.running;

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
   * Texture with text and player names
   * @private
   */
  private textTexture: PlayScreenTexts;

  /**
   * Timer for update cup data
   * @private
   */
  // private requestDataTimer:number = 0;

  /**
   * Temp field for draw fields
   * @private
   */
  // private canvasTexture: WebGLTexture | null = null;

  // private _experimentalTexture:Experimental;

  /**
   * Vertices for pause block
   * @private
   */
  private _pauseTextVertices: Vertices;

  /**
   * In this constructor we create cup
   */
  constructor(game:Tetrinet)
  {
    super(game)
    console.log ('JustPlayScreen constructor');


    // this._block = new Vertices(false, true);
    
    // create cup object
    this._cup =  new CupWithFigureImpl();
    
    // init renderer
    this._cupRenderer  = new CupRenderer2(game.getGLGraphics(), this._cup.getWidthInCells(), this._cup.getHeightInCells())

    // bind this to input listener
    this.game.getInput().setListener(this);

    // init texture programm
    const gl = this.game.getGLGraphics().getGl();
    WebGlProgramManager.sUseTextureProgram(gl);

    // init texture
    Assets.sprite.init(gl, gl.TEXTURE0)

    // texture with texts
    this.textTexture = new PlayScreenTexts();
    this.textTexture.render();
    this.textTexture.init(gl, gl.TEXTURE1)

    // this.initExperimentalTexture (gl)

    // init experimantal texture
    // this._experimentalTexture = new Experimental(300, 150);
    // this._experimentalTexture.init(gl, gl.TEXTURE1);

    this._pauseTextVertices = new Vertices();
    this._pauseTextVertices.setVertices(Vertices.createTextureVerticesArray(
      30, 100, 260, 64,
      20, PlayScreenTexts.pauseTopPosition, 260, PlayScreenTexts.lineHeight
    ));

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
    if (this._state === GameState.running){
      this._cup.updateFigureDownTimer(deltaTime);
    }

  }
  
  present(): void
  {
    const gl = this.game.getGLGraphics().getGl();

    // Clear the screen.
    gl.clear(gl.COLOR_BUFFER_BIT)
    //
    // const textureSizeLocation:WebGLUniformLocation|null = gl.getUniformLocation(WebGlProgramManager.textureProgram, "translation");
    // gl.uniform2f(textureSizeLocation, x, y)

    // const textureProgram = WebGlProgramManager.getTextureProgram(gl)
    // gl.useProgram(textureProgram)

    //
    // // Tell webGL to read 2 floats from the vertex array for each vertex
    // // and store them in my vec2 shader variable I've named "coordinates"
    // // We need to tell it that each vertex takes 24 bytes now (6 floats)
    // const coordsAttributeLocation  = gl.getAttribLocation(textureProgram, "coordinates")
    // gl.vertexAttribPointer(coordsAttributeLocation, 2, gl.FLOAT, false, 16, 0)
    // gl.enableVertexAttribArray(coordsAttributeLocation)
    //
    // // Tell webGL to read 2 floats from the vertex array for each vertex
    // // and store them in my vec2 shader variable I've named "texPos"
    // const textilsAttributeLocation = gl.getAttribLocation(textureProgram, "textilsPos")
    // gl.vertexAttribPointer(textilsAttributeLocation, 2, gl.FLOAT, false, 16, 8)
    // gl.enableVertexAttribArray(textilsAttributeLocation)
    //
    // // Set shader variable for canvas size. It's a vec2 that holds both width and height.
    // const canvasSizeLocation:WebGLUniformLocation|null = gl.getUniformLocation(textureProgramm, "canvasSize");
    // gl.uniform2f(canvasSizeLocation, gl.canvas.width, gl.canvas.height)
    //
    // // use texture program
    // WebGlProgramManager.sUseTextureProgram(gl);

    Assets.sprite.bind(gl)

    // render cup
    WebGlProgramManager.setUpIntoTextureProgramTranslation(gl, 232, 32);
    this._cupRenderer?.setCupSize(CupSize.normal32);
    this._cupRenderer?.renderCupWithFigure(this._cup, this.textTexture);

    // render next figure
    WebGlProgramManager.setUpIntoTextureProgramTranslation(gl, 570, 32)
    this.presentNextFigure(gl);

    // render test text
    // this.presentExperiment(gl)

    if (this._state === GameState.paused){
      this.presentPaused(gl);
    }
  }

  /**
   * Draw next figure
   * @param gl
   * @private
   */
  private presentNextFigure(gl: WebGL2RenderingContext)
  {
    // const nextFigure = this._cup.getNextFigure();
    // if (!nextFigure) return

    //
    this._cupRenderer?.renderNextFigure(gl, this._cup.getNextFigure())
  }

  private presentPaused (gl: WebGL2RenderingContext)
  {
    this.textTexture.bind(gl)
    // WebGlProgramManager.setUpIntoTextureProgramImageSize(gl, this.textTexture.getWidth(), this.textTexture.getHeight());
    WebGlProgramManager.setUpIntoTextureProgramTranslation(gl, 232, 32);


    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._pauseTextVertices.vertices), gl.STATIC_DRAW)
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  /*
   * Experiment with text
   * http://delphic.me.uk/tutorials/webgl-text
   * @private
   */
  // private presentExperiment (gl: WebGL2RenderingContext)
  // {
  //   this._experimentalTexture.bind(gl)
  //   WebGlProgramManager.setUpIntoTextureProgramImageSize(gl, 300, 150);
  //
  //
  //   this._block.setVertices(Vertices.createTextureVerticesArray(
  //     0, 100, 300, 150,
  //     // 320, 256, 192, 64
  //     0, 0, 300, 150
  //   ))
  //
  //   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._block.vertices), gl.STATIC_DRAW)
  //
  //   // draw here
  //   gl.drawArrays(gl.TRIANGLES, 0, 6);
  // }

  // protected initExperimentalTexture (gl: WebGL2RenderingContext)
  // {
  //   let canvas:HTMLCanvasElement = document.createElement('canvas');
  //   canvas.width = 300
  //   canvas.height = 150
  //   let ctx = canvas.getContext('2d');
  //   if (!ctx) return;
  //
  //   ctx.fillStyle = "back"; 	// This determines the text colour, it can take a hex value or rgba value (e.g. rgba(255,0,0,0.5))
  //   ctx.textAlign = "center";	// This determines the alignment of text, e.g. left, center, right
  //   ctx.textBaseline = "middle";	// This determines the baseline of the text, e.g. top, middle, bottom
  //   ctx.font = "16px monospace";
  //   ctx.fillText("HTML5 Rocks!", canvas.width/2, canvas.height/2);
  //   ctx.fillRect(0, 0, 100, 100)
  //
  //   this.canvasTexture = gl.createTexture();
  //
  //   // this is vertical flip
  //   // gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  //
  //   gl.activeTexture(1)
  //   // gl.activeTexture(0)
  //   gl.bindTexture(gl.TEXTURE_2D, this.canvasTexture);
  //   gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas); // This is the important line!
  //   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  //   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  //
  //   gl.activeTexture(1)
  // }

  pauseOrResume ()
  {
    if (this._state === GameState.running){
      this._state = GameState.paused
    }
    else if (this._state === GameState.paused){
      this._state = GameState.running
    }
  }

  /**
   * @param code
   */
  onKeyDown(code:string): void
  {
    console.log(code)
    switch (code) {
      case "KeyP": this.pauseOrResume(); break;
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
