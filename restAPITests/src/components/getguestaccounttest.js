import React from 'react';
import * as api from './apiPaths';
import * as c from './constants';
import * as key from './keys';

class GetGuestAccount extends React.Component {
	constructor (props){
		super(props);
		this.state = {
			description: "Get Guest Account method",
			progress: c.PROGRESS_NOT_DONE,
			result: c.RESULT_NA,
			errors: ""
		}

		this.makeApiCall = this.makeApiCall.bind(this);
		this.test = this.test.bind(this);
		this.hasOnly1Result = this.hasOnly1Result.bind(this);
		this.includeEmailAndPassword = this.includeEmailAndPassword.bind(this);
	}

	componentDidMount(){
		// console.log("GetGuestAccount mounted");
		this.makeApiCall();
	}

	makeApiCall(){
		// console.log("making api call for GetGuestAccount");
		let url = api.getguestaccount;
		// console.log(url)
		this.setState({
			progress: c.PROGRESS_IN_PROG
		});
		fetch(url)
			.then(res => res.json())
			.then(
				(result) => {
					this.setState({
						progress: c.PROGRESS_COMPLETED,
						result: this.test(result) ? c.RESULT_PASS : c.RESULT_FAILED
						// data: result
					});
				},
			    (error) => {
					this.setState({
						progress: c.ERROR,
						result: c.ERROR,
						data: c.ERROR,
						error
					});
				}
			)
			.catch( (error)=>{
				console.log(error);
			});
	}

	hasOnly1Result(results){
		// if (results.length != 1){	
		// 	return false;
		// }
		return true;
	}

	includeEmailAndPassword(results){
		let value = true;
		let keys = Object.keys(results[0])
		if (!keys.includes(key.EMAIL)){
			value = false;
		}
		if (!keys.includes(key.PASSWORD)){
			value = false;
		}
		return value;
	}

	test(results){
		let value = true;

		// Check if there is only 1 result
		let msg = "";
		if (!this.hasOnly1Result(results)){
			msg += "Failed: has more than 1 result!\n";
			value = false;
		}

		// Check if result has a email and password 
		if(!this.includeEmailAndPassword(results)){
			msg += "Failed: do not have email and password!\n";
			value = false;
		}
		this.setState({
			errors: this.state.errors + msg
		});
		return value;		
	}

	render(){
		return (
			<tr>
				<td>{this.state.description}</td>
				<td>{this.state.progress}</td>
				<td>{this.state.result}</td>
				<td><div className="data">{this.state.errors}</div></td>
			</tr>
		)
	}
}

export default GetGuestAccount;