import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import '@progress/kendo-theme-bootstrap/dist/all.css'
// import axios from 'axios'
import classes from './Login.module.css'
import { authSuccess, authStart, authFail, authSignOut } from '../../store/actions/auth';
import { connect } from 'react-redux';
import LoginForm from '../../components/LoginForm/LoginForm';

const AGENT_LOGIN = "http://www.neobow.appspot.com/agentlogin";

class Login extends Component{
    state = {
        email: '',
        password: ''
    }

    componentDidMount(){
        if (typeof window.rainbowSDK === 'undefined'){
            return
        }
        else {
            window.rainbowSDK.connection.signout()
            .then(() => {
                this.props.onLogout()
            })
        }
    }
    loginHandler = (event) => {
        event.preventDefault()
        // var rainbowLogin = "mario.kosasih@gmail.com"
        // var rainbowPassword = "6OCJc97dWp*2"

        if (typeof window.rainbowSDK === 'undefined'){
            return
        }

        let url = AGENT_LOGIN+"?email="+this.state.email+"&password="+this.state.password;
        console.log(url);

        this.props.authStart()
        fetch(url)
            .then(res=>{
                console.log(res);
                res.json().then((data)=>{
                    console.log(data);
                    if (data.status.success){
                        window.rainbowSDK.connection.signin(this.state.email, this.state.password)
                            .then(account => {
                                console.log("Successful Login")
                                console.log(account)
                                // route to agent page
                                this.props.authSuccess(account.account.loginEmail,account.account.userId, account.userData.displayName, account.token)
                                this.props.history.push('/home')
                            })
                            .catch(err => {
                                throw err;
                            })
                    } else {
                        this.props.authFail(data.status.error.errorMsg)
                        console.log(data.status.error.errorMsg)
                    }
                });

            })
            .catch( err=>{
                this.props.authFail(err.label)
                console.log("failed to login")
            })



        // this.props.authStart()
        // window.rainbowSDK.connection.signin(this.state.email, this.state.password)
        //     .then(account => {
        //         console.log("Successful Login")
        //         console.log(account)
        //         // route to agent page
        //         this.props.authSuccess(account.account.loginEmail,account.account.userId, account.userData.displayName, account.token)
        //         this.props.history.push('/home')
        //     })
        //     .catch(err => {
        //         this.props.authFail(err.label)
        //         console.log("failed to login")
        //     })
    }

    onInputChange = (event)=>{
        let login = {...this.state}
        login[event.target.name] = event.target.value
        this.setState(login)
        console.log(login)
    }
    
    render() {
        return (
            <div className={`row ${classes.Login}`}>
            <div className="col-xs-12 col-sm-6 offset-sm-3">
                <div className="card">
                    <div className="card-body">
                       <LoginForm onInputChange={this.onInputChange} loginHandler = {this.loginHandler}/>
                       {this.props.account.error ? <div style={{color:'red'}}>Failed to login</div>:null}
                    </div>
                </div>
            </div>
            {this.props.account.loading ?
                <div className={classes.spinner_bg}>
                <div className={classes.spinner}>
                </div>
                </div>:null}
            </div>
    )}
}

const mapDispatchToProps = dispatch => {
    return{
        authStart: () => dispatch(authStart()),
        authFail: (error) => dispatch(authFail(error)),
        authSuccess: (email, userId, displayName, token) => dispatch(authSuccess(email, userId, displayName, token)),
        onLogout: () => dispatch(authSignOut())
    }
}

const mapStateToProps = state => {
    return{
        account: state.auth
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Login))