import React from "react";
import Modal from "react-modal";
import {TetrinetSingleton} from "../../Common/TetrinetSingleton";
import {TetrinetNetworkLayerSocketEvents} from "../../Common/TetrinetNetworkLayer";
import {ClearGameDataInStorage, LoadGameDataFromStorage} from "../../process/store";
import {BackModal} from "./BackModal";
import {BackToPartyIsFail} from "./BackToPartyIsFail";

type State = {
  showBackToGameModal: boolean,
  showBackToGameFailModal:boolean
  failMessage: string
}

class SocketsEventsAndModals extends React.PureComponent<{}, State> implements TetrinetNetworkLayerSocketEvents
{
  public state:State = {
    showBackToGameModal: false,
    showBackToGameFailModal: false,
    failMessage: '',
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
    // that was in store
    // todo: check date
    const data = LoadGameDataFromStorage()
    console.log ('SocketsEventsAndModals.onGraphicsLoaded', data);

    //
    if (data) this.setState({showBackToGameModal: true})
  }

  /**
   * Try to back to the game
   */
  onBackToStoredGame = () => {
    const data = LoadGameDataFromStorage()
    if (data && data.partyId && data.playerId){
      TetrinetSingleton.getInstance().backToGame(data.partyId, data.playerId, this.whenBackToStoredGameFails);
    }
  }

  /**
   * When we can not back to stored game
   * @param message
   */
  whenBackToStoredGameFails = (message:string) => {
    console.log('SocketsEventsAndModals.whenBackToStoredGameFails', message)
    this.setState({
      showBackToGameModal: false,
      showBackToGameFailModal: true,
      failMessage: message,
    })

  }

  /**
   * Cancel back to game
   */
  onCancelBackToStoredGame = () => {
    this.setState({showBackToGameModal: false})
    ClearGameDataInStorage()
  }

  onCloseBackFailModal = () => {
    this.setState({
      showBackToGameFailModal: false,
      failMessage: ''
    });

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

      <BackModal isOpen={this.state.showBackToGameModal}
                 customStyles={customStyles}
                 submit={this.onBackToStoredGame}
                 cancel={this.onCancelBackToStoredGame} />


      <BackToPartyIsFail isOpen={this.state.showBackToGameFailModal}
                         customStyles={customStyles}
                         message={this.state.failMessage}
                         cancel={this.onCloseBackFailModal}/>


    </div>;


  }


}

export default SocketsEventsAndModals;