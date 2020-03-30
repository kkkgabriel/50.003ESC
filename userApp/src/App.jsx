import React from 'react';
import './App.css';
import "@progress/kendo-theme-default/dist/all.css";
import { Chat } from '@progress/kendo-react-conversational-ui';
<<<<<<< HEAD
import Home from './containers/Home';
=======
import { Button} from '@progress/kendo-react-buttons'
>>>>>>> diagonold
import axios from 'axios';

const dialogFlowBaseUrl = "http://localhost:3000"
export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.user = {
			id: 1,
			name: undefined
		}
        this.bot = {
			id: "0", 
			name: "bot" 
		}
        axios.post(
			dialogFlowBaseUrl,
			{"author":this.bot,
			"timestamp":new Date(),
			"text":"hello"})
        	.then(res=>{
            	console.log(res["data"]);
        	})
        this.state = {
            //"version": rainbowSDK.version(),
            messages: [
                {
                    author: this.bot,
                    timestamp: new Date(),
                    text: " Hello! Please enter a name in order to chat ",
					suggestedActions: [
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
					}]
			}],
			// Change state when rerouting is complete
			"rainbowOnline": false,
			// Change state when user is waiting, 
			"userWaiting": false
		};
		// This allows us to have event hamdler to handle this event
		this.addNewMessage = this.addNewMessage.bind(this);
	}



    addNewMessage = (event) => {
		let value = this.parseText(event);
        if (!event.value && !this.state.userWaiting) {
            this.setState((prevState) => {
                return { messages: [ ...prevState.messages, { author: this.user, text: value, timestamp: new Date() } ] };
            });
		}

		if(this.bot.name === "bot"){
			this.addBotMessage(event.message)
		}
		else{
			if(this.state.rainbowOnline){
				this.addRainbowMessage(event.message)
			}
		}
	};
	

	addBotMessage= (message ) => {
		let newMessage = Object.assign({}, message);
		axios.post(dialogFlowBaseUrl,newMessage)
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
		  // When this is switching, mute user by setting userWaiting to true
		  this.setState({ userWaiting:true})
		  this.bot = { name: "rainbow agent", id: Date.now().toString() };
		}
		this.setState({
		  messages: [...this.state.messages, newMessage],
		});
		}
		)	
	}

	addRainbowMessage = (message) =>{
		//TODO: fill in rainbow api messages here.
		let newMessage = Object.assign({}, message);
		newMessage.author = this.bot
		newMessage.text = "this is the placeholder for rainbow"
		// When rainbow has arrived, we enable console again
		this.setState({
		  messages: [...this.state.messages, newMessage]
		});
	
	  }

	parseText = ( event ) => {
        if (event.action !== undefined) {
            return event.action.value;
        } else if ( event.value ) {
            return event.value;
        } else {
            return event.message.text;
        }
	}

	// reroute to rainbow agent
	// set this.rainbowOnline to true
	// also set this.userWaiting to false
	reroute = () => {
		// if reroute successful
		this.setState({
			userWaiting: false,
			rainbowOnline: true
		});
	}
	
	// Ends the call with rainbow Agent
	// TODO:
	//
	endCall = ()=>{
		// The bot should be the one ending the message
		this.bot = { name: "bot", id: Date.now().toString() }
		let newMessage = Object.assign({});
		newMessage.author = this.bot
		newMessage.text = "Chat Session ended"
		console.log("rainbowOnline" + this.state.rainbowOnline)
		this.setState({
			messages :[...this.state.messages,newMessage]
		});
	}

	


    render() {       
        return (
            <div>
                <h1>Conversational UI</h1>
                <Chat user={this.user}
                    messages={this.state.messages}
                    onMessageSend={this.addNewMessage}
                    placeholder={"Type a message..."}
                    width={400}>
               </Chat>
			   <Button onClick={this.endCall}>End Chat</Button>
            </div>
        );
    }
}
