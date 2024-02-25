import React from "react";
import Modal from "react-modal";
import {TetrinetSingleton} from "../../Common/TetrinetSingleton";
import {TetrinetNetworkLayerSocketEvents} from "../../Common/TetrinetNetworkLayer";
import {ClearGameDataInStorage, LoadGameDataFromStorage} from "../../process/store";

type State = {
  showBackToGameWindow: boolean
}

class SocketsEventsAndModals extends React.PureComponent<{}, State> implements TetrinetNetworkLayerSocketEvents
{
  public state:State = {
    showBackToGameWindow: false
  }

  componentDidMount() {
    TetrinetSingleton.getInstance().setSocketEventListener(this)
  }

  OnClose(): void {
    console.log ('SocketsEventsAndModals.onClose');
  }

  onError(): void {
    console.log ('SocketsEventsAndModals.onError');
  }

  onGraphicsLoaded(): void {
    console.log ('SocketsEventsAndModals.onGraphicsLoaded');

    // check data in storage
    const data = LoadGameDataFromStorage()
    console.log ('SocketsEventsAndModals.onGraphicsLoaded', data);
    if (data) this.setState({showBackToGameWindow: true})
  }

  /**
   * Try to back to the game
   */
  onBackToStoredGame = () => {
    TetrinetSingleton.getInstance().backToGame();
  }

  /**
   * Cancel back to game
   */
  onCancelBackToStoredGame = () => {
    this.setState({showBackToGameWindow: false})
    ClearGameDataInStorage()
  }


  render()
  {
    const customStyles = {
      content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
      },
    };

    return <div>

        <Modal
          isOpen={false}
          style={customStyles}
          onRequestClose={() => {
          }}
          contentLabel="Example Modal"
        >
          <div>I am a modal</div>
          <form>
            <input/>
            <button>tab navigation</button>
            <button>stays</button>
            <button>inside</button>
            <button>the modal</button>
          </form>
        </Modal>

        <Modal
          isOpen={this.state.showBackToGameWindow}
          style={customStyles}
          onRequestClose={() => {
            console.log ('Modal request close')
          }}
          contentLabel="Example Modal"
        >
          <div style={{color: "black"}}>We found not finished game in your store.</div>
          <div style={{color: "black"}}>Do you want to back to this game?</div>
          <div>
            <button onClick={this.onBackToStoredGame}>Yes</button>
            <button onClick={this.onCancelBackToStoredGame}>No</button>
          </div>
        </Modal>

    </div>;


  }


}

export default SocketsEventsAndModals;