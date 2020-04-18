import React from 'react';
import * as api from '../constants/apiPaths';
import * as c from '../constants/constants';
import * as key from '../constants/keys';

class AgentLogin extends React.Component {
	constructor (props){
		super(props);

		// Some, not all  of the validuser accounts
		this.validUserIds = [
			// "potato@gmail.com",	// uncomment this to fail the test
			"AccountsNBills8@gmail.com",
			"MobilePostpaid8@gmail.com",
			"MobilePrepaid8@gmail.com",
			"Broadband8@gmail.com",
			"TV8@gmail.com",
			"HomeLine8@gmail.com",
			"OnlinePurchase8@gmail.com",
			"Lifestyle8@gmail.com"
		];
		this.invalidUserIds = [
			// "Lifestyle7@gmail.com",	// uncomment this to fail the test
			"potato@gmail.com",
			"apple@singco.com",
			"tomato@singco.com"
		];
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
		console.log("Logintest mounted");
		// this.startTests();
	}

	startTests =()=>{
		api.resetfn();

		let n = this.invalidUserIds.length + this.validUserIds.length;
		this.setState({
			progress: c.PROGRESS_IN_PROG,
			testNotPassed: n
		});

		console.log("starting")

		// This test ensures that we are not able to
		// log in with invalid user ids
		this.invalidUserIdTest();

		// This test ensures that we are able to log 
		// in with valid user ids. And only 1 record is 
		// affected.
		this.validUserIdTest();
	}

	invalidUserIdTest =()=>{
		let invalidUserIds = this.invalidUserIds;
		let i = 0;
		while ( i < invalidUserIds.length ){
			let invalidUserId = invalidUserIds[i];

			// set the url
			let url = api.agentlogin +"?"+key.EMAIL+"=" +invalidUserId+"&"+key.PASSWORD+"="+c.PASSWORD;
			
			fetch(url)
			.then(res =>{
				res.json().then((data)=>{
					console.log(data);

					// if valid user is able to login, set result to failed and add error msg
					if (data.status.success){
						let msg = "Invalid user loggedin successfully.\n"
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

			i++;
		}
	}

			
	validUserIdTest =()=>{
		let validUserIds = this.validUserIds;
		let i = 0;
		while ( i < validUserIds.length ){
			let validUserId = validUserIds[i];

			// set the url
			let url = api.agentlogin +"?"+key.EMAIL+"=" +validUserId+"&"+key.PASSWORD+"="+c.PASSWORD;
			// console.log("This is url: "+url);

			setTimeout(()=>{

				// make the call
				fetch(url)
				.then(res =>{
					res.json().then((data)=>{
						console.log(data);

						// if valid user is unable to login, set result to failed and add error msg
						if (!data.status.success){
							this.setState({
								result: c.RESULT_FAILED,
								errors: this.state.errors+data.status.error.errorMsg+"\n"
							});

							// add id 2 to failedTests
							if (!this.state.failedTests.includes("2\n")){
								this.state.failedTests.push("2\n")
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
					Login method<br/><br/>
					Test 1: Logging in with invalid agent credentials<br/>
					Test 2: Logging in with valid agent credentials
				</td>
				<td>
					{this.state.progress}<br/><br/>
					{this.state.progress == c.PROGRESS_NOT_DONE &&
						<button type="button" ref={this.props.myRef} onClick={this.startTests} class="btn btn-info">Start</button>
					}
				</td>
				<td>{this.state.result}</td>
				<td>{this.state.failedTests}</td>
				<td><div className="data">{this.state.errors}</div></td>
			</tr>
		)
	}
}

export default AgentLogin;