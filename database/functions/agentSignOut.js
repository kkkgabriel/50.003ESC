const express = require('express');
var router = express.Router();
const connection = require('../database');

//  precondition: agent's rainbowid is valid entry in db
//  postcondition: PASS - update agent's loggedin in db to become 0 (isLoggedOut)
//                 FAIL - no state change
router.get(
	'/agentsignout',
	(req, res, next)=>{
		let rainbowid = req.query.rainbowid;
		connection.query(
			/* updates the availability of the agent after successful login*/
			"UPDATE `techentries` SET `loggedin`=0,`status`='not available' WHERE `rainbowid` = ?", rainbowid,

			function(error, results, fields) {
				if (error) res.status(500).send(error);
				// console.log(results);
				let status = {
					success: true,
					error: {
						errorId: 0,
						errorMsg: ""
					}
				}
				if (results.affectedRows == 1){
					if (results.message != "(Rows matched: 1  Changed: 1  Warnings: 0" ){
						status.success = false;
						status.error.errorMsg = "Agent account already logged out";
						status.error.errorId = 1;
					}
				} else {
					status.success = false;
					status.error.errorMsg = "Agent account not found";
					status.error.errorId = 2;
				}
				res.json({status: status});
			}
		);
	}
);

module.exports=router