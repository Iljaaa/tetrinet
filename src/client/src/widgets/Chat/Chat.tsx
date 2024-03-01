import React from "react";
import {Container} from "../../shared/ui/Container/Container";
import {TetrinetSingleton} from "../../Common/TetrinetSingleton";
import {ChatMessage} from "../../Common/Tetrinet/types/ChatMessage";

type State = {
  chat: Array<ChatMessage>
}

export class Chat extends React.PureComponent<{}, State>
{
  public state:State = {
    chat: []
  }

  componentDidMount() {
    // we subscribe to events
    TetrinetSingleton.getInstance().setChatChangeListener(this.onChatChange)
  }

  onChatChange = (chat:Array<ChatMessage>) => {
    console.log ('Chat.onChatChange', chat);
    this.setState({chat: chat})
  }

  render ()
  {
    console.log(this.state.chat, 'this.state.chat')
    return <Container variant={"gray"}>
      <h2>Chat</h2>
      <div>
        {this.state.chat.reverse().map((c:ChatMessage, index:number) => {
          return <div key={`chat_item_${index}`}><strong>{c.playerName}</strong>: {c.message} <i style={{fontSize:"80%"}}>{c.date}</i></div>
        })}
      </div>
    </Container>
  }

}