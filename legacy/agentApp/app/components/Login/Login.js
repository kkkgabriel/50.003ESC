import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
// import axios from 'axios'
// import { Form, Field } from '@progress/kendo-react-form';
// import { Input } from '@progress/kendo-react-inputs';
class Login extends Component{
    state = {
        username: '',
        password: ''
    }
    loginHandler = () => {
        console.log(this.state)
        // var rainbowLogin = "mario.kosasih@gmail.com"
        // var rainbowPassword = "6OCJc97dWp*2"
        rainbowSDK.connection.signin(this.state.username, this.state.password)
            .then(account => {
                console.log("Successful Login")
                console.log(account)
                // route to agent page
                console.log(this.props)
                this.props.history.push('/home')
            })
            .catch(err => {
                console.log("failed to login")
            })
    }

    onInputChange = (event, stateKey)=>{
        let login = {...this.state}
        login[stateKey] = event.target.value
        this.setState(login)
    }
    render() {
        console.log(rainbowSDK)
        return (
        <div>
            <input type="text" value={this.state.username} onChange={(event)=>this.onInputChange(event,'username')}/>
            <input type="text" value={this.state.password} onChange={(event)=>this.onInputChange(event, 'password')}/>
            <button onClick={this.loginHandler}>Login</button>
        </div>
    )}
}

export default withRouter(Login)