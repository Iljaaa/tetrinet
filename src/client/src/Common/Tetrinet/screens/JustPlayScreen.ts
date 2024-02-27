import {WebGlScreen} from "../../framework/impl/WebGlScreen";
import {Tetrinet} from "../Tetrinet";
import {WebGlProgramManager} from "../../framework/impl/WebGlProgramManager";
import {CupRenderer2, CupSize} from "../CupRenderer2";

import {CupWithFigure} from "../models/CupWithFigure";
import {CupWithFigureImpl} from "../models/CupWithFigureImpl";
import {GenerateNewFigure} from "../process/GenerateNewFigure";
import {GenerateRandomColor} from "../process/GenerateRandomColor";
import {Coords} from "../math/Coords";
import {CupState} from "../types/CupState";

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
   * Position of left bottom point of next figure
   * @private
   */
  private nextFigurePosition:Coords = new Coords(370, 32);

  /**
   * Timer for update cup data
   * @private
   */
  // private requestDataTimer:number = 0;
  
  /**
   * In this constructor we create cup
   */
  constructor(game:Tetrinet)
  {
    super(game)
    console.log ('JustPlayScreen constructor');
    
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

    // use texture program
    WebGlProgramManager.sUseTextureProgram(gl);

    // render cup
    WebGlProgramManager.setUpIntoTextureProgramTranslation(gl, 32, 32);
    this._cupRenderer?.setCupSize(CupSize.normal32);
    this._cupRenderer?.renderCupWithFigure(this._cup);


    // render next figure
    this.presentNextFigure(gl);
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

    // move position
    WebGlProgramManager.setUpIntoTextureProgramTranslation(gl, this.nextFigurePosition.x, this.nextFigurePosition.y)

    //
    this._cupRenderer?.renderNextFigure(gl, nextFigure)
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
