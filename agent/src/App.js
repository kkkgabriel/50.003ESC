import React, {Component} from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import Login from './containers/Login/Login'
import Home from './containers/Conversations/Home'

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
                <Route path="/home" exact component={Home}/>
            </Switch>: null}
        </BrowserRouter>
    );
}}

export default App;
