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
      //TODO: Send message across the channel
      this.newMessageUser(message);
      if(this.bot.name==="bot"){
        this.newMessageBot(message);
      }
      else{
        this.newMessageRainbow(message);
      }
  }

  
  newMessageUser(message){
    if (!this.user) {
      this.user = { name: message.text, id: Date.now().toString() };
    }
    
    let newMessage = Object.assign({}, message);
    newMessage.text = message.text;
    newMessage.author = this.user;

    this.setState({
      messages: [...this.state.messages, newMessage]
    });
  }
    

    
  

  newMessageBot(message){
    let newMessage = Object.assign({}, message);
    axios.post(`http://localhost:3000`,newMessage)
    .then(res=>{
    newMessage.text = res['data'];
    newMessage.author = this.bot;
    var messagecheck = newMessage.text.split(" ");
    console.log(messagecheck)
    if(messagecheck[messagecheck.length-1]==="problem?"){
      newMessage.suggestedActions= [
        {
          type: "reply",
          value: "Accounts and bills"
        },        
        {
          type: "reply",
          value: "Broadband"
        },
        {
          type: "reply",
          value: "Home line"
        },
        {
          type: "reply",
          value: "Mobile prepaid"
        },
        {
          type: "reply",
          value: "Mobile postpaid"
        },
        {
          type: "reply",
          value: "Online purchases"
        },
        {
          type: "reply",
          value: "Singtel TV"
        },

      ];
    }
    if(messagecheck[messagecheck.length-1]==="right?"){
      newMessage.suggestedActions= [
        {
          type: "reply",
          value: "Yes"
        },        
        {
          type: "reply",
          value: "No"
        }
      ];
    }
    if(messagecheck[messagecheck.length-1]==="agent!"){
      console.log("switching over to rainbow");
      this.bot = { name: "rainbow agent", id: Date.now().toString() };
    }
    this.setState({
      messages: [...this.state.messages, newMessage]
    });
    }
    )

    
  }

  newMessageRainbow(message){
    //TODO: fill in rainbow api messages here.
    let newMessage = Object.assign({}, message);
    newMessage.author = this.bot
    newMessage.text = "this is the placeholder for rainbow"
    this.setState({
      messages: [...this.state.messages, newMessage]
    });

  }
  
}



export default App;
