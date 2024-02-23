import React from "react";

import {GameState} from "./Common/Tetrinet/types";
import {CupData} from "./Common/Tetrinet/models/CupData";
import {SocketSingleton} from "./Common/SocketSingleton";
import {TetrinetSingleton} from "./Common/TetrinetSingleton";

type State =
{
  /**
   * Current score
   */
  score: number,
  
  /**
   * Cup state
   */
  currentGameState?:GameState
  
  /**
   * Party id
   */
  partyId: string,

  /**
   * this is your socket id
   */
  playerId: string
}


/**
 * Collection of cups data received from server
 * after update
 */
export interface CupsDataCollection {
  [index: string]: CupData
}

export class Canvas extends React.PureComponent<{}, State>
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

  /**
   * State
   * todo: remove state from here
   */
  public state:State = {
    partyId: "",
    playerId: "",
    score: 0
  }

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
   * @deprecated
   * Here we send request to opponent to add few rows
   */
  // sendAddLineToOpponent (countClearedLines:number) {
  //   //
  //   if (countClearedLines > 1)
  //   {
  //     // send command
  //     const data = {
  //       type: RequestTypes.addLine,
  //       partyId: this.partyId,
  //       partyIndex: this.partyIndex as number,
  //       linesCount: countClearedLines - 1,
  //       source: this.partyIndex, // now this is same that partyIndex
  //       target: null, // target should be selected player, but now we have only two players
  //   }
  //
  //     SocketSingletone.getInstance()?.sendData(data)
  //   }
  // }



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
  onPauseClicked = () =>
  {
    console.log ('onPauseClicked');
    TetrinetSingleton.getInstance().pause();

  }

  /**
   * Resume clicked
   */
  onResumeClicked = () =>
  {
    console.log ('onResumeClicked');

    TetrinetSingleton.getInstance().resume();
  }

  /**
   * Here we join duel
   */
  onJoinToDuelClicked = () =>
  {
    console.log ('onJoinToDuelClicked')
    TetrinetSingleton.getInstance().joinToParty('duel')
  }

  /**
   * Here we join party
   */
  onJoinToPartyClicked = () =>
  {
    console.log ('onJoinToDuelClicked');
    TetrinetSingleton.getInstance().joinToParty('party')
  }

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
    })
    
  }




  render () {
    return <div style={{display: "flex", flexDirection: "column", alignItems: "center", padding: "0 1rem"}}>

      <div style={{display: "flex", alignItems: "center", marginBottom: "1rem", width: "100%"}}>
        <div style={{display: "flex", alignItems: "center", flex: "1"}}>
          <div>
            <button onClick={this.onPlayClicked} disabled={true}>Play</button>
            <button onClick={this.onJoinToDuelClicked}>Duel</button>
            <button onClick={this.onJoinToPartyClicked}>Party 5</button>
          </div>
          <div>
            <button onClick={this.onPauseClicked}>Pause</button>
            <button onClick={this.onResumeClicked}>Resume</button>
          </div>
          <div>
            <button onClick={this.onWatchClicked} disabled={true}>Watch</button>
          </div>
        </div>
        <div>
          <div style={{display: "flex", alignItems: "center"}}>
            <div>score <b>{this.state.score}</b></div>
            <div style={{margin: "0 0 0 1rem"}}>state: <b>{this.state.currentGameState}</b></div>
            <div style={{margin: "0 0 0 1rem"}}>partyId: <b>{this.state.partyId}</b></div>
            <div style={{margin: "0 0 0 1rem"}}>playerId: <b>{this.state.playerId}</b></div>
          </div>
        </div>
      </div>

      <div>
        <canvas id="canvas" width={960} height={750} style={{border: "solid 2px orange"}} ref={this._canvas}/>
      </div>
    </div>
  }
}
