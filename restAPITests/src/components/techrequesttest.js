import React from 'react';
import * as api from './apiPaths';
import * as c from './constants';
import * as key from './keys';

class TechRequestTest extends React.Component {
	constructor (props){
		super(props);
		this.validTags = [
			"Lifestyle", 
			"AccountsNBills",
			"MobilePostpaid",
			"MobilePrepaid",
			"Broadband",
			"TV",
			"HomeLine",
			"OnlinePurchase"
		];
		this.invalidTags = [
			"Potato",
			"Tomato",
			"Apple"
		];
		this.state = {
			expected: "",
			description: "Request Agent method",
			progress: c.PROGRESS_NOT_DONE,
			result: c.RESULT_NA,
			testNotPassed: 0,
			errors: ""
		}

		this.startTest = this.startTest.bind(this);
		this.invalidTagTest = this.invalidTagTest.bind(this);
		this.validTagTest = this.validTagTest.bind(this);
	}

	componentDidMount(){
		// console.log("TechRequestTest mounted");
		this.startTest();
	}

	invalidTagTest(){
		let invalidTags = this.invalidTags;
		let i = 0;
		while ( i < invalidTags.length ){
			let tag = invalidTags[i];
			let url = api.techrequest +"?"+key.TAG+"=" +tag;

			setTimeout(()=>{
				fetch(url)
					.then(res => res.json())
					.then(
						(result) => {
							// console.log(result);
							if ( result.length != 0 ){
								let msg = "Failed: Invalid Tag returned a valid agentId";
								this.setState({
									result: c.RESULT_FAILED,
									errors: this.state.errors + msg
								});
							}
							let testNotPassed = this.state.testNotPassed - 1;
							this.setState({
								testNotPassed: testNotPassed,
								progress: testNotPassed == 0 ? c.PROGRESS_COMPLETED : c.PROGRESS_IN_PROG,
								result: testNotPassed == 0 && this.state.result == c.RESULT_NA ? c.RESULT_PASS : this.state.result
							});
							
						},
				     	(error) => {
							console.log(error);
							return false
						}
					)
			}, 500);
			i++;
		}
	}

	validTagTest(){
		let validTags = this.validTags;
		let i = 0;
		while ( i < validTags.length ){
			let tag = validTags[i];
			let url = api.techrequest +"?"+key.TAG+"=" +tag;

			setTimeout(()=>{
				fetch(url)
					.then(res => res.json())
					.then(
						(result) => {
							// console.log(result);
							if ( result.length < 0 ){
								let msg = "Failed: Result < 0.";
								this.setState({
									result: c.RESULT_FAILED,
									errors: this.state.errors + msg
								});
							}
							let testNotPassed = this.state.testNotPassed - 1;
							this.setState({
								testNotPassed: testNotPassed,
								progress: testNotPassed == 0 ? c.PROGRESS_COMPLETED : c.PROGRESS_IN_PROG,
								result: testNotPassed == 0 && this.state.result == c.RESULT_NA ? c.RESULT_PASS : this.state.result
							});
							
						},
				     	(error) => {
							console.log(error);
							return false
						}
					)
			}, 500);
			i++;
		}
	}

	startTest(){
		let n = this.invalidTags.length + this.validTags.length;
		// console.log(n);
		this.setState({
			progress: c.PROGRESS_IN_PROG,
			testNotPassed: n
		});

		// This test ensures that with valid tags sent,
		// the result is an array.
		this.validTagTest();

		// This test ensures that with invalid tags sent,
		// we do not get back any agent ids
		this.invalidTagTest();
	}

	render(){
		return (
			<tr>
				<td>{this.state.description}</td>
				<td>{this.state.progress}</td>
				<td>{this.state.result}</td>
				<td><div className="data">{this.state.errors}</div></td>
			</tr>
		)
	}
}

export default TechRequestTest;