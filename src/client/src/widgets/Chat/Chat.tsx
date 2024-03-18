import React from "react";
import {Container} from "../../shared/ui/Container/Container";
import {TetrinetSingleton} from "../../Common/TetrinetSingleton";
import {ChatMessage} from "../../Common/Tetrinet/types/ChatMessage";
import {MarkDown} from "../../process/MarkDown";
import {Button} from "../../shared/ui/Button/Button";

import styles from "./Chat.module.css"

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

  private readonly _inputRef: React.RefObject<HTMLInputElement>;

  constructor(props: {}, context: any) {
    super(props, context);
    // this._inputRef = React.createRef()
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
        <div style={{display: "flex", alignItems: "center"}}>
          <div>
            <input type="text"
                   value={this.state.message}
                   onChange={(event: React.ChangeEvent<HTMLInputElement>) => this.setState({message: event.target.value})}
                   onFocus={this.onMessageInputFocus}
                   onBlur={this.onMessageInputBlur}
                   ref={this._inputRef}
                   style={{width: "400px", marginRight: "2rem"}} />
          </div>
          <div>
            <Button onClick={this.sendMessage} variant={"small"}>send</Button>
          </div>
        </div>
        {this.state.chat.length > 0 && <div className={styles.ChtOutputWrap}>
          {this.state.chat.reverse().map((c: ChatMessage, index: number) => {
            return <div key={`chat_item_${index}`}><strong>{c.playerName}</strong>:
              <span dangerouslySetInnerHTML={{__html: MarkDown(c.message)}}/>
              &nbsp;<i style={{fontSize: "80%"}}>{c.date}</i></div>
          })}
        </div>
        }
      </div>
    </Container>
  }

}