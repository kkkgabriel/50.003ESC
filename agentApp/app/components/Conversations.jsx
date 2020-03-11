import React, { Component } from 'react';

class Conversations extends Component {

    constructor (props) {
        super(props);
        this.state = {
            version: rainbowSDK.version(),
            conversations: [],
            conversation: {}
        }

        this.login();
        this.conversationsChangedHandler = this.conversationsChangedHandler.bind(this);
        document.addEventListener(
            rainbowSDK.conversations.RAINBOW_ONCONVERSATIONSCHANGED,
            this.conversationsChangedHandler
        );
    }

    conversationsChangedHandler(){
        console.log("conversationsChangedHandler triggered"); 
        // console.log(this); 
        // console.log(this.state); 
        // console.log(this.state.conversations);

        var conversations = this.state.conversations;
        var conversation = this.findNewConversation(conversations);

        this.setState({
            conversation: conversation
        });
    }

    findNewConversation(conversations){
        var i = 0;
        while (i < conversations.length ){
            var l = conversations[i].messages.length;
            if ( conversations[i].messages[l-1].data == "start" ){
                console.log("start found");
                alert(conversations[i].contact.loginEmail+" wants to talk to you");
                return conversations[i];
            }
            i++;
        }
        return ['conversations are the same'];
    }


    login(){
        console.log("I m here");
        var myRainbowLogin = "AccountsNBills@gmail.com";
        var myRainbowPassword = "Longpassword!1";
        // var strId = "5e52a877b4528b74a00c92df";
        let that = this;
        rainbowSDK.connection.signin(myRainbowLogin, myRainbowPassword)
        .then(function(){
            console.log("sign in successful");
            var conversations = rainbowSDK.conversations.getAllConversations();
            // console.log(conversations);

            that.setState({
                conversations: conversations
            }, function(){
                console.log("this is the callback");
                console.log(that);
            });
            console.log(that.state.conversations);
        })
        .catch(function(err){
            console.log("sign in failed");
            console.log(err);
        });
    }

    render(){
        return (
            <div id="conversations">
                <h1>CONVERSATIONS</h1>
            </div>
        );
    }
}

export default Conversations;