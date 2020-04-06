import React from 'react';
import '../App.css';
import "@progress/kendo-theme-default/dist/all.css";
import { Chat } from '@progress/kendo-react-conversational-ui';
import { Button} from '@progress/kendo-react-buttons'
import axios from 'axios';
import * as api from '../constants/api.js';
import * as keys from '../constants/keywords.js';

const dialogFlowBaseUrl = "http://localhost:3005";

class Home extends React.Component {

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
			{
                "author":this.bot,
    			"timestamp":new Date(),
    			"text":"hello"
            })
            .then(res=>{
                console.log(res["data"]);
            })
        this.state = {
            messages: [
                {
                    author: this.bot,
                    timestamp: new Date(),
                    text: " Hello! Please enter a name in order to chat ",
                }
            ],
            conversation: '',
            contact: '',
            tag: '',

            // Change this to true once done talking to bot
            rainbowOnline: false,

            // Change state when user is waiting, 
            userWaiting: false
		};
		// This allows us to have event hadnler that handles this
		this.addNewMessage = this.addNewMessage.bind(this);
	}


    /******************************* Lifecycle methods **********************************/
    componentDidMount(){
        this.login();
    }

    componentDidUpdate(prevProps, prevState) {
        // Listen for change in userWaiting state
        if ( prevState.userWaiting !== this.state.userWaiting ){

            // enable/disable the text input whereever necessary
            this.disableTextInput(this.state.userWaiting);
        }
    }

    /******************************* methods to add newmessages **********************************/
    addNewMessage = (event) => {
		let value = this.parseText(event);
		
        if (!event.value) {
            // console.log("this is event value: "+value)
            if (!this.state.rainbowOnline){
                this.checkForTag(value);
            }
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
                    {
                        type: "reply",
                        value: "Lifestyle"
                    }
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

                // set userWaiting to true to disable text input until connection with agent is established
                this.setState({
                    userWaiting: true
                })

                // get agent
                this.getAgent();
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

    /******************************* methods to receive new messages **********************************/

    conversationChangedHandler = (convo) =>{
        // get the last message
        var lastMessage = this.state.conversation.lastMessageText.split(" ");
        console.log("this is last message: " + lastMessage[0])

        // special cases
        switch (lastMessage[0]){
            case keys.ACCEPT_KEYWORD:
                this.onReceiveAccept();
                break;
            case keys.END_KEYWORD:
                this.onReceiveEndCall();
                break;
            case keys.REROUTE_KEYWORD:
                this.onReceiveReroute(lastMessage[1])
                break;
        }
       

        // create message that is suitable for kendo chat to display
        let newMessage = Object.assign({});
        newMessage.text = lastMessage;
        newMessage.author = this.bot;
        this.setState({
            messages: [...this.state.messages, newMessage]
        });
    }


    /******************************* MISC methods  **********************************/

    sendKeyword = (keyword) => {
        window.rainbowSDK.im.sendMessageToConversation(this.state.conversation, keyword);
    }

    disableTextInput = (bool) =>{
        document.getElementsByClassName('k-input')[0].disabled = bool;
    }

    checkForTag = (msg)=>{
        let newTag = "";
        switch(msg){
            case "Accounts and bills":
                newTag = "AccountsNBills";
                break;
            case "Broadband":
                newTag = "Broadband";
                break;
            case "Home line":
                newTag = "HomeLine";
                break;
            case "Mobile prepaid":
                newTag = "MobilePrepaid";
                break;
            case "Mobile postpaid":
                newTag = "MobilePostpaid";
                break;
            case "Online purchases":
                newTag = "OnlinePurchase";
                break;
            case "Lifestyle":
                newTag = "Lifestyle";
                break;
            case "Singtel TV":
                newTag = "TV";
                break;
        }
        // console.log(msg);
        // console.log(newTag);
        if (newTag != ""){
            this.setState({
                tag: newTag
            });
        }
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

    addConversationListener = () => {
        document.addEventListener(
            window.rainbowSDK.conversations.RAINBOW_ONCONVERSATIONCHANGED,
            this.conversationChangedHandler
        );
    }

    /******************************* api methods  **********************************/
    getAgent = () =>{
        // parse url
        let url = api.URI+api.REQUEST_AGENT+"?"+api.TAG+"="+this.state.tag;
        console.log(url);

        fetch(url)
            .then( (res) => {
                console.log(res)
                res.json().then((data)=>{
                    console.log(data)

                    if (data.success){

                        let agentId = data.agentId;
                        // console.log(agentId);

                        // establish connection
                        this.openConversationWithAgentId(agentId);
                    }
                })
            })
            .catch(function(err) {
                console.log('Fetch Error :-S', err);
            });
    }

    // Gets another agent different from the current one
    getAnotherAgent = () =>{
        // send keyword to agent so agent knows to set availabilty to available
        this.sendKeyword(keys.END_KEYWORD);

        let notemail = this.state.contact.loginEmail;
        console.log(notemail);

        // parse url
        let url = api.URI+api.REQUEST_AGENT+"?"+api.TAG+"="+this.state.tag+"&"+api.NOTEMAIL+"="+notemail;
        // console.log(url);
        
        fetch(url)
            .then( (res) => {
                // console.log(res)
                res.json().then((data)=>{
                    console.log(data)

                    if (data.success){

                        let agentId = data.agentId;
                        // console.log(agentId);

                        // establish connection
                        this.openConversationWithAgentId(agentId);
                    }
                })
            })
            .catch(function(err) {
                console.log('Fetch Error :-S', err);
            });
    }

    login = () => {
        // Add REST API call here to replace the hardcoded username and pw
        // var rainbowLogin = "user1@singco.com";
        // var rainbowPassword = "Longpassword!1";

        let url = api.URI+api.GET_ANON;
        console.log(url);
        fetch(url)
            .then( (res) => {
                res.json().then((data)=>{
                    // console.log(data)

                    if (data.status.success){
                        let rainbowLogin = data.loginEmail;
                        let rainbowPassword = data.password;

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
                })
            })
            .catch(function(err) {
                console.log('Fetch Error :-S', err);
            });

        if (typeof window.rainbowSDK === 'undefined'){
            return
        }
    }
   
    
    // Ends the call with rainbow Agent
    endCall = ()=>{

        // send keyword to agent so agent knows to set availabilty to available
        this.sendKeyword(keys.END_KEYWORD);

        // handle as if agent sends the end call
        this.onReceiveEndCall();
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
                    that.sendKeyword(keys.START_KEYWORD);

                })
                .catch(function(err){
                    console.log(err);
                });
            })
            .catch(function(err){
                console.log(err);
            });
    }    

    /******************************* keyword handler methods  **********************************/
    onReceiveAccept = () => {
        // set userWaiting to false to disable input
        this.setState({
            userWaiting: false
        });
    }

    // redirect to rainbow agent
    onReceiveReroute = (newTag) => {
        // if reroute successful, userWaiting to false
        this.setState({
            userWaiting: true,
            tag: newTag
        });

        // get agent
        this.getAgent();
    }

    onReceiveEndCall = () =>{

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


    /******************************* Render  **********************************/

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
               <Button onClick={this.endCall}>End Chat</Button>
               <Button onClick={this.getAnotherAgent}>Get another Agent</Button>
            </div>
        );
    }
}

export default Home
