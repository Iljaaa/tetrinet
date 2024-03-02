import React from "react";
import {GameState} from "../../Common/Tetrinet/types";
import {TetrinetSingleton} from "../../Common/TetrinetSingleton";
import {TetrinetEventListener} from "../../Common/TetrinetNetworkLayer";
import {PlayerNameHelper} from "../../Common/PlayerNameHelper";

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
    playerId: string,

    /**
     * Display player name
     */
    playerName: string
  }


export class StateRow extends React.PureComponent<{}, State> implements TetrinetEventListener
{

  /**
   * State
   */
  public state:State = {
    partyId: "",
    playerId: "",
    score: 0,
    playerName: ''
  }

  constructor(props: {}, context: any) {
    super(props, context);

    // write listener to change
    PlayerNameHelper.setPlayerNameChangeListener(this.onPlayerNameChange)
  }

  /**
   *
   */
  componentDidMount()
  {
    // set listen events
    TetrinetSingleton.getInstance().setGameDataEventListener(this)
  }


  onPlayerNameChange = (newPlayerName: string): void => {
    this.setState({playerName: newPlayerName})
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

  render ()
  {
    return <div style={{padding: "0 0 .75rem 2rem"}}>
      <div style={{display: "flex", alignItems: "center"}}>
        <div>score <b>{this.state.score}</b></div>
        <div style={{margin: "0 0 0 1rem"}}>
          name: <b>{PlayerNameHelper.getPlayerName()}</b>
          &nbsp;
          <span style={{color: "blue", textDecoration: 'underline', cursor: "pointer"}}
                onClick={() => PlayerNameHelper.editPlayerName()}>edit</span>
        </div>
        <div style={{margin: "0 0 0 1rem"}}>state: <b>{this.state.currentGameState}</b></div>
        <div style={{margin: "0 0 0 1rem"}}>partyId: <b>{this.state.partyId}</b></div>
        <div style={{margin: "0 0 0 1rem"}}>playerId: <b>{this.state.playerId}</b></div>
      </div>

    </div>
  }
}