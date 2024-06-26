import {WebGlScreen} from "../../framework/impl/WebGlScreen";
import {Tetrinet} from "../Tetrinet";
import {WebGlProgramManager} from "../../framework/impl/WebGlProgramManager";
import {CupRenderer2} from "../CupRenderer2";

import {CupImpl} from "../models/CupImpl";
import {SocketSingleton} from "../../SocketSingleton";

/*
 * How often we request data
 */
// const REQUEST_DATA_DELTA = 1000;


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
    
    // create cup object
    this._cup =  new CupImpl();
    
    // init renderer
    this._cupRenderer  = new CupRenderer2(game.getGLGraphics(), this._cup.getWidthInCells(), this._cup.getHeightInCells())
    
    // bind to socket events
    SocketSingleton.getInstance()?.setMessageReceiveCallback(this.onMessageReceive);
    
  }
  
  /**
   * Update cup
   * @param deltaTime
   */
  update (deltaTime:number):void
  {
    // this.requestDataTimer -= deltaTime
    // if (this.requestDataTimer <= 0){
    //   // SocketSingletone.getInstance()?.requestData()
    //   // this.requestDataTimer = REQUEST_DATA_DELTA
    // }
    
  }
  
  
  present(): void
  {
    const gl = this.game.getGLGraphics().getGl();
    
    // Clear the screen.
    gl.clear(gl.COLOR_BUFFER_BIT)
    
    // use texture program
    // if (this.textureProgram) {
      // WebGlProgramManager._startUseTextureProgram(gl, this.textureProgram)
    // }
    
    // use texture programo
    // todo: this is not necessary here
    // todo: it may br in constructor
    WebGlProgramManager.sUseTextureProgram(gl);
    
    // render cup
    // this._cupRenderer?.renderCup(this._cup);
  }
  
  /**
   * This is method from socket event listener
   */
  onMessageReceive(data:any): void {
    if (data && data.cup && data.cup && data.cup.cup && data.cup.cup.fields) {
      this._cup.setFields(data.cup.cup.fields)
    }
    
  }
  
}
