import React, {Component} from 'react';
import { Chat } from '@progress/kendo-react-conversational-ui';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';

class ChatBox extends Component {

	constructor(props){
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
            version: rainbowSDK.version(),
            messages: [		// for population of kendo
                {
                    author: this.bot,
                    timestamp: new Date(),
                    text: "Hello there."
                }
            ]

        }

		this.addNewMessage = this.addNewMessage.bind(this);
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

	render(){
		return (
			<div>
				<h1>potato</h1>
				<Chat user={this.user}
                    messages={this.state.messages}
                    onMessageSend={this.addNewMessage}
                    placeholder={"Type a message..."}
                    width={400}>
                </Chat>
			</div>
		)
	}
}

export default ChatBox;