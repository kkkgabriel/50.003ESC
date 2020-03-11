import React from 'react';
import Conversations from './Conversations.jsx';


export default class App extends React.Component {

    constructor (props) {
        super(props);
        this.state = {
            version: rainbowSDK.version()
        };
    }

    render() {
        return (
            <div id="content">
                <Conversations/>
            <p>Version {this.state.version}</p>
            </div>
        );
    }
}
