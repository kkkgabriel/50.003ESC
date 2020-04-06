const express = require('express');
var router = express.Router();
const connection = require('../database');

router.get(
	'/agentsignout',
	(req, res, next)=>{
		let agentemail = req.query.email;
		connection.query(
			/* updates the availability of the agent after successful login*/
			"UPDATE `techentries` SET `loggedin`=0,`status`='not available' WHERE `email` = ?", agentemail,

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