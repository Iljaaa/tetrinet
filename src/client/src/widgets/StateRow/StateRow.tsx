import React from "react";
import {GameState} from "../../Common/Tetrinet/types";
import {TetrinetSingleton} from "../../Common/TetrinetSingleton";
import {TetrinetEventListener} from "../../Common/TetrinetNetworkLayer";
import {InputNameModal} from "../InputNameModal/InputNameModal";
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
     * This is player name
     */
    playerName: string

    /**
     *
     */
    showRequestPlayerNameModal: boolean
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
    playerName: '',
    // todo: move edit player name modal to stand alone component
    showRequestPlayerNameModal: false
  }

  /**
   *
   */
  componentDidMount()
  {
    // set listen events
    TetrinetSingleton.getInstance().setGameDataEventListener(this)

    // write listener to change
    PlayerNameHelper.setPlayerNameChangeListener(this.onPlayerNameChange)

    // we will edit player name
    PlayerNameHelper.setRequestPlayerNameCallback(this.onRequestNewPlayerName)
    // TetrinetSingleton.getInstance().setRequestPlayerNameCallback(this.onRequestNewPlayerName)
  }

  /**
   * On this callback we open edit username modal
   * @param playerName
   */
  onRequestNewPlayerName = (playerName:string) =>
  {
    this.setState({
      playerName: playerName,
      showRequestPlayerNameModal: true
    })
  }

  onPlayerNameSubmit = () => {
    // if (this.onPlayerNameSubmitCallback) this.onPlayerNameSubmitCallback(this.state.playerName)
    // close modal
    this.setState({showRequestPlayerNameModal: false})

    //
    PlayerNameHelper.setPlayerName(this.state.playerName)

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

  onPlayerNameChange = (newPlayerName: string): void => {
    this.setState({playerName: newPlayerName})
  }


  render ()
  {
    return <div style={{padding: "0 0 .75rem 2rem"}}>
      <div style={{display: "flex", alignItems: "center"}}>
        <div>score <b>{this.state.score}</b></div>
        <div style={{margin: "0 0 0 1rem"}}>
          name: <b>{this.state.playerName}</b>
          &nbsp;
          <span style={{color: "blue", textDecoration: 'underline', cursor: "pointer"}}
                onClick={() => this.setState({showRequestPlayerNameModal: true})}>edit</span>
        </div>
        <div style={{margin: "0 0 0 1rem"}}>state: <b>{this.state.currentGameState}</b></div>
        <div style={{margin: "0 0 0 1rem"}}>partyId: <b>{this.state.partyId}</b></div>
        <div style={{margin: "0 0 0 1rem"}}>playerId: <b>{this.state.playerId}</b></div>
      </div>

      <InputNameModal playerName={this.state.playerName}
                      onPlayerNameChange={(newPlayerName:string) => this.setState({playerName: newPlayerName})}
                      isOpen={this.state.showRequestPlayerNameModal}
                      onSubmit={this.onPlayerNameSubmit}
                      onCancel={() => this.setState({showRequestPlayerNameModal: false})} />

    </div>
  }
}