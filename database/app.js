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
var cors = require('cors');

app.use(cors())



/************************* agent methods ***************************
/agentlogin
/endagentcall 
/agentsignout
********************************************************************/
const agentLogin = require('./functions/agentLogin');
const endAgentCall = require('./functions/endAgentCall');
const agentSignOut = require('./functions/agentSignOut');
const toggleAgentAvailability = require('./functions/toggleAgentAvailability');

app.use('/', agentLogin); 
app.use('/', endAgentCall);
app.use('/', agentSignOut);
app.use('/', toggleAgentAvailability);


/************************* user methods ****************************
/techrequest
/getAnonymous
/requestAgent 
*******************************************************************/

const techRequest = require('./functions/techRequest');
const getAnonymous = require('./functions/getAnonymous');
const requestAgent = require('./functions/requestAgent');
app.use('/', techRequest);
app.use('/', requestAgent);
app.use('/', getAnonymous);

app.get('/status', (req, res) => res.send('noice!'));

// Reset method just for our convenience
app.get('/reset',
	(req, res)=>{
		let status = 'not available';
		let loggedin = 0;
		if (req.query.availability != null && req.query.availability==1){
			status = 'available';
			loggedin = 1;
		}
		connection.query(
			/* updates the availability of the agent after successful login*/
			"UPDATE `techentries` SET `loggedin`=?,`status`=?",[loggedin, status],

			function(error, results, fields) {
				if (error) res.status(500).send(error);
				res.json({results: results, done: true});
			}
		);
	});

/// Port 8080 for Google App Engine
app.listen(process.env.PORT || 3500);

//use signals to intercept terminal cmds
//SIGINT : ctrl^c
//SIGTERM : termination cmd
process.on('SIGINT',() =>{
	console.info('SIGTERM signal for database receieved');
	/********************** import variables **************************/
} );
