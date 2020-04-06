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




/************************* agent methods ***************************
/agentlogin
/endagentcall 
/agentsignout
********************************************************************/
const agentLogin = require('./functions/agentLogin');
const endAgentCall = require('./functions/endAgentCall');
const agentSignOut = require('./functions/agentSignOut');

app.use('/', agentLogin); 
app.use('/', endAgentCall);
app.use('/', agentSignOut);


/************************* user methods ****************************
/techrequest
/getAnonymous
/requestAgent 
*******************************************************************/

const techRequest = require('./functions/techRequest');
// const getAnonymous = require('./functions/getAnonymous');
const requestAgent = require('./functions/requestAgent');

app.use('/', techRequest);
app.use('/', requestAgent);
// app.use('/', getAnonymous);


app.get('/status', (req, res) => res.send('noice!'));

// Reset method just for our convenience
app.get('/reset',
	(req, res)=>{
		connection.query(
			/* updates the availability of the agent after successful login*/
			"UPDATE `techentries` SET `loggedin`=0,`status`='not available'",

			function(error, results, fields) {
				if (error) res.status(500).send(error);
				res.json({results: results, done: true});
			}
		);
	});

// Port 8080 for Google App Engine
app.listen(process.env.PORT || 3000);