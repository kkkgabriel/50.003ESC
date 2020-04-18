import React from 'react';
import * as api from '../constants/apiPaths';
import * as c from '../constants/constants';
import * as key from '../constants/keys';

class EndAgentCall extends React.Component {
	constructor (props){
		super(props);

		this.validRainbowIds = [
			// "Jibbirhsasdf",	// uncomment this to fail the test
			"5e8ab9b835c8367f99b98316",	// AccountsNBills8@gmail.com
			"5e8abd1735c8367f99b98443",	// MobilePostpaid8@gmail.com
			"5e8abd5935c8367f99b984a6",	// MobilePrepaid8@gmail.com
			"5e8aba1335c8367f99b98343",	// Broadband8@gmail.com
			"5e8abdde35c8367f99b98548",	// TV8@gmail.com
			"5e8aba7c35c8367f99b98394",	// HomeLine8@gmail.com
			"5e8abda235c8367f99b984ee",	// OnlinePurchase8@gmail.com
			"5e8abcb135c8367f99b98404"	// Lifestyle8@gmail.com
		];

		this.invalidRainbowIds = [
			"Jibbirhsasdf",
			"h98nsorn9t8sy",
			"nowa7va8w7nyoarw87vettor(S8984324i23"
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
		console.log("EndAgentCall mounted");
		// this.startTests();
	}

	startTests = ()=>{
		// console.log("making api call for login test");
		let n = this.invalidRainbowIds.length + this.validRainbowIds.length;
		// console.log(n);
		this.setState({
			progress: c.PROGRESS_IN_PROG,
			testNotPassed: n
		});
		// attempt to login with an valid username
		// this attempt should affect only 1 row in the db
		this.validRainbowIdTest();

		// attempt to login with an invalid username
		// this attempt should not affect any rows in the db
		this.invalidRainbowIdTest();

	}


	validRainbowIdTest = ()=>{
		let validRainbowIds = this.validRainbowIds;
		let i = 0;
		while ( i< validRainbowIds.length ) {
			let validRainbowId = validRainbowIds[i]
			let url = api.endagentcall +"?"+key.RAINBOWID+"=" +validRainbowId;

			// console.log(url);
			fetch(url)
			.then(res =>{
				res.json().then((data)=>{
					console.log(data);

					// if valid agent is unable to end call, set result to failed and add error msg
					if (!data.status.success){
						this.setState({
							result: c.RESULT_FAILED,
							errors: this.state.errors+data.status.error.errorMsg+"\n"
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


	invalidRainbowIdTest = ()=>{
		let value = true
		let invalidRainbowIds = this.invalidRainbowIds;	
		let i = 0;		
		while ( i< invalidRainbowIds.length) {
			let invalidRainbowId = invalidRainbowIds[i];
			let url = api.endagentcall +"?"+key.RAINBOWID+"=" +invalidRainbowIds;

			// console.log(url);
			fetch(url)
			.then(res =>{
				res.json().then((data)=>{
					console.log(data);

					// if invalid agent is able to end call, set result to failed and add error msg
					if (data.status.success){
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

			i++;
		}
	}

	render(){
		return (
			<tr>
				<td className="align-left">
					End Agent Call method<br/><br/>
					Test 1: ends call with valid rainbow IDs and are not available<br/>
					Test 2: ends call with invalid rainbow IDs.<br/>				
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

export default EndAgentCall;