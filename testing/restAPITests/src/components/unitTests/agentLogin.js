import React from 'react';
import * as api from '../constants/apiPaths';
import * as c from '../constants/constants';
import * as key from '../constants/keys';

class AgentLogin extends React.Component {
	constructor (props){
		super(props);

		// Some, not all  of the validuser accounts
		this.validUserIds = [
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
			"potato@gmail.com",
			"apple@singco.com",
			"tomato@singco.com"
		];
		this.state = {
			expected: "",
			description: "Login method",
			progress: c.PROGRESS_NOT_DONE,
			result: c.RESULT_NA,
			testNotPassed: 0,
			errors: ""
		}

		this.startTests = this.startTests.bind(this);
		this.invalidUserIdTest = this.invalidUserIdTest.bind(this);
		this.validUserIdTest = this.validUserIdTest.bind(this);
	}

	componentDidMount(){
		console.log("Logintest mounted");
		this.startTests();
	}

	startTests(){
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

	invalidUserIdTest(){
		let invalidUserIds = this.invalidUserIds;
		let i = 0;
		while ( i < invalidUserIds.length ){
			let invalidUserId = invalidUserIds[i];

			// set the url
			let url = api.agentlogin +"?"+key.EMAIL+"=" +invalidUserId+"&"+key.PASSWORD+"="+c.PASSWORD;
			setTimeout(()=>{
				fetch(url)
				.then(res =>{
					res.json().then((data)=>{
						console.log(data);

						// if valid user is able to login, set result to failed and add error msg
						if (data.status.success){
							this.setState({
								result: c.RESULT_FAILED,
								errors: this.state.errors+data.status.error.errorMsg
							});
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

			
	validUserIdTest(){
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
								errors: this.state.errors+data.status.error.errorMsg
							});
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
				<td>{this.state.description}</td>
				<td>{this.state.progress}</td>
				<td>{this.state.result}</td>
				<td><div className="data">{this.state.errors}</div></td>
			</tr>
		)
	}
}

export default AgentLogin;