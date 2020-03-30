import React from 'react';
import '../App.css';
import "@progress/kendo-theme-default/dist/all.css";
import { Chat } from '@progress/kendo-react-conversational-ui';
import axios from 'axios';

const dialogFlowBaseUrl = "http://localhost:3005"
const START_KEYWORD = "start"
const ACCEPT_KEYWORD = "accept"

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
        this.state = {
            messages: [
                {
                    author: this.bot,
                    timestamp: new Date(),
                    text: " Hello! Please enter a name in order to chat ",
                }
            ],
            conversation: '',
            contact: ''
		};
		// This allows us to have event hadnler that handles this
		this.addNewMessage = this.addNewMessage.bind(this);
	}

    componentDidMount(){
        this.login();
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
            // console.log(event);
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
                this.bot = { 
                    name: "rainbow agent", 
                    id: Date.now().toString()
                };

                // disable text input until connection with agent is established
                this.disableTextInput(true);

                // Add REST API call here to get the available agent ID
                let agentId = "5e600991d8084c29e64eb436"; // Mobile postpaid

                // establish connection
                this.openConversationWithAgentId(agentId);

            }
            this.setState({
                messages: [...this.state.messages, newMessage]
            });
		})	
	}

	addRainbowMessage = (message) =>{
		window.rainbowSDK.im.sendMessageToConversation(this.state.conversation, message.text);
		let newMessage = Object.assign({}, message);
		newMessage.author = this.user
		newMessage.text = message.text;
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

    login = () => {

        // Add REST API call here to replace the hardcoded username and pw
        var rainbowLogin = "user1@singco.com";
        var rainbowPassword = "Longpassword!1";

        if (typeof window.rainbowSDK === 'undefined'){
            return
        }

        // console.log("logging in");
        window.rainbowSDK.connection.signin(rainbowLogin, rainbowPassword)
            .then(account => {
                console.log("Successful Login");
                console.log(account);
            })
            .catch(err => {
                console.log("failed to login")
                console.log(err);
            })
    }

    openConversationWithAgentId = (strId) =>{
        let that = this;

        // look for contact with id
        window.rainbowSDK.contacts
            .searchById(strId)
            .then(function(contact){
                console.log("found contact");
                // console.log(contact)

                that.setState({
                    contact: contact
                })

                // look for conversation with contact
                window.rainbowSDK.conversations  
                .openConversationForContact(contact)
                .then(function(conversation){
                    console.log("conversation opened!");
                    // console.log(conversation);
                    that.setState({
                        conversation: conversation
                    })

                    // start listening to conversation change
                    that.addConversationListener();

                    // send start keyword
                    that.sendKeyword(START_KEYWORD);

                })
                .catch(function(err){
                    console.log(err);
                });
            })
            .catch(function(err){
                console.log(err);
            });

    }

    addConversationListener = () => {
        document.addEventListener(
            window.rainbowSDK.conversations.RAINBOW_ONCONVERSATIONCHANGED,
            this.conversationChangedHandler
        );
    }

    sendKeyword = (keyword) => {
        window.rainbowSDK.im.sendMessageToConversation(this.state.conversation, keyword);
    }


    conversationChangedHandler = (convo) =>{
        // get the last message
        let lastMessage = this.state.conversation.lastMessageText;
        // console.log(lastMessage)

        // special case "accept" keyword
        if ( lastMessage == ACCEPT_KEYWORD ){

            // enabling the text input
            this.disableTextInput(false);
        }

        // create message that is suitable for kendo chat to display
        let newMessage = Object.assign({});
        newMessage.text = lastMessage;
        newMessage.author = this.bot;
        this.setState({
            messages: [...this.state.messages, newMessage]
        });
    }

    disableTextInput = (bool) =>{
        document.getElementsByClassName('k-input')[0].disabled = bool;
    }

    reroute = () => {

    }

    render() {       
        return (
            <div>
                <h1>Convsersational UI</h1>
                <p>{this.state.version}</p>
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
