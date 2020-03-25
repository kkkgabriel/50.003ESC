import React from 'react';
import LoginTest from './logintest.js';
import TechRequestTest from './techrequesttest.js';
import GetGuestAccountTest from './getguestaccounttest.js';
import EndUserCallTest from './endusercalltest.js';
import GetAnotherAgentTest from './getanotheragenttest.js';
import GetDiffTagTest from './getdifftagtest.js';
import EndAgentCall from './endagentcall.js';
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
						<GetAnotherAgentTest />
						<EndUserCallTest />
						<GetGuestAccountTest />
						<LoginTest />
						<TechRequestTest />
						<GetDiffTagTest />
					</tbody>
				</table>
			</div>
		)
	}
}

export default Testcases;

						

						// donent
						// <EndAgentCall />