import {WebGlScreen} from "../../framework/impl/WebGlScreen";
import {Tetrinet} from "../Tetrinet";
import {Vertices} from "../../framework/Vertices";
import {WebGlProgramManager} from "../../framework/impl/WebGlProgramManager";
import {CupRenderer2} from "../CupRenderer2";

import {CupImpl} from "../models/CupImpl";


/**
 * @vaersion 0.0.1
 */
export class WatchScreen extends WebGlScreen
{
  /**
   * Cup object
   * @private
   */
  private readonly _cup: CupImpl;
  
  /**
   * Render
   * @private
   */
  private readonly _cupRenderer: CupRenderer2 | null = null;
  
  /**
   * In this constructor we create cup
   */
  constructor(game:Tetrinet)
  {
    super(game)
    console.log ('WatchScreen constructor');
    
    // create cup object
    this._cup =  new CupImpl();
    
    // init renderer
    this._cupRenderer  = new CupRenderer2(game.getGLGraphics(), this._cup)
    
    // in background we use only texture
    this._block = new Vertices(false, true);
    this._block.setVertices(Vertices.createTextureVerticesArray(
      200, 200, 32, 32,
      0, 0, 200, 200
    ))
    
  }
  
  /**
   * Update cup
   * @param deltaTime
   */
  update (deltaTime:number):void
  {
  
  }
  
  
  present(): void
  {
    console.log('WatchScreen.present')
    const gl = this.game.getGLGraphics().getGl();
    
    // Clear the screen.
    gl.clear(gl.COLOR_BUFFER_BIT)
    
    // use texture program
    // if (this.textureProgram) {
      // WebGlProgramManager._startUseTextureProgram(gl, this.textureProgram)
    // }
    
    // use texture program
    WebGlProgramManager.sUseTextureProgram(gl);
    
    // render cup
    this._cupRenderer?.renderCup(this._cup);
    
  }
  
  
  /**
   * Temp field for draw fields
   * @private
   */
  private _block: Vertices;
  
}
