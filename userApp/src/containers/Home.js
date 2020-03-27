import React from 'react';
import './App.css';
import "@progress/kendo-theme-default/dist/all.css";
import { Chat } from '@progress/kendo-react-conversational-ui';
import axios from 'axios';

const dialogFlowBaseUrl = "http://localhost:6000"
class Home extends React.Component{
    constructor(props) {
        super(props);
        this.user = {
			id: 1,
			name: undefined
		}
        this.bot = {
			id: "0", 
			name: "bot" 
        };
        
        this.agent = {
            id: "2",
            name: "agent"
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
                }
            ]
		};
		// This allows us to have event hadnler that handles this
		this.addNewMessage = this.addNewMessage.bind(this);
	}

    addNewMessage = (event) => {
		let value = this.parseText(event);
		
        if (!event.value) {
            this.setState((prevState) => {
                return { messages: [ ...prevState.messages, { author: this.user, text: value, timestamp: new Date() } ] };
            });
		}

		if(this.bot.name === "bot"){
			this.addBotMessage(event.message)
		}
		else{
			this.addRainbowMessage(event.message)
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
                this.bot = { name: "rainbow agent", id: Date.now().toString() };
            }
            this.setState({
                messages: [...this.state.messages, newMessage]
            });
		}
		)	
	}

	addRainbowMessage = (message) =>{
		//TODO: fill in rainbow api messages here.
		let newMessage = Object.assign({}, message);
		newMessage.author = this.bot
		newMessage.text = "this is the placeholder for rainbow"
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

    reroute = () => {

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
            </div>
        );
    }
}

export default Home
