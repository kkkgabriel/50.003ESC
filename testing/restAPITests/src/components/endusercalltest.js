import React from 'react';
import * as api from './apiPaths';
import * as c from './constants';
import * as key from './keys';

class EndUserCallTest extends React.Component {
	constructor (props){
		super(props);
		this.invalidUserIds = [
			"potato@singco.com",
			"apple@singco.com",
			"tomato@singco.com"
		];
		this.validUserIds = [
			"user1@singco.com",
			"user2@singco.com",
			"user3@singco.com",
			"user4@singco.com",
			"user5@singco.com",
			"user6@singco.com",
			"user7@singco.com",
			"user8@singco.com"
		];
		this.state = {
			expected: "",
			description: "End User Call method",
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
		// console.log("EndAgentCall mounted");
		this.startTests();
	}

	startTests(){
		// console.log("making api call for login test");
		let n = this.invalidUserIds.length + this.validUserIds.length;
		// console.log(n);
		this.setState({
			progress: c.PROGRESS_IN_PROG,
			testNotPassed: n
		});

		// attempt to login with an invalid username
		// this attempt should not affect any rows in the db
		this.invalidUserIdTest();

		// attempt to login with an valid username
		// this attempt should affect only 1 row in the db
		this.validUserIdTest();
	}

	invalidUserIdTest(){
		let invalidUserIds = this.invalidUserIds;	
		let i = 0;		
		while ( i< invalidUserIds.length) {
			let invalidUserId = invalidUserIds[i];
			let url = api.endusercall +"?"+key.USERID+"=" +invalidUserId;

			// console.log(url);
			setTimeout( ()=> {
				// console.log(url);
				fetch(url)
					.then(res => res.json())
					.then(
						(result) => {
							if (result.affectedRows != 0){
								let msg = "Failed: Invalid user end call affected more than 0 rows.";
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
							
							// console.log(this.state.testNotPassed);
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
		while ( i< validUserIds.length ) {
			let validUserId = validUserIds[i]
			let url = api.endusercall +"?"+key.USERID+"=" +validUserId;

			// console.log(url);
			setTimeout( ()=> {
				fetch(url)
					.then(res => res.json())
					.then(
						(result) => {

							if ( result.affectedRows > 1 ){
								let msg = "Failed: Valid user end call affected not 1 row.";
								console.log(msg);
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
							
							// console.log(this.state.testNotPassed);
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

export default EndUserCallTest;