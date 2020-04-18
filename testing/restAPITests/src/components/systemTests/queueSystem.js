import React from 'react';
import * as api from '../constants/apiPaths';
import * as c from '../constants/constants';
import * as key from '../constants/keys';
const axios = require('axios');

class QueueSystem extends React.Component {
	constructor(props){
		super(props);

		this.broadbandAccounts = [
			// "5e6009fed8084c29e64eb45a",	uncomment this to fail the test // broadband
			"5e6009fed8084c29e64eb45a",	// broadband
			"5e8aba1f35c8367f99b9834c",	// broadband2
			"5e8aba3e35c8367f99b98355",	// broadband3
			"5e8aba0535c8367f99b9831f",	// broadband4
			"5e8aba0935c8367f99b98328",	// broadband5
			"5e8aba0c35c8367f99b98331",	// broadband6
			"5e8aba0f35c8367f99b9833a",	// broadband7
			"5e8aba1335c8367f99b98343"	// broadband8
		]

		this.availableAccounts = [];

		this.names = [
			"Alexander",
			"Benjamin",
			"Christopher",
			"Daniel",
			"Ethan",
			"Fernando",
			"Gabriel",
			"Henry",
			"Isaac",
			"Jacob",
			"Kevin",
			"Liam",
			"Mason",
			"Noah",
			"Owen",
			"Parker"
		]

		this.state = {
			expected: "",
			progress: c.PROGRESS_NOT_DONE,
			result: c.RESULT_NA,
			testNotPassed: 0,
			errors: "",
			failedTests: []
		}
	}

	startTests =()=>{

		// copy the broadband acc to available accounts arr
		this.availableAccounts = [...this.broadbandAccounts];

		// set the number of test to the number of names
		let n = this.names.length;
		this.setState({
			progress: c.PROGRESS_IN_PROG,
			testNotPassed: n
		});
		console.log("starting");

		this.test1();
	}

	test1 =()=>{

		// i will be the var to loop through all the names
		let i =0;

		// use resetfn to simulate login agents
		// console.log("First login");
		api.resetfn(1);

		// Note: the reset promise has to be exactly after the 8th promise and before the 9th
		// if the reset promise resolves before the 8th promise, there will be some promises that would not resolve as there are not enough agents
		// if the reset promise is set to resolve after the 9th promise, the 9th promise will not resolve as there are not enough agents
		// unfortunately it seems impossible to control the order of the async tasks, so this is the only way i to test the queue system

		// store first 8 promises into a list so that these will execute first
		let promises = []

		// push the first 8 promises into the arr
		while(i<8){
			let tag = "Broadband";
			let name = this.names[i];
			promises.push(
				axios.get(api.requestagent,{
		            params:{
		                tag:tag,
		                name:name
		            },
		            timeout: 1000000
		        })
		    );
		    i++
		}

		Promise.all(promises)
		.then( values=>{

			// continue only after the first batch of promises have resolved

			// Check the first 8 values
			// console.log(values);
			for (var i = values.length - 1; i >= 0; i--) {
				this.check(values[i]);
			}

			// make the reset
			fetch(api.reset+"?availability="+1)
			.then(res =>{
				res.json().then(data=>{
					console.log("2 login");
					if (!data.done){
						console.log("FAILED TO RESET");
					} else {

						// if reset is successful
						// console.log("Reset 1 done");

						// Copy the accounts again
						this.availableAccounts = [...this.broadbandAccounts];

						// push the last 8 requests 
						let promises = [];
						let i =8;
						while(i<16){
							let tag = "Broadband";
							let name = this.names[i];
							promises.push(
								axios.get(api.requestagent,{
								    params:{
								        tag:tag,
								        name:name
								    },
								    timeout: 1000000
								})
							);
							i++
						}

						Promise.all(promises)
						.then(nvalues=>{
							console.log(nvalues);

							// check the last 8 values
							for (var i = nvalues.length - 1; i >= 0; i--) {
								this.check(nvalues[i]);
							}
						})
					}
				})
			})
		});		
	}

	check =(res)=>{
		let data = res.data;
		let error = false;

        if (!data.success){
			// console.log(data)

			// report unable to return agent id
			let msg = "Valid Tag unable to return a valid agentId\n";
			this.setState({
				result: c.RESULT_FAILED,
				errors: this.state.errors + msg
			});
			error = true;
			
		} else {	// data success
			let agentId = data.agentId;

			// report error if agentId is not in accounts arr
			if (!this.availableAccounts.includes(agentId)){
				let msg = "Agent ID returned is not available or is a duplicate\n";
				this.setState({
					result: c.RESULT_FAILED,
					errors: this.state.errors + msg
				});
				error = true;

			} else {	// if everything is going according to plan

				// Take agent id out of accounts arr
				let index  = this.availableAccounts.indexOf(agentId);
				this.availableAccounts.splice(index, 1);
			}
		}

		if (error){
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

	}
	        


	render(){
		return (
			<tr>
				<td className="align-left">
					<b>Queue system</b><br/><br/>
					<b>Test 1: </b> 
					With 8 agents of the same tag available, 8 requests will be sent to the server. The response should contain a different agent ID everytime.
					Once 8 requests are handled, the 8 agents will end their calls and another 8 requests will be made.
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

export default QueueSystem;