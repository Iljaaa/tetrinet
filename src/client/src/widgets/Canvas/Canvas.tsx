import React from "react";

import {SocketSingleton} from "../../Common/SocketSingleton";
import {TetrinetSingleton} from "../../Common/TetrinetSingleton";

import styles from "./Canvas.module.css"

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

    window.addEventListener("resize", this.onResize);
  }
  
  componentWillUnmount()
  {
    /**
     * finalize instance
     */
    TetrinetSingleton.finalize();

    //
    window.removeEventListener("resize", this.onResize)
    this.onResize()
  }

  onResize = () => {
    const x = 750 / 960
    if (this._canvas.current) {
      this._canvas.current.style.height = (x * this._canvas.current.offsetWidth) + "px";

    }

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
    return <div className={styles.CanvasWrap}>
        <canvas id="canvas" width={960} height={750} ref={this._canvas} className={styles.Canvas} />
    </div>
  }
}
