const express = require('express');
var router = express.Router();
const connection = require('../database');

router.get(
	'/endagentcall', 
	function(req, res, next) {
		let email = req.query.email;
		connection.query(
			"UPDATE techentries SET status='available' WHERE email = ? and `loggedin`=1", email,
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