import ReactDOM from 'react-dom';
import React from 'react';
import { Chat } from '@progress/kendo-react-conversational-ui';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.user = {
            name:"Gabriel",
            id: 1,
            avatarUrl: "https://via.placeholder.com/24/008000/008000.png"
            
        };
        this.bot = { id: 0 };
        this.state = {
            "version": rainbowSDK.version(),
            visible:false,
            "isAvailable":false,
            messages: [
                {
                    author: this.bot,
                    suggestedActions: [
                        {
                            type: 'reply',
                            value: 'Oh, really?'
                        }, {
                            type: 'reply',
                            value: 'Thanks, but this is boring.'
                        }
                    ],
                    timestamp: new Date(),
                    text: "Hello, this is a demo bot. I don't do much, but I can count symbols!"
                }
            ]
        };
        this.addNewMessage = this.addNewMessage.bind(this);
        this.countReplayLength= this.countReplayLength.bind(this);        
        this.toggleDialog = this.toggleDialog.bind(this);
        this.toggleisAvailable = this.toggleisAvailable.bind(this);
        this.reroute = this.reroute.bind(this);
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
        let botResponce = Object.assign({}, event.message);
        console.log(botResponce)
        console.log(event.message.text)
        this.countReplayLength(event.message.text)
        botResponce.text = this.countReplayLength(event.message.text);
        botResponce.author = this.bot;
        this.setState((prevState) => ({
            messages: [
                ...prevState.messages,
                event.message
            ]
        }));
        setTimeout(() => {
            this.setState(prevState => ({
                messages: [
                    ...prevState.messages,
                    botResponce
                ]
            }));
        }, 1000);
    };

    countReplayLength(question){
        console.log("this works")
        let length = question.length;
        let answer = question + " contains exactly " + length + " symbols.";
        return answer;
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
                </div>
            ): null}
            </div>
        );
    }

}
