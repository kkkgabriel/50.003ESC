import ReactDOM from 'react-dom';
import React from 'react';
import Login from './Login/Login'
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import { Chat } from '@progress/kendo-react-conversational-ui';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.rainbowSignIn();
        this.user = {
            name:"gabriel",
            id: 1,            
        };
        this.bot = {
            name:"other contact name",
             id: 0
            };
        this.state = {
            "version": rainbowSDK.version(),
            visible:false,
            "isAvailable":false,
            messages: [
                {
                    author: this.bot,
                    timestamp: new Date(),
                    text: "Hello there."
                }
            ]
        };
        this.addNewMessage = this.addNewMessage.bind(this);
        this.sendToRainbow= this.sendToRainbow.bind(this);        
        this.toggleDialog = this.toggleDialog.bind(this);
        this.toggleisAvailable = this.toggleisAvailable.bind(this);
        this.reroute = this.reroute.bind(this);
        this.updateIncomingMessage = this.updateIncomingMessage.bind(this);
        this.rainbowSignIn = this.rainbowSignIn.bind(this);

        let onNewMessageReceived = function(event){
            console.log("this works")
            this.toggleDialog();
            
        }
        document.addEventListener(rainbowSDK.im.RAINBOW_ONNEWIMMESSAGERECEIVED, onNewMessageReceived)
    }


    rainbowSignIn(){
        var rainbowLogin = "HomeLine@gmail.com";
        var rainbowPassword = "Longpassword!1";
        rainbowSDK.connection.signin(rainbowLogin,rainbowPassword)
        .then(function(account){
            console.log("this works!")
        })
        .catch(function(err){
            console.log(err)
        })

    }
    reroute(){
        console.log("this is rerouting");
    }
    toggleDialog() {
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


    sendToRainbow(question){
        console.log("to add in rainbow send message here")
        
    }

    updateIncomingMessage(){
        let theirResponse = {
            author: this.bot,
            text: "update text here",
            timestamp: new Date()
        }
        this.setState((prevState) => ({
            messages: [
                ...prevState.messages,
                theirResponse
            ]
        }));

    }

    render() {
        
        return (
            <div>
                <button className="k-button" onClick={this.toggleDialog}>Open Dialog</button>
                {this.state.visible && <Dialog title={"Please confirm"} onClose={this.toggleDialog}>
        <p style={{ margin: "25px", textAlign: "center" }}>{this.user["name"]} is trying to connect to you. Do you want to accept?</p>
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
                <button className="k-button" onClick={this.updateIncomingMessage}> updateIncomingMessage</button>
                </div>
            ): null}
            </div>
        );
    }

}
