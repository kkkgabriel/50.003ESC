import React from 'react';
import * as api from './apiPaths';
import * as c from './constants';
import * as key from './keys';

class GetAnotherAgentTest extends React.Component {
	constructor (props){
		super(props);
		this.validTags = [
			["Lifestyle", "Lifestyle@gmail.com"],
			["AccountsNBills","AccountsNBills@gmail.com"],
			["MobilePostpaid","MobilePostpaid@gmail.com"],
			["MobilePrepaid","MobilePrepaid@gmail.com"],
			["Broadband","Broadband@gmail.com"],
			["TV","TV@gmail.com"],
			["HomeLine", "HomeLine@gmail.com"],
			["OnlinePurchase", "OnlinePurchase@gmail.com"]
		];
		this.invalidTags = [
			["Potato", "Potato@gmail.com"],
			["Tomato", "Tomato@gmail.com"],
			["Apple", "Apple@gmail.com"]
		];
		this.state = {
			expected: "",
			description: "Get another agent",
			progress: c.PROGRESS_NOT_DONE,
			result: c.RESULT_NA,
			testNotPassed: 0,
			errors: ""
		}

		this.startTest = this.startTest.bind(this);
		this.invalidTagTest = this.invalidTagTest.bind(this);
		this.validTagTest = this.validTagTest.bind(this);
	}

	componentDidMount(){
		// console.log("TechRequestTest mounted");
		this.startTest();
	}

	invalidTagTest(){
		let invalidTags = this.invalidTags;
		let i = 0;
		while ( i < invalidTags.length ){
			let tag = invalidTags[i][0];
			let email = invalidTags[i][1];
			let url = api.getanotheragent +"?"+key.TAG+"=" +tag+"&"+key.TECHEMAIL+"="+email;
			// console.log(url);
			setTimeout(()=>{
				fetch(url)
					.then(res => res.json())
					.then(
						(result) => {
							// console.log(result);
							if ( result.length != 0 ){
								let msg = "Failed: Invalid Tag returned a valid agentId";
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
							console.log(error);
							return false
						}
					)
			}, 500);
			i++;
		}
	}

	validTagTest(){
		let validTags = this.validTags;
		let i = 0;
		while ( i < validTags.length ){
			let tag = validTags[i][0];
			let email = validTags[i][1];
			let url = api.getanotheragent +"?"+key.TAG+"=" +tag+"&"+key.TECHEMAIL+"="+email;

			setTimeout(()=>{
				fetch(url)
					.then(res => res.json())
					.then(
						(result) => {
							// console.log(result);
							if ( result.length > 0 ){
								let n = 0;
								while ( n < result.length ){
									if (result[n].email == email){
										let msg = "Failed. Returned same tech email";
										this.setState({
											result: c.RESULT_FAILED,
											errors: this.state.errors + msg
										});
									}
									n++;
								}
							}
							let testNotPassed = this.state.testNotPassed - 1;
							this.setState({
								testNotPassed: testNotPassed,
								progress: testNotPassed == 0 ? c.PROGRESS_COMPLETED : c.PROGRESS_IN_PROG,
								result: testNotPassed == 0 && this.state.result == c.RESULT_NA ? c.RESULT_PASS : this.state.result
							});
							
						},
				     	(error) => {
							console.log(error);
							return false
						}
					)
			}, 500);
			i++;
		}
	}

	startTest(){
		let n = this.invalidTags.length + this.validTags.length;
		// console.log(n);
		this.setState({
			progress: c.PROGRESS_IN_PROG,
			testNotPassed: n
		});

		// This tests makes sure that with valid tags and valid 
		// email, the email that we get back should not be the same as the
		// one that we sent
		this.validTagTest();

		// This test makes sure that with invalid tags,
		// we should not get back any agent emails
		this.invalidTagTest();
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

export default GetAnotherAgentTest;