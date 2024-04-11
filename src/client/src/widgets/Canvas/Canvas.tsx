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
  }
  
  componentWillUnmount()
  {
    /**
     * finalize instance
     */
    TetrinetSingleton.finalize();
  }
  
  /**
   *
   */
  // onPlayClicked = () =>
  // {
  //   TetrinetSingleton.getInstance().oldPlayMethod();
  // }

  onWatchClicked = () =>
  {
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
    return <div style={{display: "flex", flexDirection: "column", alignItems: "center", padding: "0 1rem"}}>
        <canvas id="canvas" width={960} height={750} ref={this._canvas}/>
    </div>
  }
}
