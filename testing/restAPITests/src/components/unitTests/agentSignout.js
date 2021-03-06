import React from 'react';
import * as api from '../constants/apiPaths';
import * as c from '../constants/constants';
import * as key from '../constants/keys';

class AgentSignout extends React.Component {
	constructor (props){
		super(props);

		this.invalidUserIds = [
			// "5e8abda235c8367f99b984ee",	// uncomment this maybe fail the test(OnlinePurchase8@gmail.com)
			"Jibbirhsasdf",
			"h98nsorn9t8sy",
			"nowa7va8w7nyoarw87vettor(S8984324i23"
		];

		// Some, not all  of the validuser accounts
		this.validUserIds = [
			// "Jibbirhsasdf",	// uncomment this to fail the test
			"5e8ab9b835c8367f99b98316",	// AccountsNBills8@gmail.com
			"5e8abd1735c8367f99b98443",	// MobilePostpaid8@gmail.com
			"5e8abd5935c8367f99b984a6",	// MobilePrepaid8@gmail.com
			"5e8aba1335c8367f99b98343",	// Broadband8@gmail.com
			"5e8abdde35c8367f99b98548",	// TV8@gmail.com
			// "5e8aba7c35c8367f99b98394",	// HomeLine8@gmail.com
			"5e8abda235c8367f99b984ee",	// OnlinePurchase8@gmail.com
			"5e8abcb135c8367f99b98404"	// Lifestyle8@gmail.com
		];
		this.notLoggedIn = [
			// "5e8aba7c35c8367f99b98394",	// uncomment this maybe fail the test(HomeLine8@gmail.com)
			"5e8ab9ae35c8367f99b9830d", // AccountsNBills7@gmail.com
			"5e8abd0e35c8367f99b9843a",	// MobilePostpaid7@gmail.com
			"5e8abd5435c8367f99b98494",	// MobilePrepaid7@gmail.com
			"5e8aba0f35c8367f99b9833a",	// Broadband7@gmail.com
			"5e8abdd235c8367f99b98524",	// TV7@gmail.com
			"5e8aba7935c8367f99b9838b",	// HomeLine7@gmail.com
			"5e8abd9e35c8367f99b984e5",	// OnlinePurchase7@gmail.com
			"5e8abb3935c8367f99b983ca"	// Lifestyle7@gmail.com
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
		console.log("AgentSignout mounted");
		// this.startTests();
	}

	startTests =()=>{
		let n = this.invalidUserIds.length + this.validUserIds.length + this.notLoggedIn.length;
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

		this.notLoggedInTest();
	}

	invalidUserIdTest =()=>{
		let invalidUserIds = this.invalidUserIds;
		let i = 0;
		while ( i < invalidUserIds.length ){
			let invalidUserId = invalidUserIds[i];

			// set the url
			let url = api.agentsignout +"?"+key.RAINBOWID+"=" +invalidUserId;

			fetch(url)
			.then(res =>{
				res.json().then((data)=>{
					console.log(data);

					// if invalid user is able to signout, set result to failed and add error msg
					if (data.status.success){
						this.setState({
							result: c.RESULT_FAILED,
							errors: this.state.errors+data.status.error.errorMsg+'.\n'
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
			let url = api.agentsignout +"?"+key.RAINBOWID+"=" +validUserId;
			// console.log("This is url: "+url);

			// make the call
			fetch(url)
			.then(res =>{
				res.json().then((data)=>{
					console.log(data);

					// if valid user is unable to signout, set result to failed and add error msg
					if (!data.status.success){
						this.setState({
							result: c.RESULT_FAILED,
							errors: this.state.errors+data.status.error.errorMsg+'.\n'
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

	notLoggedInTest = () =>{
	
		let notLoggedIn = this.notLoggedIn;
		let i = 0;
		while ( i < notLoggedIn.length ){
			let rainbowId = notLoggedIn[i];

			// set the url
			let url = api.agentsignout +"?"+key.RAINBOWID+"=" +rainbowId;
			// console.log("This is url: "+url);

			// make the call
			fetch(url)
			.then(res =>{
				res.json().then((data)=>{
					console.log(data);

					// if not loggedin user is able to signout, set result to failed and add error msg
					if (data.status.success){
						this.setState({
							result: c.RESULT_FAILED,
							errors: this.state.errors+data.status.error.errorMsg+'.\n'
						});

						// add id 3 to failedTests
						if (!this.state.failedTests.includes("3\n")){
							this.state.failedTests.push("3\n")
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
					<b>Agent Signout test</b><br/><br/>
					<b>Test 1</b>: Signing out with invalid rainbow IDs.<br/>
					<b>Test 2</b>: Signing out with valid rainbow IDs which are already signed in.<br/>
					<b>Test 3</b>: Signing out with valid rainbow IDs which are not already signed in.
					
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

export default AgentSignout;