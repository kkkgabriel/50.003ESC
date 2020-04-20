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
		this.validUserIds = [
			"Broadband@gmail.com",
			"Broadband2@gmail.com",
			"Broadband3@gmail.com",
			"Broadband4@gmail.com",
			"Broadband5@gmail.com",
			"Broadband6@gmail.com",
			"Broadband7@gmail.com",
			"Broadband8@gmail.com"
		];

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

		api.resetfn();

		// copy the broadband acc to available accounts arr
		this.availableAccounts = [...this.broadbandAccounts];

		// set the number of test to the number of names
		let n = this.names.length;
		this.setState({
			progress: c.PROGRESS_IN_PROG,
			testNotPassed: n
		});
		console.log("starting");

		this.wait(500).then(()=>{	// to ensure reset goes first
			this.test1();
		})
	}

	test1 =()=>{

		this.wait(85000).then(()=>{	// fail the test if still going on after 85s
			if ( this.state.progress !== c.PROGRESS_COMPLETED){
				let msg = "Timeout: something is stuck\n";
				this.setState({
					result: c.RESULT_FAILED,
					errors: this.state.errors + msg
				});
			}
		})

		// Log in all agents
		Promise.all(this.logins())
		.then(values=>{
			console.log("logging in");
			console.log(values)

			// toggle availability
			Promise.all(this.toggleAgentAvailabilities())
			.then(values=>{
				console.log("Toggling availability")
				console.log(values)

				// request Agents
				Promise.all(this.requestAgents())
				.then(values=>{
					console.log("request agents");
					console.log(values);

					// check first batch of data
					for (var i = values.length - 1; i >= 0; i--) {
						this.check(values[i].data);
					}

					// end calls
					Promise.all(this.agentEndCalls())
					.then(values=>{
						console.log("agent end call");
						console.log(values);

						// request Agents
						Promise.all(this.requestAgents())
						.then(values=>{
							console.log("request agents 2");
							console.log(values);

							// check second batch of data
							for (var i = values.length - 1; i >= 0; i--) {
								this.check(values[i].data);
							}
						})
					})
				})
			})
		})
	}

	wait = (t)=>{
		return new Promise((resolve, reject)=>{
			setTimeout(()=>{
				console.log("wait over")
				resolve();
			}, t);
		});
	}

	requestAgents = ()=>{
		// push the requests 
		let promises = [];
		let i =0;
		while(i<8){
			let tag = "Broadband";
			let name = this.names[0];
			promises.push(
				axios.get(api.requestagent,{
				    params:{
				        tag:tag,
				        name:name
				    },
				    timeout: 1000000
				})
			);
			i++;
			this.names.shift();			
			console.log(this.names.length);
		}
		return promises;
	}

	logins =()=>{
		let promises = [];
		let i = 0;
		while (i<8){
			let url = api.agentlogin +"?"+key.EMAIL+"=" +this.validUserIds[i]+"&"+key.PASSWORD+"="+c.PASSWORD;
			promises.push(fetch(url));
			i++;
		}
		this.availableAccounts = [...this.broadbandAccounts];
		return promises;
	}

	toggleAgentAvailabilities =()=>{
		let promises = [];
		let i = 0;
		while (i<8){
			let url = api.toggleagentavailability +"?"+key.RAINBOWID+"=" +this.broadbandAccounts[i]+"&availability=available";
			promises.push(fetch(url));
			i++;
		}
		return promises;
	}

	agentEndCalls =(resolve, reject)=>{
		let promises = [];
		let i = 0;
		while (i<8){
			let url = api.endagentcall +"?"+key.RAINBOWID+"=" +this.broadbandAccounts[i];
			promises.push(fetch(url));
			i++;
		}
		this.availableAccounts = [...this.broadbandAccounts];
		return promises;
	}

	check =(data)=>{
		let error = false;

        if (!data.success){
			// console.log(data)

			// report unable to return agent id
			let msg = "Valid Tag unable to return a valid agentId\n";
			this.setState({
				result: c.RESULT_FAILED,
				errors: this.state.errors + msg
			});
			console.log(msg)
			console.log(data)
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
				console.log(msg)
				console.log(data)
				console.log(this.availableAccounts);
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
					8 agent of the same tag will log in, then toggle their availability.
					8 agent requests will be made. The requests should be responded to one by one.
					The requests will be checked that they do not receive the same agent ID.
					After which, the agents will end their calls. 
					Then, another 8 requests will be made and have their responses checked.<br/>

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