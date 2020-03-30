import React from 'react';
import './App.css';
import "@progress/kendo-theme-default/dist/all.css";
import { Chat } from '@progress/kendo-react-conversational-ui';
import Home from './containers/Home';
import axios from 'axios';

const dialogFlowBaseUrl = "http://localhost:3005"
export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        	loading: true
        }
	}

    componentDidMount(){
        console.log("component mounted");
        setTimeout(() => {
            this.setState({
                loading: false
            })

            console.log(window.rainbowSDK);
        }, 1000);
    }

    render() {       
        return (
            <div>
            {!this.state.loading ? 
	            <Home />
	            : null}
            </div>
        );
    }
}
