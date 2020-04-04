/* https://medium.com/@austinhale/building-a-node-api-with-express-and-google-cloud-sql-9bda260b040f*/
/*  
	Databases → Create database
	Users → Create User Account. Set it for “Allow any host(%)” for now.
	Authorization → Add Network. Use whatip.me to copy / pasta your IPv4
 */
/* run nodejs*/
/* http://localhost:3000/entries*/
require('dotenv').config()

//dependencies
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./database');

let n = 0;
const rainbowSDK = require('./RainbowAPI/config/rainbowSDK')
rainbowSDK.start()
.then(() => {
    console.log("rainbowSDK successfully started")
    console.log("this is n: "+ n)
    n += 1;
})


/************************* agent methods ***************************
/agentlogin
/endagentcall
/agentsignout
********************************************************************/

/*verification of agent password by comparing password from database to its respective username*/
app.route('/agentlogin')
.get(function(req, res, next) {
	let agentemail = req.query.agentemail;
	let agentpw = req.query.agentpw;
	connection.query(
		/* updates the availability of the agent after successful login*/
		"UPDATE `techentries` SET `loggedin`=1,`status`='available' WHERE `email` = ? and `techpw` = ?" , [agentemail,agentpw],

		function(error, results, fields) {
			if (error) res.status(500).send(error);
			// console.log(results);

			let success = false;
			let errorMsg = "";
			let errorId = 0;
			if (results.affectedRows == 1){
				if (results.message == "(Rows matched: 1  Changed: 1  Warnings: 0" ){
					success = true;
				} else {
					errorMsg = "Agent account already logged in";
					errorId = 1;
				}
			} else {
				errorMsg = "Invalid credentials";
				errorId = 2;
			}
			res.json({success:success, errorId: errorId, errorMsg: errorMsg});
		}
	);
});

/*updates agents availability status when a call has been ended*/
app.route('/endagentcall')
.get(function(req, res, next) {
	let email = req.query.email;
	connection.query(
		"UPDATE techentries SET status='available' WHERE email = ? and `loggedin`=1", email,
		function(error, results, fields) {
		if (error) throw error;
			let success = false;
			let errorMsg = "";
			let errorId = 0;
			if (results.affectedRows == 1){
				if (results.message == "(Rows matched: 1  Changed: 1  Warnings: 0" ){
					success = true;
				} else {
					errorMsg = "agent account already available";
					errorId = 1;
				}
			} else {
				errorMsg = "agent account not found";
				errorId = 2;
			}
			res.json({success:success, errorId: errorId, errorMsg: errorMsg});
			// TODO2: check return values

		}
	);
});


// signout
app.route('/agentsignout')
.get((req, res, next)=>{
	let agentemail = req.query.agentemail;
	connection.query(
		/* updates the availability of the agent after successful login*/
		"UPDATE `techentries` SET `loggedin`=0,`status`='not available' WHERE `email` = ?", agentemail,

		function(error, results, fields) {
			if (error) res.status(500).send(error);
			// console.log(results);

			let success = false;
			let errorMsg = "";
			let errorId = 0;
			if (results.affectedRows == 1){
				if (results.message == "(Rows matched: 1  Changed: 1  Warnings: 0" ){
					success = true;
				} else {
					errorMsg = "Agent account already logged out";
					errorId = 1;
				}
			} else {
				errorMsg = "Agent account not found";
				errorId = 2;
			}
			res.json({success:success, errorId: errorId, errorMsg: errorMsg});
		}
	);
});


/************************* user methods ****************************
/getguestaccount
/endusercall
/techrequest
/getAnonymous
*******************************************************************/


/*selects an available account for a new user*/
app.route('/getguestaccount')
.get(function(req, res, next) {
	let success = false;
	let errorMsg = "";
	let errorId = 0;
	connection.query(
		/*selects an available account for a new user*/
		"SELECT email, userpw FROM entries WHERE entries.rainbowstatus ='available' LIMIT 1",

		function(error, results, fields) {
			if (error) throw error;
			if (results.length == 1){
				let pw = results[0].userpw;
				let email = results[0].email
				let account = {password:pw, email:email};
				connection.query(
					/*updates status of user account to prevent another user from trying to access the account while it is in session*/
					"UPDATE entries SET rainbowstatus='not available' WHERE email =?", email,

					function(error, results, fields) {
						if (error) throw error;

						if (results.affectedRows == 1){
							if (results.message == "(Rows matched: 1  Changed: 1  Warnings: 0" ){
								success = true;
							} else {
								errorMsg = "User account already logged in";
								errorId = 1;
							}
						} else {
							errorMsg = "This is not supposed to happen";
							errorId = 2;
						}
						res.json({account:account, success:success, errorId: errorId, errorMsg: errorMsg});
						
					}
				);
			} else  {
				errorMsg = "No available guest accounts";
				errorId = 3;
				res.json({success:success, errorId: errorId, errorMsg: errorMsg});
			}
		}
	);
		
});

/*updates status of user to available when session has ended*/
app.route('/endusercall')
	.get(function(req, res, next) {
	let email = req.query.email;
	connection.query(
		"UPDATE entries SET rainbowstatus='available' WHERE email =?", email,
		function(error, results, fields) {
			if (error) throw error;

			let success = false;
			let errorMsg = "";
			let errorId = 0;
			if (results.affectedRows == 1){
				if (results.message == "(Rows matched: 1  Changed: 1  Warnings: 0" ){
					success = true;
				} else {
					errorMsg = "User account already logged out";
					errorId = 1;
				}
			} else {
				errorMsg = "User account not found";
				errorId = 2;
			}
			res.json({success:success, errorId: errorId, errorMsg: errorMsg});
			
		}
	);
});


/*selects agents that are able to help with user's query by checking agent's tags and availability*/
app.route('/techrequest')
.get(function(req, res, next) {
	let tag = req.query.tag;

	connection.query(
		"SELECT rainbowid from techentries INNER JOIN techagententries ON techentries.`techid` = techagententries.`techid` INNER JOIN tagentries ON techagententries.`tagid` = tagentries.`tagid` WHERE tagentries.`tagname` = ? and techentries.`status`='available' and techentries.`loggedin`=1 LIMIT 1", tag,
		function(error, results, fields) {

			if (error) throw error;

			let success = true;
			let errorMsg = "";
			let errorId = 0;
			
			if (results.length == 1){
				let rainbowid = results[0].rainbowid;
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
								res.json({agentId: rainbowid, success:success, errorId: errorId, errorMsg: errorMsg});
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
			res.json({success:success, errorId: errorId, errorMsg: errorMsg});
		}
	);
});


app.route('/getAnonymous')
.get((req, res, next)=>{
	let status = {
		success: true,
		error: {
			errorId: 0,
			errorMsg: ""
		}
	}
	const ttl = 3600;
	rainbowSDK.admin.createAnonymousGuestUser(ttl)
	.then((guest)=>{
		res.json({
			status: status,
            loginEmail: guest.loginEmail,
            password: guest.password
		});
	})
	.catch((err)=>{
		status.error.errorId = 1;
		status.error.errorMsg = "Unable to create user";
		res.json({status});
	});
});


app.get('/status', (req, res) => res.send('noice!'));

// Port 8080 for Google App Engine
app.listen(process.env.PORT || 3000);