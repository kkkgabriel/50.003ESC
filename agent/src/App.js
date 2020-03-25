import React, {Component} from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import Login from './containers/Login/Login'
import Conversation from './containers/Conversations/Conversations'

class App extends Component{
    state = {
        loading: true
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({
                loading: false
            })
        }, 1000);
    }
    render() {return (
        <BrowserRouter>
            {!this.state.loading ? 
            <Switch>
                <Route path="/" exact component={Login}/>
                <Route path="/home" exact component={Conversation}/>
            </Switch>: null}
        </BrowserRouter>
    );
}}

export default App;
