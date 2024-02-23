import React from "react";
import {GameState} from "../../Common/Tetrinet/types";
import {TetrinetSingleton} from "../../Common/TetrinetSingleton";
import {TetrinetEventListener} from "../../Common/TetrinetNetworkLayer";

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


export class StateRow extends React.PureComponent<{}, State> implements TetrinetEventListener{

  /**
   * State
   * todo: remove state from here
   */
  public state:State = {
    partyId: "",
    playerId: "",
    score: 0
  }

  /**
   *
   */
  componentDidMount()
  {
    // init graphic
    TetrinetSingleton.getInstance().setEventListener(this)
  }

  onGameStateChange(state: GameState): void {
    this.setState({currentGameState: state})
  }

  onPartyIdChange(partyId: string): void {
    this.setState({partyId: partyId})
  }

  onPlayerIdChange(playerId: string): void {
    this.setState({playerId: playerId})
  }

  onScoreChange(score: number): void {
    this.setState({score: score})
  }



  render () {
    return <div style={{paddingLeft: "1rem"}}>
      <div style={{display: "flex", alignItems: "center"}}>
        <div>score <b>{this.state.score}</b></div>
        <div style={{margin: "0 0 0 1rem"}}>state: <b>{this.state.currentGameState}</b></div>
        <div style={{margin: "0 0 0 1rem"}}>partyId: <b>{this.state.partyId}</b></div>
        <div style={{margin: "0 0 0 1rem"}}>playerId: <b>{this.state.playerId}</b></div>
      </div>
    </div>
  }
}