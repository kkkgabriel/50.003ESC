import React from 'react';
import * as api from './apiPaths';
import * as c from './constants';
import * as key from './keys';

class LoginTest extends React.Component {
	constructor (props){
		super(props);
		this.validUserIds = [
			"AccountsNBills@gmail.com",
			"MobilePostpaid@gmail.com",
			"MobilePrepaid@gmail.com",
			"Broadband@gmail.com",
			"TV@gmail.com",
			"HomeLine@gmail.com",
			"OnlinePurchase@gmail.com",
			"Lifestyle@gmail.com"
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
		// console.log("Logintest mounted");
		this.startTests();
	}

	startTests(){
		let n = this.invalidUserIds.length + this.validUserIds.length;
		this.setState({
			progress: c.PROGRESS_IN_PROG,
			testNotPassed: n
		});

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
			let url = api.agentlogin +"?"+key.USERID+"=" +invalidUserId;
			setTimeout(()=>{
				fetch(url)
				.then(res => res.json())
				.then(
					(result) => {
						if (result.affectedRows != 0){
							let msg = "Failed: Invalid login affected more than 0 rows.";
							this.setState({
								result: c.RESULT_FAILED,
								errors: this.state.errors + msg
							});
						}
						let testNotPassed = this.state.testNotPassed - 1;
						this.setState({
							testNotPassed: testNotPassed,
							progress: testNotPassed == 0 ? c.PROGRESS_COMPLETED : c.PROGRESS_IN_PROG,
							result: testNotPassed == 0 && this.state.result == c.RESULT_NA ? c.RESULT_PASS : this.state.result
						});
						
					},
			     	(error) => {
						console.log(error)
					}
				)
			}, 500);

			i++;
		}
	}

			
	validUserIdTest(){
		let validUserIds = this.validUserIds;
		let i = 0;
		while ( i < validUserIds.length ){
			let validUserId = validUserIds[i];
			let url = api.agentlogin +"?"+key.USERID+"=" +validUserId;
			setTimeout(()=>{
				fetch(url)
				.then(res => res.json())
				.then(
					(result) => {
						if (result.affectedRows != 1){
							let msg = "Failed: Valid Login affect not 1 row.";
							this.setState({
								result: c.RESULT_FAILED,
								errors: this.state.errors + msg
							});
						}
						let testNotPassed = this.state.testNotPassed - 1;
						this.setState({
							testNotPassed: testNotPassed,
							progress: testNotPassed == 0 ? c.PROGRESS_COMPLETED : c.PROGRESS_IN_PROG,
							result: testNotPassed == 0 && this.state.result == c.RESULT_NA ? c.RESULT_PASS : this.state.result
						});
						
					},
			     	(error) => {
						console.log(error)
					}
				)
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

export default LoginTest;