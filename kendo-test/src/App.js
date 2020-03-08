import React from 'react';
import './App.css';
import "@progress/kendo-theme-default/dist/all.css";
import { Chat } from "@progress/kendo-react-conversational-ui";
import axios from 'axios';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <h1>Conversational UI</h1>
        <Chat
          user={this.user}
          messages={this.state.messages}
          onMessageSend={this.addMessage}
          placeholder={"Type here..."}
          width={400}
        ></Chat>

      </div>
    );
  }

  constructor(props) {
    super(props);
    this.user = undefined;
    this.bot = { id: "0", name: "bot" };
    axios.post(`http://localhost:3000`,{"author":this.bot,"timestamp":new Date(),"text":"hello"})
    .then(res=>{
      console.log(res["data"]);
    }
    )
    this.state = {
      messages: [
        {
            author: this.bot,
            timestamp: new Date(),
            text: "Hello! Please enter a name in order to start a chat"
        }
      ]
    };

  }

  addMessage = ({ message }) => {
    if (!this.user) {
      this.user = { name: message.text, id: Date.now().toString() };
      console.log(message);
      let newMessage = Object.assign({}, message);
      axios.post(`http://localhost:3000`,newMessage)
      .then(res=>{
      newMessage.text = res['data'];
      newMessage.author = this.bot;
  
      this.setState({
        messages: [...this.state.messages, newMessage]
      });
      }
      )
  
    } else {
      //TODO: Send message across the channel
      let newMessage = Object.assign({}, message);
      axios.post(`http://localhost:3000`,newMessage)
      .then(res=>{
      newMessage.text = res['data'];
      newMessage.author = this.bot;
  
      this.setState({
        messages: [...this.state.messages, newMessage]
      });
      }
      )

    }
  };
  
  
}


export default App;
