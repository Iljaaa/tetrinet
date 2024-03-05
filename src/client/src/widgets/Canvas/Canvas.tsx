import React from "react";

import {CupData} from "../../Common/Tetrinet/models/CupData";
import {SocketSingleton} from "../../Common/SocketSingleton";
import {TetrinetSingleton} from "../../Common/TetrinetSingleton";

/**
 * Collection of cups data received from server
 * after update
 */
export interface CupsDataCollection {
  [index: string]: CupData
}

export class Canvas extends React.PureComponent
{
  /**
   * Ref to canvas
   * @private
   */
  private readonly _canvas: React.RefObject<HTMLCanvasElement>;
  private _wrapRef: React.RefObject<HTMLDivElement>;
  
  /**
   * Game object
   * @private
   */
  // private game:Tetrinet;

  constructor(props: { }, context: any)
  {
    super(props, context);
    
    /**
     * Ref on canvas
     */
    this._canvas = React.createRef();

    this._wrapRef = React.createRef();

    // create game instance
    TetrinetSingleton.init();
  }

  /**
   *
   */
  componentDidMount()
  {
    // init graphic
    TetrinetSingleton.getInstance().initGraphicAndLoadAssets(this._canvas.current as HTMLCanvasElement);

    this._wrapRef.current?.addEventListener('blur', this.onWrapBlurByRef);
    this._wrapRef.current?.addEventListener('focus', this.onWrapFocusByRef);
  }
  
  componentWillUnmount()
  {
    // unbind events
    // this.game.getInput().unBind();
    // TetrinetSingleton.getInstance().getInput().unBind();
  }

  onWrapFocus = () => {
    console.log('Canvas.onWrapFocus')
  }

  onWrapBlur = () => {
    console.log('Canvas.onWrapBlur')
  }

  onWrapFocusByRef = () => {
    console.log('Canvas.onWrapFocusByRef')
  }

  onWrapBlurByRef = () => {
    console.log('Canvas.onWrapBlurByRef')
  }
  
  /**
   *
   */
  onPlayClicked = () =>
  {
    console.log ('onPlayClicked');
    TetrinetSingleton.getInstance().oldPlayMethod();
  }

  onWatchClicked = () =>
  {
    console.log ('onWatchClicked');
    
    // open socket connection
    // this.socket = new Socket();
    SocketSingleton.openConnection(() =>
    {
      const request = {type: "watch"}

      // send start party
      SocketSingleton.getInstance()?.sendDataAndWaitAnswer(request, (data:any) => {
        // when socket open we start game
        // this.game.watchGame();
        TetrinetSingleton.getInstance().watchGame();
      })
    }, () => {
      alert ('Socket closed');
    })
    
  }



  render () {
    return <div style={{display: "flex", flexDirection: "column", alignItems: "center", padding: "0 1rem", border: "solid 2px navy"}}
                onBlur={this.onWrapBlur}
                onFocus={this.onWrapFocus}
                ref={this._wrapRef}>

      {/*<div style={{display: "flex", alignItems: "center", marginBottom: "1rem", width: "100%"}}>*/}
      {/*  <div style={{display: "flex", alignItems: "center", flex: "1"}}>*/}
      {/*    <div>*/}
      {/*      <button onClick={this.onPlayClicked} disabled={true}>Play</button>*/}
      {/*    </div>*/}
      {/*    <div>*/}
      {/*      <button onClick={this.onPauseClicked}>Pause</button>*/}
      {/*      <button onClick={this.onResumeClicked}>Resume</button>*/}
      {/*    </div>*/}
      {/*    <div>*/}
      {/*      <button onClick={this.onWatchClicked} disabled={true}>Watch</button>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</div>*/}

      <div>
        <canvas id="canvas" width={960} height={750} style={{border: "solid 2px orange"}} ref={this._canvas}/>
      </div>
    </div>
  }
}
