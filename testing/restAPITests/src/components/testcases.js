import React from 'react';
import AgentLogin from './unitTests/agentLogin.js';
// import TechRequestTest from './unitTests/techrequesttest.js';
// import GetGuestAccountTest from './unitTests/getguestaccounttest.js';
// import EndUserCallTest from './unitTests/endusercalltest.js';
// import GetAnotherAgentTest from './unitTests/getanotheragenttest.js';
// import GetDiffTagTest from './unitTests/getdifftagtest.js';
// import EndAgentCall from './unitTests/endagentcall.js';
require('bootstrap');

class Testcases extends React.Component {
	constructor (props){
		super(props);
	}

	render () {
		return (
			<div>
				<table className="table table-striped table-dark table-bordered table-hover">
					<thead>
					    <tr>
							<th scope="col">Test case</th>
							<th scope="col">Progress</th>
							<th scope="col">Result</th>
							<th scope="col">Errors</th>
					    </tr>
					</thead>
					<tbody>
						<tr><td></td><td></td><td></td><td></td></tr>
						<AgentLogin/>
						<tr><td></td><td></td><td></td><td></td></tr>
					</tbody>
				</table>
			</div>
		)
	}
}

export default Testcases;

						

						// donent
						// <GetAnotherAgentTest />
						// <EndUserCallTest />
						// <GetGuestAccountTest />
						// <LoginTest />
						// <TechRequestTest />
						// <GetDiffTagTest />