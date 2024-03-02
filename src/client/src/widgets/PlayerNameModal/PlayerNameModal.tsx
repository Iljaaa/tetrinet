import React from "react";
import {Button} from "../../shared/ui/Button/Button";
import {MyModal} from "../../shared/ui/MyModal/MyModal";
import {Simulate} from "react-dom/test-utils";
import input = Simulate.input;
import {PlayerNameHelper} from "../../Common/PlayerNameHelper";

type Props = {
  // onSubmit: () => void
  // onCancel: () => void
}

type State = {
  isOpen: boolean,
  inputName: string
}

export class PlayerNameModal extends React.PureComponent<Props, State>
{
  public state:State = {
    isOpen: false,
    inputName: '',
  }

  componentDidMount()
  {
    // we will edit player name
    PlayerNameHelper.setRequestPlayerNameCallback(this.onRequestNewPlayerName)

    // init player name here, nut it must be somewhere else
    PlayerNameHelper.initPlayerName();
  }

  /**
   * On this callback we open edit username modal
   * @param playerName
   */
  onRequestNewPlayerName = (playerName:string) =>
  {
    this.setState({
      inputName: playerName,
      isOpen: true
    })
  }

  onSubmit = () =>
  {
    this.setState({isOpen: false})

    // call helper method
    PlayerNameHelper.setPlayerName(this.state.inputName)
  }

  onCancelClick = () => {
    this.setState({isOpen: false})
  }

  render ()
  {
    return <MyModal isOpen={this.state.isOpen}>
      <div style={{fontSize: "2rem", textAlign: "center"}}>Enter your name</div>
      <div style={{margin: "2rem 0", display: "flex", justifyContent: "center"}}>
        <input type="text"
               style={{width: "250px", fontSize: "2rem", textAlign: "center", padding: ".5rem"}}
               maxLength={100}
               value={this.state.inputName}
               onChange={(event:React.ChangeEvent<HTMLInputElement>) => this.setState({inputName: event.target.value})}></input>
      </div>

      <div style={{marginTop: '1rem', textAlign: "center"}}>
        <Button onClick={this.onSubmit} style={{marginRight: "1.5rem"}}>Ok</Button>
        <Button onClick={this.onCancelClick}>Cancel</Button>
      </div>
      </MyModal>
    }

}