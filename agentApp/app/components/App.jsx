import React from 'react';
import Login from './Login/Login'
import {BrowserRouter, Switch, Route} from 'react-router-dom'
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
            <BrowserRouter>
                <Switch>
                    <Route exact path={"/"} component={Login}/>
                    <Route exact path={"/home"} />
                </Switch>
            </BrowserRouter>
        </div>
        );
    }
}
