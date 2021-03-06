import React from 'react';
import '../App.css';
import "@progress/kendo-theme-default/dist/all.css";
import { Chat } from '@progress/kendo-react-conversational-ui';
import { Button} from '@progress/kendo-react-buttons'
import axios from 'axios';
import classes from './Home.module.css';
import * as api from '../constants/api.js';
import * as keys from '../constants/keywords.js';
import { Keys } from '@progress/kendo-react-common';

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
			name: keys.BOT
        };
        
        this.agent = {
            id: "1",
            name: keys.RAINBOW_AGENT
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
            userWaiting: false,

            // Change state when agent is online
            agentOnline: false
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
        if (this.state.agentOnline){
            this.addRainbowMessage(event.message)
        }
		else if(this.bot.name === keys.BOT){
			this.addBotMessage(event.message)
		}
	};
	
    addBotMessage= (message ) => {
        let newMessage = Object.assign({}, message);
        if(message.text == "Where am I in the queue?"){
            this.getQueue(newMessage);
        }
        else{
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
                    if(messagecheck[0]=="Hi"){
                        this.user.name = messagecheck[1].slice(0,messagecheck[1].length-1);
                    }
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
                    // set userWaiting to true to disable text input until connection with agent is established
                    this.setState({
                        userWaiting: true
                    })

                    // get agent
                    this.getAgent();

                    // give user option to check queue
                    newMessage.suggestedActions = [
                        {
                            type: "reply",
                            value: "Where am I in the queue?"
                        }
                    ]
                }

                this.setState({
                    messages: [...this.state.messages, newMessage]
                });
            })  
        }
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
                console.log("END CALL")
                return
                break;
            case keys.REROUTE_KEYWORD:
                this.onReceiveReroute(lastMessage[1])
                break;
            case keys.REJECT_KEYWORD:
                this.onReceiveReject();
                break;
        }
       

        // create message that is suitable for kendo chat to display
        // it is already a rainbow agent
        let newMessage = Object.assign({});
        newMessage.text = lastMessage.join(" ");
        newMessage.author = this.agent;
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

    getQueue = (newMessage) =>{
        let url = api.URI + api.GET_QUEUE + "?" + api.TAG + "=" + this.state.tag + "&" + api.NAME + "=" + this.user.name;
        console.log(url);
        fetch(url)
            .then( (res) =>{
                console.log(res)
                res.json().then((data) =>{
                    if(data.queueposition == 0){
                        newMessage.text = "you are next in the queue! Please hold on."
                    }
                    else{
                        newMessage.text = "There is still " + data.queueposition + " people in front of you. Estimated waiting time is " + data.timeleft + " min."
                    }
                    newMessage.author = this.bot;
                    newMessage.suggestedActions = [
                        {
                            type: "reply",
                            value: "Where am I in the queue?"
                        }
                    ]

                    this.setState({
                        messages: [...this.state.messages, newMessage]
                    });
                            
                })
            })
    }
    getAgent = () =>{
        // parse url
        let url = api.URI+api.REQUEST_AGENT+"?"+api.TAG+"="+this.state.tag + "&" + api.NAME + "=" + this.user.name;
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
        // should not do this
        // this.bot.name = "rainbow agent";
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
    onReceiveReject= ()=>{
        this.setState({
            userWaiting: true,
            agentOnline: false
        });

        // get agent
        this.getAgent();
    }

    onReceiveAccept = () => {
        // set userWaiting to false to disable input
        this.setState({
            userWaiting: false,
            agentOnline: true
        });
    }

    // redirect to rainbow agent
    onReceiveReroute = (newTag) => {
        // if reroute successful, userWaiting to false
        this.setState({
            userWaiting: true,
            tag: newTag,
            agentOnline: false
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
        let problemMessage = Object.assign({})
        problemMessage.author = this.bot
        problemMessage.text = "If you still have any other problem, I would be happy to help"
        console.log("rainbowOnline" + this.state.rainbowOnline)
        this.setState({
            messages :[...this.state.messages,newMessage, problemMessage],
            agentOnline: false
        });
    }


    /******************************* Render  **********************************/

    render() {       
        return (
            <div>
                <div className={classes.Header}>
                    <h1 className={classes.Title} >Customer Service ChatBot</h1>
                </div>
                {//<p>{this.state.version}</p>
                }
                <Chat
                    className={classes.Chat} 
                    user={this.user}
                    messages={this.state.messages}
                    onMessageSend={this.addNewMessage}
                    placeholder={"Type a message..."}
                    width={400}>
                </Chat>
                <div className={classes.container}>
                    <Button className={classes.button} onClick={this.endCall}>End Chat</Button>
                    <Button className={classes.button} onClick={this.getAnotherAgent}>Get another Agent</Button>
                </div>
            </div>
        );
    }
}

export default Home
