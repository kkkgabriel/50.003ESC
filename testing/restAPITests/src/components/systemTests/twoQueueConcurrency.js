import React from 'react';
import * as api from '../constants/apiPaths';
import * as c from '../constants/constants';
import * as key from '../constants/keys';
const axios = require('axios');

class TwoQueueConcurrency extends React.Component {
	constructor(props){
		super(props);

		this.rainbowIds = [
			"5e6009cad8084c29e64eb43f",	// AccountsNBills
			"5e600991d8084c29e64eb436"	// MobilePostpaid
		]
		this.emails = [
			"AccountsNBills@gmail.com",
			"MobilePostpaid@gmail.com"
		];
		this.tags = [
			"MobilePostpaid",
			"AccountsNBills"
		]

		this.availableAccounts = [];

		this.names = [
			"Alexander",
			"Benjamin",
			"Christopher",
			"Daniel"
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
		this.availableAccounts = [...this.rainbowIds];

		api.resetfn();

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
		// Make requests
		Promise.all(this.requestAgents())
		.then(values=>{
			console.log(values);

			for (var i = 0; i < values.length; i++) {
				if (i==2){
					this.availableAccounts = [...this.rainbowIds];					
				}
				this.check(values[i].data);
			}
		})

		// wait 8s  
		this.wait(8000).then(()=>{

			// login
			Promise.all(this.logins())
			.then(values=>{
				// console.log("this.login values");
				// console.log(values)

				// toggle agent availabilities
				Promise.all(this.toggleAgentAvailabilities())
				.then(values=>{
					// console.log("this.toggleAgentAvailabilities values");
					// console.log(values)

					// wait 8s 
					this.wait(8000).then(()=>{
						Promise.all(this.agentEndCalls())
						.then(values=>{
							// console.log("this.agentEndCalls values");
							// console.log(values)
							console.log("all calls done");
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
		while(i<4){
			let tag = this.tags[i%2];
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
		while (i<2){
			let url = api.agentlogin +"?"+key.EMAIL+"=" +this.emails[i]+"&"+key.PASSWORD+"="+c.PASSWORD;
			promises.push(fetch(url));
			i++;
		}
		return promises;
	}

	toggleAgentAvailabilities =()=>{
		let promises = [];
		let i = 0;
		while (i<2){
			let url = api.toggleagentavailability +"?"+key.RAINBOWID+"=" +this.rainbowIds[i]+"&availability=available";
			promises.push(fetch(url));
			i++;
		}
		return promises;
	}

	agentEndCalls =(resolve, reject)=>{
		let promises = [];
		let i = 0;
		while (i<2){
			let url = api.endagentcall +"?"+key.RAINBOWID+"=" +this.rainbowIds[i];
			promises.push(fetch(url));
			i++;
		}
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
				let msg = "Agent ID returned is not available\n";
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
					<b>2 Queue Concurrency</b><br/><br/>
					<b>Test 1: </b> 
					4 request agent calls will be made to 2 different tags.
					These will not finish immediately.
					The first 2 request agent calls should finish first. 
					2 agent end call calls will be made, and the last 2 requestagent calls should finish, with the same agent id as the first 2. <br/>

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


export default TwoQueueConcurrency;