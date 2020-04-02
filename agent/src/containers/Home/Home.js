import React, {Component} from 'react';
import { Chat } from '@progress/kendo-react-conversational-ui';
import { connect } from 'react-redux';
import * as consts from './constants.js';
import { Redirect } from 'react-router-dom'
import { authFail, authSignOut } from '../../store/actions/auth.js';
import DialogHome from '../../components/DialogHome/DialogHome'
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
                window.rainbowSDK.conversations.RAINBOW_ONCONVERSATIONCHANGED,
                this.conversationsChangedHandler
            );
        })
    }
    conversationsChangedHandler = (event)=>{
        console.log("conversationsChangedHandler triggered");
        // console.log("isAvailable is: " + this.state.isAvailable);
        if ( this.state.isAvailable ) {
            // receive messages and update it on the chat 
            this.updateRainbowMessages();
        } else {
            // check if its a new conversation
            this.updateConversation(event.detail);  // event.detail contains the id of the conversation that changed
        }
    }

    done = ()=>{
        // close the chat
        // clear the message
        this.setState({
            isAvailable: false,
            conversation: {},
            messages:[]
        })
    }

    reroute = () => {
        // insert rest API here

        // close convo
        this.done()
        // send signal that you are available to the server
        // reroute to agent who is not him
    }


    toggleDialog = ()=>{
		// console.log("toggling dialog");

        // if rejecting the call, send the reject keyword
        if (this.state.visible){
            window.rainbowSDK.im.sendMessageToConversation(this.state.conversation, consts.REJECT_KEYWORD);
        }
        this.setState({
            visible: !this.state.visible
        });
    }
    
    toggleisAvailable = ()=>{
        // send message to other party if accept call
        if (!this.state.isAvailable){
            window.rainbowSDK.im.sendMessageToConversation(this.state.conversation, consts.ACCEPT_KEYWORD);
        }
        this.setState({
            isAvailable: !this.state.isAvailable,
            visible: !this.state.visible
        })

        // insert rest API here
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

    sendToRainbow = (msg) =>{
        // console.log("to add in rainbow send message here")
        console.log(msg);
        window.rainbowSDK.im.sendMessageToConversation(this.state.conversation, msg.text);
    }
    
    // display messages from rainbow conversation onto the kendo chat element
	updateRainbowMessages = ()=>{	
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
        this.userEndCall()
	}

    updateConversation = (convoId) =>{
        // console.log(convoId);

        // find conversation object
        let conversation = window.rainbowSDK.conversations.getConversationById(convoId)
        // console.log(conversation);

        // check if conversation has the start keyword
        if ( conversation.lastMessageText == consts.START_KEYWORD ){
            // console.log("start found");

            // set the conversation to the state conversation
            this.setState({
                conversation: conversation
            });

            // close the dialog
            this.toggleDialog();

            // change the bot name to the name of the other party in the convo
            this.changeBot(conversation.name.value);

            // display messages from rainbow conversation onto the kendo chat element
            this.initializeMessages();

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

    logoutHandler = ()=>{
        window.rainbowSDK.connection.signout()
        .then(() => {
            // dispatch
            this.props.onLogout()
            this.props.history.push('/')
        })
    }

    userEndCall = () => {
        let lastMessage = this.state.conversation.messages[this.state.conversation.messages.length-1];
        // console.log(lastMessage);
        // console.log(lastMessage.data);
		if ( lastMessage.data == consts.USER_END_PASSWORD ){	
        // check if conversation has the userend keyword sent by user
            console.log("calling userendcall")
            this.done()
        }

        //rest api to update availability of agent in db
    }


    endCall = () =>{

        // send special message to user to end the call
        window.rainbowSDK.im.sendMessageToConversation(this.state.conversation, consts.END_KEYWORD);

        // insert rest API here

        // close everything
        this.done();
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
                        <button className="k-button" onClick={this.endCall}>End Call </button>
                    </div>
                }
            <button onClick={this.logoutHandler}>Logout</button>
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