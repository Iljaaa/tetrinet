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

  componentDidMount() {
    // we subscribe to events
    TetrinetSingleton.getInstance().setChatChangeListener(this.onChatChange)
  }

  onChatChange = (chat:Array<ChatMessage>) => {
    this.setState({chat: chat})
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
                 onChange={(event: React.ChangeEvent<HTMLInputElement>) => this.setState({message: event.target.value})}/>
          <button onClick={this.sendMessage}>send</button>
        </div>
      </div>
    </Container>
  }

}