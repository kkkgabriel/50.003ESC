const express = require('express');
var router = express.Router();
const connection = require('../database');

var loginAgentList=[];

router
.get(
	'/agentlogin',
	function(req, res, next) {
		let agentemail = req.query.email;
		let agentpw = req.query.password;
		connection.query(
			/* updates the availability of the agent after successful login*/
			"UPDATE `techentries` SET `loggedin`=1 WHERE `email` = ? and `techpw` = ?" , [agentemail,agentpw],

			function(error, results, fields) {
				let status = {
					success: true,
					error: {
						errorId: 0,
						errorMsg: ""
					}
				}
				if (error) res.status(500).send(error);
				// console.log(results);

				if (results.affectedRows == 1){
					if (results.message != "(Rows matched: 1  Changed: 1  Warnings: 0" ){
						status.success = false;
						status.error.errorMsg = "Agent account already logged in";
						status.error.errorId = 1;
					}
				} else {
					status.success = false;
					status.error.errorMsg = "Invalid credentials";
					status.error.errorId = 2;
				}
				if (status.success){
					console.log("login success");
					//logout sess part 2: check which accounts logged in for sess
					loginAgentList.push(agentemail);
				}
				res.json({status: status});
			}
		);
	}
);

module.exports=router