const express = require('express');
var router = express.Router();
const connection = require('../database');

// precondition: agent entry in db
// postcondition: PASS - agent entry's availability is changed
//                FAIL - no state change
router.get(
	'/toggleagentavailability', 
	function(req, res, next) {
		let rainbowid = req.query.rainbowid;
		let availability = req.query.availability;
		connection.query(
			"UPDATE techentries SET status=? WHERE `rainbowid` = ? and `loggedin`=1;", [availability,rainbowid],
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
						status.error.errorMsg = "agent account already "+availability;
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