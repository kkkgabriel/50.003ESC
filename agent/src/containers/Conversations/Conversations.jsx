import React, {Component} from 'react';
import { Chat } from '@progress/kendo-react-conversational-ui';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import * as consts from './constants.js';
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
class Conversations extends Component {

    constructor (props) {
        super(props);
        this.user = {
            name:"gabriel",
            id: 1,            
        };
        this.bot = {
            name:"other contact name",
             id: 0
            };

        this.state = {
            version: window.rainbowSDK.version(),
            conversations: [],
            conversation: {},
            visible:false,
            "isAvailable":false,
            messages: [		// for population of kendo
                {
                    author: this.bot,
                    timestamp: new Date(),
                    text: "Hello there."
                }
            ]

        }
		
        this.conversationsChangedHandler = this.conversationsChangedHandler.bind(this);
        // this.login();
        this.addNewMessage = this.addNewMessage.bind(this);
        this.sendToRainbow= this.sendToRainbow.bind(this);        
        this.toggleDialog = this.toggleDialog.bind(this);
        this.toggleisAvailable = this.toggleisAvailable.bind(this);
        this.reroute = this.reroute.bind(this);
        this.updateIncomingMessage = this.updateIncomingMessage.bind(this);
		this.updateRainbowMessages = this.updateRainbowMessages.bind(this);
		this.changeBot = this.changeBot.bind(this);

    }

    componentDidMount(){
        var conversations = window.rainbowSDK.conversations.getAllConversations();
        this.setState({
            conversations: conversations
        }, function(){
            // console.log("this is the callback");
            // console.log(that);
            document.addEventListener(
                window.rainbowSDK.conversations.RAINBOW_ONCONVERSATIONSCHANGED,
                this.conversationsChangedHandler
            );
        })
    }
    conversationsChangedHandler(){
        console.log("conversationsChangedHandler triggered"); 
        // console.log(this); 
        console.log(this.state); 
        // console.log(this.state.conversations);
        var conversations = this.state.conversations;
		if ( this.state.isAvailable ) {
			this.updateRainbowMessages();
		} else {
			this.findNewConversation();
		}
    }
    reroute(){
        console.log("this is rerouting");
    }

    toggleDialog() {
		console.log("toggling dialog");
        this.setState({
            visible: !this.state.visible
        });
    }
    
    toggleisAvailable(){
        this.setState({
            "isAvailable": !this.state.isAvailable,
            visible: !this.state.visible
        })
    }

    addNewMessage(event) {
        let myResponse = Object.assign({}, event.message);
        this.setState((prevState) => ({
            messages: [
                ...prevState.messages,
                myResponse
            ]
        }));
        this.sendToRainbow(event.message);
    };

    sendToRainbow(msg){
        // console.log("to add in rainbow send message here")
        console.log(msg);
		window.rainbowSDK.im.sendMessageToConversation(this.state.conversation, msg.text);
    }

    updateIncomingMessage(){
        let theirResponse = {
            author: this.user,
            text: "update text here",
            timestamp: new Date()
        }
        this.setState((prevState) => ({
            messages: [
                ...prevState.messages,
                theirResponse
            ]
        }))
    }

    findNewConversation(conversations){
        console.log(this.state.conversations)
        var i = 0;
        while (i < conversations.length ){
            try {
                if ( conversations[i].lastMessageText == consts.START_KEYWORD ){

					//let lm = conversations[i].messages[conversations[i].messages.length-1];
                    console.log("start found");
					this.setState({
						conversation: conversations[i]
					});
                    this.toggleDialog();
					this.changeBot(conversations[i].name.value);
					this.updateRainbowMessages();	// display messages from rainbow conversation onto the kendo chat element
					break;
					// i = conversations.length;	// break the loop
                }
            } catch (error) {
                // console.log(error);
            }
            i++;
        }
        return [];	// return empty conversation
    }


    login(){
        console.log("I m here");
        var myRainbowLogin = "AccountsNBills@gmail.com";
        var myRainbowPassword = "Longpassword!1";
        // var strId = "5e52a877b4528b74a00c92df";
        let that = this;
        window.rainbowSDK.connection.signin(myRainbowLogin, myRainbowPassword)
        .then(function(){
            console.log("sign in successful");
            var conversations = window.rainbowSDK.conversations.getAllConversations();
            // console.log(conversations);

            that.setState({
                conversations: conversations
            }, function(){
                // console.log("this is the callback");
                // console.log(that);
				document.addEventListener(
					window.rainbowSDK.conversations.RAINBOW_ONCONVERSATIONSCHANGED,
					this.conversationsChangedHandler
				);
            });
            console.log(that.state.conversations);
        })
        .catch(function(err){
            console.log("sign in failed");
            console.log(err);
        });
    }

    render(){
        var redirect = null
        if (this.props.account.token === null) {
            redirect = (
                <Redirect to="/"/>
            )
        }
        console.log(this.state.conversations)
        return (
            <div>
                {redirect}
                <h1>Welcome</h1>
                {this.state.visible && 
                <Dialog title={"Please confirm"} onClose={this.toggleDialog}>
                    <p style={{ margin: "25px", textAlign: "center" }}>{this.bot["name"]} is trying to connect to you. Do you want to accept?</p>
                    <DialogActionsBar>
                        <button className="k-button" onClick={this.toggleDialog}>Decline</button>
                        <button className="k-button" onClick={this.toggleisAvailable}>Accept</button>
                    </DialogActionsBar>
                </Dialog>}
            {this.state.isAvailable ? (
                <div>
                <Chat user={this.user}
                    messages={this.state.messages}
                    onMessageSend={this.addNewMessage}
                    placeholder={"Type a message..."}
                    width={400}>
                </Chat>
                <button className="k-button" onClick={this.reroute}>Reroute </button>
                </div>
            ): null}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        account: state.auth
    }
}
export default connect(mapStateToProps)(Conversations);