import React from 'react';

// unit tests
import AgentLogin from './unitTests/agentLogin.js';
import EndAgentCall from './unitTests/endAgentCall.js';
import AgentSignout from './unitTests/agentSignout.js';
import ToggleAgentAvailability from './unitTests/toggleAgentAvailability.js';
import RequestAgent from './unitTests/requestAgent.js';
import GetAnonymous from './unitTests/getAnonymous.js';

// system tests
import QueueSystem from './systemTests/queueSystem.js';


require('bootstrap');

class Testcases extends React.Component {
	constructor (props){
		super(props);

		this.unitTestsRefs =  {
			agentLoginRef: React.createRef(),
			agentSignoutRef: React.createRef(),
			endAgentCallRef: React.createRef(),
			getAnonymousRef: React.createRef(),
			requestAgentRef: React.createRef(),
			toggleAgentAvailabilityRef: React.createRef()
		}

		this.systemTestsRefs = {
			queueSystemRef: React.createRef()
		}

		this.state = {
			title: "Unit Tests"
		}
	}

	componentDidMount(){
		console.log("component did mount");
		console.log(this.unitTestsRefs);
		// this.unitTestsRefs.agentLoginRef.current.click();
	}

	changePage =()=>{
		this.setState({
			title: this.state.title =="Unit Tests" ? "System Tests":"Unit Tests"
		});
	}

	autoTest =()=>{	
		if (this.state.title == "Unit Tests") {
			this.startAllUnitTest();
		} else if (this.state.title == "System Tests"){
			this.startAllSystemTest();
		}
	}

	startAllSystemTest =()=>{
		this.systemTestsRefs.queueSystemRef.current.click();
	}

	startAllUnitTest =()=>{
		// This is a retarded way but I'll just leave this as it is first lol
		let shortTimeout = 2000;
		let longTimeout = 3000;
		this.unitTestsRefs.agentLoginRef.current.click();	
		(async () => {
			await wait(shortTimeout);
			this.unitTestsRefs.endAgentCallRef.current.click();	
			(async () => {
				await wait(shortTimeout);
				this.unitTestsRefs.toggleAgentAvailabilityRef.current.click();
				(async () => {
					await wait(shortTimeout);
					this.unitTestsRefs.agentSignoutRef.current.click();	
					(async () => {
						await wait(longTimeout);
						this.unitTestsRefs.requestAgentRef.current.click();	
						(async () => {
							await wait(shortTimeout);
							this.unitTestsRefs.getAnonymousRef.current.click();	
						})()
					})()
				})()
			})()
		})()
	}


	render () {
		return (
			<div>
				<div>
					<h1>{this.state.title}</h1>
					<p>Suggestioon: Run the tests in sequence.</p>
					<div class="container">
						<div class="row">
							<div class="col-sm">
								{this.state.title=="System Tests" &&
									<button type="button" onClick={this.changePage} class="btn btn-primary">← View Unit Tests</button>			
								}
							</div>
							<div class="col-sm">
								<button type="button" onClick={this.autoTest} class="btn btn-info">Start All</button> 					
							</div>
							<div class="col-sm">
								{this.state.title=="Unit Tests" &&
									<button type="button" onClick={this.changePage} class="btn btn-primary">View System Tests →</button>			
								}
							</div>
						</div>
					</div>
				</div><br/>
				<table className="table table-striped table-dark table-bordered table-hover">
					<thead>
					    <tr>
							<th className="th-bg" scope="col">Test cases</th>
							<th className="th-sm" scope="col">Progress</th>
							<th className="th-sm" scope="col">Result</th>
							<th className="th-sm" scope="col">Test cases failed</th>
							<th className="th-sm" scope="col">Errors</th>
					    </tr>
					</thead>
					{this.state.title=="Unit Tests" &&
						<tbody>
							<AgentLogin myRef={this.unitTestsRefs.agentLoginRef} />
							<EndAgentCall myRef={this.unitTestsRefs.endAgentCallRef}/>
							<ToggleAgentAvailability myRef={this.unitTestsRefs.toggleAgentAvailabilityRef}/>
							<AgentSignout myRef={this.unitTestsRefs.agentSignoutRef}/>
							<RequestAgent myRef={this.unitTestsRefs.requestAgentRef}/>
							<GetAnonymous myRef={this.unitTestsRefs.getAnonymousRef}/>
						</tbody>
					}
					{this.state.title=="System Tests" &&
						<tbody>
							<QueueSystem myRef={this.systemTestsRefs.queueSystemRef}/>
						</tbody>
					}
				</table>
			</div>
		)
	}
}

async function wait(ms) {
	return new Promise(resolve => {
		setTimeout(resolve, ms);
	});
}

export default Testcases;
