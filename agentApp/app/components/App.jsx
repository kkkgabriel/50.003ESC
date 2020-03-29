import React from 'react';
import Login from './Login/Login'
import Home from './Home/Home'
import {BrowserRouter, Switch, Route} from 'react-router-dom'

export default class App extends React.Component {
    render() {
        console.log(rainbowSDK)
        return (
            <div>
                <BrowserRouter>
                    <Switch>
                        <Route path="/" exact component={Login}/>
                        <Route path="/home" exact component={Home}/>
                    </Switch>
                </BrowserRouter>
            </div>
        );
    }

}
