import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import ChatBox from './ChatBox/ChatBox.js';

export default class App extends React.Component {

    constructor (props) {
        super(props);
        this.state = {
            "version": rainbowSDK.version()
        };
    }

    render() {
        return (
            <div id="content">
				<p>Version {this.state.version}</p>	
                <ChatBox />
				<p>You mother cb</p>	
            </div>
        );
    }
}
