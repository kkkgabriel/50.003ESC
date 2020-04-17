import React from 'react';
import AgentLogin from './unitTests/agentLogin.js';
import EndAgentCall from './unitTests/endAgentCall.js';
import AgentSignout from './unitTests/agentSignout.js';
import ToggleAgentAvailability from './unitTests/toggleAgentAvailability.js';
import RequestAgent from './unitTests/requestAgent.js';
import GetAnonymous from './unitTests/getAnonymous.js';


require('bootstrap');

class Testcases extends React.Component {
	constructor (props){
		super(props);

		this.state = {
			title: "Unit Tests"
		}
	}

	changePage =()=>{
		this.setState({
			title: this.state.title =="Unit Tests" ? "System Tests":"Unit Tests"
		});
	}

	startAllTests =()=>{
		// AgentLogin.startTests();
	}

	render () {
		return (
			<div>
				<div>
					<h1>{this.state.title}</h1>
					<div class="container">
						<div class="row">
							<div class="col-sm">
								{this.state.title=="System Tests" &&
									<button type="button" onClick={this.changePage} class="btn btn-primary">← View Unit Tests</button>			
								}
							</div>
							<div class="col-sm">
								<button type="button" onClick={this.startAllTests} class="btn btn-info">Start All</button> 					
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
					<tbody>
						<AgentLogin/>
						<ToggleAgentAvailability/>
						<EndAgentCall/>
						<AgentSignout/>
						<RequestAgent/>
						<GetAnonymous/>
					</tbody>
				</table>
			</div>
		)
	}
}

export default Testcases;
