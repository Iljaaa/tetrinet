import React from "react";

import {CupData} from "./Common/Tetrinet/models/CupData";
import {SocketSingleton} from "./Common/SocketSingleton";
import {TetrinetSingleton} from "./Common/TetrinetSingleton";

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
    
    // create game
    // this.game =  new PlayScreen();
    // this.game = new Tetrinet()
    TetrinetSingleton.init();
  }

  /**
   *
   */
  componentDidMount()
  {
    // init graphic
    TetrinetSingleton.getInstance().initGraphicAndLoadAssets(this._canvas.current as HTMLCanvasElement);
  }
  
  componentWillUnmount()
  {
    // unbind events
    // this.game.getInput().unBind();
    TetrinetSingleton.getInstance().getInput().unBind();
  }
  
  /**
   *
   */
  onPlayClicked = () =>
  {
    console.log ('onPlayClicked');
    TetrinetSingleton.getInstance().oldPlayMethod();
  }

  /**
   * Pause game button clicked
   */
  // onPauseClicked = () =>
  // {
  //   console.log ('onPauseClicked');
  //   TetrinetSingleton.getInstance().pause();
  //
  // }

  /**
   * Resume clicked
   */
  // onResumeClicked = () =>
  // {
  //   console.log ('onResumeClicked');
  //   TetrinetSingleton.getInstance().resume();
  // }

  onWatchClicked = () =>
  {
    console.log ('onWatchClicked');
    
    // open socket connection
    // this.socket = new Socket();
    SocketSingleton.openConnection(() =>
    {
      // todo: make special object
      const request = {type: "watch"}

      // send start party
      SocketSingleton.getInstance()?.sendDataAndWaitAnswer(request, (data:any) => {
        // when socket open we start game
        // this.game.watchGame();
        TetrinetSingleton.getInstance().watchGame();
      })
    }, () => {
      console.log ('Socket closed');
    })
    
  }

  render () {
    return <div style={{display: "flex", flexDirection: "column", alignItems: "center", padding: "0 1rem"}}>

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
