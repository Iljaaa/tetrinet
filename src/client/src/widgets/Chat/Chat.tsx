import React from "react";
import {Container} from "../../shared/ui/Container/Container";
import {TetrinetSingleton} from "../../Common/TetrinetSingleton";
import {ChatMessage} from "../../Common/Tetrinet/types/ChatMessage";
import {MarkDown} from "../../process/MarkDown";

type State = {
  chat: Array<ChatMessage>,
  message: string
}

export class Chat extends React.PureComponent<{}, State>
{
  public state:State = {
    chat: [],
    message: ''
  }
  private _inputRef: React.RefObject<HTMLInputElement>;

  constructor(props: {}, context: any) {
    super(props, context);
    this._inputRef = React.createRef()
  }

  componentDidMount() {
    // we subscribe to events
    TetrinetSingleton.getInstance().setChatChangeListener(this.onChatChange)
  }


  componentWillUnmount() {
    this._inputRef.current?.removeEventListener('keyup', this.onInputKeyUp);
  }

  onChatChange = (chat:Array<ChatMessage>) => {
    this.setState({chat: chat})
  }

  /**
   * When focus on input message
   * w
   */
  onMessageInputFocus = () => {
    TetrinetSingleton.getInstance().disableInput()
    this._inputRef.current?.addEventListener('keyup', this.onInputKeyUp);
  }

  onMessageInputBlur = () => {
    TetrinetSingleton.getInstance().enableInput()
    this._inputRef.current?.removeEventListener('keyup', this.onInputKeyUp);
  }

  onInputKeyUp = (event:KeyboardEvent):void => {
    console.log (event.key, 'onInputKeyUp');
    if (event.key === 'Enter') this.sendMessage()
  }

  sendMessage = () => {
    if (this.state.message !== '') {
      TetrinetSingleton.getInstance().sendChatMessage(this.state.message);
      this.setState({message: ''})
    }
  }

  render ()
  {
    return <Container variant={"gray"}>
      <div style={{padding: '0 2rem'}}>
        <h2>Chat</h2>
        <div>
          {this.state.chat.reverse().map((c: ChatMessage, index: number) => {
            return <div key={`chat_item_${index}`}><strong>{c.playerName}</strong>:
              <span dangerouslySetInnerHTML={{__html: MarkDown(c.message)}} />
              &nbsp;<i style={{fontSize: "80%"}}>{c.date}</i></div>
          })}
        </div>
        <div style={{margin: "1rem 0 0 0", display: "flex", alignItems: "center"}}>
          <input type="text" value={this.state.message}
                 onChange={(event: React.ChangeEvent<HTMLInputElement>) => this.setState({message: event.target.value})}
                 onFocus={this.onMessageInputFocus}
                 onBlur={this.onMessageInputBlur}
                 ref={this._inputRef}
          />
          <button onClick={this.sendMessage}>send</button>
        </div>
      </div>
    </Container>
  }

}