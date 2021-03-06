const express = require('express');
var router = express.Router();
const connection = require('../database');

// precondition: agent must be valid and loggedin is 1 (isLoggedIn)
// postcondition: PASS - update agent's status in db to be "available"
//                FAIL - no state change
router.get(
	'/endagentcall', 
	function(req, res, next) {
		let rainbowid = req.query.rainbowid;
		connection.query(
			"UPDATE techentries SET status='available' WHERE rainbowid = ? and `loggedin`=1", rainbowid,
			function(error, results, fields) {
				if (error) throw error;
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
						status.error.errorMsg = "agent account already available";
						status.error.errorId = 1;
					}
				} else {
					status.success = false;
					status.error.errorMsg = "agent account not found";
					status.error.errorId = 2;
				}
				res.json({status: status});
			}
		);
	}
);

module.exports=router