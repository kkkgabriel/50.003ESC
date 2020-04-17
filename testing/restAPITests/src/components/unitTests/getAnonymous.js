import React from 'react';
import * as api from '../constants/apiPaths';
import * as c from '../constants/constants';
import * as key from '../constants/keys';

class GetAnonymous extends React.Component {
	constructor (props){
		super(props);

		this.numberOfTries = 8;	// set to 8 but can go up

		this.state = {
			expected: "",
			progress: c.PROGRESS_NOT_DONE,
			result: c.RESULT_NA,
			testNotPassed: 0,
			errors: "",
			failedTests: []
		}
	}

	componentDidMount(){
		console.log("GetAnonymous mounted");
		// this.startTests();
	}

	startTests =()=>{
		let n = this.numberOfTries;
		this.setState({
			progress: c.PROGRESS_IN_PROG,
			testNotPassed: n
		});

		console.log("starting")

		// This test ensures that we are not able to
		// log in with invalid user ids
		this.getAnonAccs();
	}

	getAnonAccs =()=>{
		let url = api.getanonymous;
		let i = 0;
		while ( i<this.numberOfTries){
			setTimeout(()=>{
				fetch(url)
				.then(res=>{
					res.json().then(data=>{

						if (!data.status.success){
							let msg = "Unable to get user credentials.\n"
							this.setState({
								result: c.RESULT_FAILED,
								errors: this.state.errors+msg
							});

							// add id 1 to failedTests
							if (!this.state.failedTests.includes("1\n")){
								this.state.failedTests.push("1\n")
							}
						}
						// minus one from testNotPassed
						let testNotPassed = this.state.testNotPassed - 1;
						this.setState({
							testNotPassed: testNotPassed,

							// Progress will be set as "completed" if all tested are done, and "in progress" if not all are done
							progress: testNotPassed == 0 ? c.PROGRESS_COMPLETED : c.PROGRESS_IN_PROG,

							// idk how to explain this, abit complicated
							result: testNotPassed == 0 && this.state.result == c.RESULT_NA ? c.RESULT_PASS : this.state.result
						});
					})
				})
			}, 500);

			i++;
		}
	}


	render(){
		return (
			<tr>
				<td className="align-left">
					Get Anonymous method<br/><br/>
					Test 1: Uses the method to get an account with email and password.
					
				</td>
				<td>
					{this.state.progress}<br/><br/>
					{this.state.progress == c.PROGRESS_NOT_DONE &&
						<button type="button" onClick={this.startTests} class="btn btn-info">Start</button>
					}
				</td>
				<td>{this.state.result}</td>
				<td>{this.state.failedTests}</td>
				<td><div className="data">{this.state.errors}</div></td>
			</tr>
		)
	}
}

export default GetAnonymous;