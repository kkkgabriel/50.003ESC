import React from 'react';
import './App.css';
import "@progress/kendo-theme-default/dist/all.css";
import Home from './containers/Home';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        	loading: true
        }
	}

	componentDidMount(){
		// console.log("component mounted");
		setTimeout(()=>{
			this.setState({
				loading: false
			})
		})

	}

    render() {       
        return (
            <div>
            	{!this.state.loading 
            		? <Home />
            		: null
            	}
            </div>
        );
    }
}
