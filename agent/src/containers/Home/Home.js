import React, {Component} from 'react';
import { Chat } from '@progress/kendo-react-conversational-ui';
import { connect } from 'react-redux';
import * as consts from './constants.js';
import { Redirect } from 'react-router-dom'
import { authFail, authSignOut } from '../../store/actions/auth.js';
import DialogHome from '../../components/DialogHome/DialogHome'
import Header from '../../components/Header/Header.js';
class Home extends Component {

    constructor (props) {
        super(props);
        this.user = {
            name: this.props.account.displayName,
            id: this.props.account.userId,            
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
            isAvailable:false,
            messages: []

        }
        // this.login();
    }
    componentDidMount(){
        this.setState({
            conversations: window.rainbowSDK.conversations.getAllConversations()
        },()=>{
            document.addEventListener(
                window.rainbowSDK.conversations.RAINBOW_ONCONVERSATIONSCHANGED,
                this.conversationsChangedHandler
            );
        })
    }
    componentWillUnmount() {
        window.rainbowSDK.connection.signout()
        .then(() => {
            console.log("Logout")
            // dispatch
            this.props.onLogout()
        })
    }
    conversationsChangedHandler = (event)=>{
        // why the state changed without any setState??
        console.log("conversationsChangedHandler triggered");
        console.log(event.detail)
		if ( this.state.isAvailable ) {
			this.updateRainbowMessages();
		} else {
			this.findNewConversation();
		}
    }
    done = ()=>{
        // close the chat
        // clear the message
        this.setState({
            isAvailable: false,
            messages:[]
        })
    }

    reroute = () => {
        // close convo
        this.done()
        // send signal that you are available to the server
        // reroute to agent who is not him
    }
    toggleDialog = ()=>{
		console.log("toggling dialog");
        this.setState({
            visible: !this.state.visible
        });
    }
    
    toggleisAvailable = ()=>{
        this.setState({
            isAvailable: !this.state.isAvailable,
            visible: !this.state.visible
        })
    }

    addNewMessage = (event)=>{
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

	updateRainbowMessages = ()=>{	// display messages from rainbow conversation onto the kendo chat element
		let lastMessage = this.state.conversation.messages[this.state.conversation.messages.length-1];
		// console.log(lastMessage.side);
		if ( lastMessage.side == "L" ){	// for rainbow, incoming messages are displayed on the left
			let theirResponse = {
				author: this.state.conversation.contact.loginEmail,
				text: this.state.conversation.lastMessageText,
				timestamp: new Date()
			}
			this.setState((prevState) => ({
				messages: [
					...prevState.messages,
					theirResponse
				]
			}))
		}
	}

    initializeMessages = () => {
        this.setState({
            messages: [
                {
                    author: this.bot,
                    timestamp: new Date(),
                    text: "Hello there."
                }
            ]
        })
    }
	changeBot = (name)=>{
		this.bot.name = name;
	}

    findNewConversation = ()=>{
		let conversations = this.state.conversations;
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
					this.initializeMessages();	// display messages from rainbow conversation onto the kendo chat element
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

    logoutHandler = ()=>{
        window.rainbowSDK.connection.signout()
        .then(() => {
            // dispatch
            this.props.onLogout()
            this.props.history.push('/')
        })
    }

    render(){
        var redirect = null
        if (this.props.account.token === null){
            redirect = (
                <Redirect to="/"/>
            )
        }

        return (
            <div>
                {redirect}
                <Header displayName={this.props.account.displayName} logout={this.logoutHandler}/>
                {/*<button className="k-button" onClick={this.toggleDialog}>Open Dialog</button>*/}
                {this.state.isAvailable ? null:<div style={{textAlign:"center", margin:"2rem 0", width: "100%"}}>WAITING</div>}
                {this.state.visible && 
                    <DialogHome
                        toggleDialog={this.toggleDialog}
                        name={this.bot["name"]}
                        toggleisAvailable={this.toggleisAvailable}/>
                }
                {this.state.isAvailable &&
                    <div>
                        <Chat user={this.user}
                            messages={this.state.messages}
                            onMessageSend={this.addNewMessage}
                            placeholder={"Type a message..."}
                            width={800}>
                        </Chat>
                        <button className="k-button" onClick={this.reroute}>Reroute </button>
                    </div>
                }
            </div>
        );
    }
}

const mapStateToProps = state => {
    return{
        account: state.auth
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onLogout: () => dispatch(authSignOut())
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Home);