import React from 'react';
import * as api from '../constants/apiPaths';
import * as c from '../constants/constants';
import * as key from '../constants/keys';

class RequestAgent extends React.Component {
	constructor (props){
		super(props);

		this.validTags = [
			// ["Lifestyle", "Lifestyle2@gmail.com",  "5e600a59d8084c29e64eb47e" ],	// uncomment this to fail the test
			["Lifestyle", "Lifestyle@gmail.com",  "5e600a59d8084c29e64eb47e" ],	
			["AccountsNBills","AccountsNBills@gmail.com", "5e6009cad8084c29e64eb43f"],
			["MobilePostpaid","MobilePostpaid@gmail.com", "5e600991d8084c29e64eb436" ],
			["MobilePrepaid","MobilePrepaid@gmail.com", "5e6009e2d8084c29e64eb448" ],	
			["Broadband","Broadband@gmail.com", "5e6009fed8084c29e64eb45a "],
			["TV","TV@gmail.com", "5e600a10d8084c29e64eb463 "],	
			["HomeLine", "HomeLine@gmail.com", "5e600a2ad8084c29e64eb46c "],
			["OnlinePurchase", "OnlinePurchase@gmail.com", "5e600a42d8084c29e64eb475 "]
		];

		this.invalidTags = [
			// ["HomeLine", "HomeLine8@gmail.com"],	// uncomment this to fail the test
			["Potato", "Potato@gmail.com"],
			["Tomato", "Tomato@gmail.com"],
			["Apple", "Apple@gmail.com"]
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
		console.log("RequestAgent mounted");
		// this.startTests();
	}

	startTests =()=>{
		let n = this.invalidTags.length + this.validTags.length;
		// console.log(n);

		// reset to log all agents in 
		api.resetfn(1);

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

	validTagTest =()=>{
		let validTags = this.validTags;
		let i = 0;
		while ( i < validTags.length ){
			let tag = validTags[i][0];
			let notemail = validTags[i][1];
			let notrainbowid = validTags[i][2];
			let url = api.requestagent +"?"+key.TAG+"=" +tag+"&"+key.NOTEMAIL+"=" +notemail;
			// console.log(url);
			setTimeout(()=>{
				fetch(url)
					.then(res => {
						res.json().then( data=>{

							// if valid tags are unable to return a user id, set rsult to failed
							if (!data.success){
								let msg = "Valid Tag unable to return a valid agentId\n";
								this.setState({
									result: c.RESULT_FAILED,
									errors: this.state.errors + msg
								});

								// add id 1 to failedTests
								if (!this.state.failedTests.includes("1\n")){
									this.state.failedTests.push("1\n")
								}

							} 

							if (data.success && data.agentId == notrainbowid) {
								let msg = "Got back the same agent\n";
								this.setState({
									result: c.RESULT_FAILED,
									errors: this.state.errors + msg
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

	invalidTagTest =()=>{
		let invalidTags = this.invalidTags;
		let i = 0;
		while ( i < invalidTags.length ){
			let tag = invalidTags[i][0];
			let url = api.requestagent +"?"+key.TAG+"=" +tag;
			// console.log(url);

			setTimeout(()=>{
				fetch(url)
					.then(res => {
						res.json().then( data=>{
							// console.log(data);

							// if invalid tags are able to return a user id, set rsult to failed
							if (data.success){
								let msg = "Invalid Tag returned a valid agentId\n";
								this.setState({
									result: c.RESULT_FAILED,
									errors: this.state.errors + msg
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
					Request agent method<br/><br/>
					Test 1: Requesting with valid tag and an unwanted agent ID.<br/>
					Test 2: Requesting with invalid tag. 
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

export default RequestAgent;