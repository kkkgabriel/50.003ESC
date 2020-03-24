import React from 'react';
import * as api from './apiPaths';
import * as c from './constants';

class GetAnotherAgentTest extends React.Component {
	constructor (props){
		super(props);
		this.state = {
			expected: "",
			description: "Get another agent method",
			progress: c.PROGRESS_NOT_DONE,
			result: c.RESULT_NA,
			data: null
		}

		this.makeApiCall = this.makeApiCall.bind(this);
		this.compare = this.compare.bind(this);
	}

	componentDidMount(){
		console.log("GetAnotherAgent mounted");
		this.makeApiCall();
	}

	makeApiCall(){
		console.log("making api call for GetAnotherAgent");
		let url = api.getguestaccount;
		console.log(url)
		this.setState({
			progress: c.PROGRESS_IN_PROG
		});
		// fetch(url)
		// 	.then(res => res.json())
		// 	.then(
		// 		(result) => {
		// 			this.setState({
		// 				progress: c.PROGRESS_COMPLETED,
		// 				result: this.compare(result) ? c.RESULT_PASS : c.RESULT_FAILED,
		// 				data: result
		// 			});
		// 			// compare result here
		// 		},
		//      (error) => {
		// 			this.setState({
		// 				progress: c.ERROR,
		// 				result: c.ERROR,
		// 				data: result,
		// 				error
		// 			});
		// 		}
		// 	)

		// Testing method
		setTimeout( ()=> {
			let result = "";
			this.setState({
				progress: c.PROGRESS_COMPLETED,
				result: this.compare(result) ? c.RESULT_PASS : c.RESULT_FAILED,
				data: result
			});
		}, 3000);
	}

	compare(result){
		return true;
	}

	render(){
		return (
			<tr>
				<td>{this.state.description}</td>
				<td>{this.state.progress}</td>
				<td>{this.state.result}</td>
				<td><div className="data">{this.state.data}</div></td>
			</tr>
		)
	}
}

export default GetAnotherAgentTest;