import React from 'react';

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
            <h5>Time to <a href="https://api.openrainbow.com/">Play with SDK and APIs</a>.</h5>
            <p>Version {this.state.version}</p>
            </div>
        );
    }
}
