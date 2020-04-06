const express = require('express');
var router = express.Router();
const connection = require('../database');

router.get(
	'/techrequest',
	function(req, res, next) {
		let tag = req.query.tag;
		let notemail = req.query.notemail;

		connection.query(
			"SELECT rainbowid from techentries INNER JOIN techagententries ON techentries.`techid` = techagententries.`techid` INNER JOIN tagentries ON techagententries.`tagid` = tagentries.`tagid` WHERE tagentries.`tagname` = ? and techentries.`status`='available' and techentries.`loggedin`=1 and techentries.`email` != ?LIMIT 1", [tag, notemail],
			function(error, results, fields) {

				if (error) throw error;

				let success = true;
				let errorMsg = "";
				let errorId = 0;
				let rainbowid = "";
				
				if (results.length == 1){
					rainbowid = results[0].rainbowid;
					connection.query(
						"UPDATE techentries SET `status`='not available' where `rainbowid`=?", rainbowid,

						(error, results, field)=>{
							if (error) {
								throw error;
							}

							if (results.affectedRows == 1){
								if (results.message != "(Rows matched: 1  Changed: 1  Warnings: 0" ){
									success = false;
									errorMsg = "Agent not available";
									errorId = 1;
								} else {
									// res.json({agentId: rainbowid, success:success, errorId: errorId, errorMsg: errorMsg});
								}
							} else {
								success = false;
								errorMsg = "This should not happen";
								errorId = 2;
							}
						}
					);
				} else {
					success = false;
					errorMsg = "No available agent at the moment";
					errorId = 3;
				}
				res.json({agentId: rainbowid, success:success, errorId: errorId, errorMsg: errorMsg});
			}
		);
	}
);

module.exports=router