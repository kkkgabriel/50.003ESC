const dialogflow = require('dialogflow');
const uuid = require('uuid');
const express = require('express');
const cors = require('cors')
const app = express();
const port = 3005;
app.use(cors({origin:'*'}))
app.use(express.json());

	
const LANGUAGE_CODE = 'en-US' 

class DialogFlow {
	constructor (projectId) {
		this.projectId = projectId
		let config = {
			credentials: {
				private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDS8lXXAuV/PuPq\n0y1dJcsegLgo9AwF8fgrW6AxGcaDqTcy/XNNEl7xJw6b8WcstcBEsHMpPuRsgIcj\nJPZlOfgvwJYfcPHZ7cZ4x3a5vMKzpkKwCYLSmeCT0SA8gAVof2lVidozcweN6FpF\n8Ce383MnxwJey9RYSmsx+PT1974F2paDJ8N1OAQ2ETLzS5KGRLeRuEpF6/uZhNQC\ny2YMNqDhk0581u9Z3ZK5xn7IAcGWdTM+6jqHGX886wwN8Aqv/300d3Rq3yd5mMri\nTES7sdpkzHcAx2y4mt3lGnGfhvco7CPcqX7F7+4laHOXKQdglVc7Wrq0CApuHwDK\nsJ5b9zI/AgMBAAECggEAP2KS+Y8Ev8X5fUukQ2uCS7GY5LFkVXr+O6UGDwr0NAaq\nL/epaDy/a431XVVdz7jzQ5CTog6kW5gJQz2tjgAru8mOMndhLL8+Vnd1DN2T0aCB\nRF0vQrH7Id+CZLuBJIO4dnv8JV6IpBLv4TkG7kbIUOkDJNHxhfAiorrwfGJLZn1a\n3PdIoqZaFIYJbzEc/aYlrI3Cq+VntqDIOYJSFHU02ByT7NL4KiO1m3QtEQo6C5yJ\n3WuNu3ol7fZoLrbcV8Qv1gZzCB5NQd220JUxlKxEfb1e8ODWjZl4kvaxTwywI3j4\nzTHHB5y2puh1dFL7HHnU2vuiIWTcLdBWeKTui0ZBuQKBgQDx6/3mexgQ23xqdNa8\n2DnsxiBez5i26leNBW7tUGGfTylBcKtQTtqAna+zZw+wtcnoNqTS1GPXRtbr3f9e\nVvV5SQiDTZ1kGeB3j2V6xySa7Gjn7mkZcFwl9iKKx0lr9U6wBiWIcWvNts0H8JtP\nJrZ0MaZOWMIL3GvNgjU3K+OSqQKBgQDfOOSeOJU2hPCTaZqdzzqiTfhS628CM9cz\nV9VPjzt18VIjIQywLpMlJwSsH8r7DzbNMa7qo49OxIZ1LcnAORQbvuRgHovJPBMi\nPSwQJlsyP9JeEMQOhSsobcCuZWZKFvSUoMKNv2KJv7s7pReJ43ln0i62K2HLL1Rq\nH5KcpagWpwKBgQDn91ilPzJ8N3i8uvuMZ+hi2DcBshzEhz8bwTHz6zcwAj+Ut+wM\nPQ/Wc1ydsRyiXC0VtA+m+HAjY5GA6ISMeOU3PogjHrDj4swQ2DZ926WFx1lvynKM\nKeixnajRWPVVxwmETuB+TAMKZVWDX3oMExqvn0vPo9usc9YKX+eW10aGwQKBgHNH\nGWHQjNZz/x3R2sSGwZwSMhz4cwKrLQbZ5FJLAQUe1DFKHxhZZSo5pUMSxCu1prJ/\nZvrL7vVZrqqTM+6uS4EsqxosjDonaSY0ey338P7ZUNW9SNLK2Qfu7iPiP9ohUrvy\n7aZwYP4MYzAhSS+vpwID3JW9f6qDzc9kcL2vG0hfAoGAaBi9s8ikaW8xXIyah8Cn\nXA3s+DQdnym8r3REn0+IB+AWMDL1JWaU5EQ/qEFej0ffANi66uYgf9HiL7xo0yfq\napd9ny6dm4bJEr8ZCVKPlxGwzd1UqYLh6lWcdsJsRXiJwSnliw3FVr4JJrKonBp7\no9G5z1lh3ntUtuNPhRaFihw=\n-----END PRIVATE KEY-----\n",
				client_email: "dialogflow-yepgmt@rainbowchatbot-gumcjk.iam.gserviceaccount.com"
			}
		}
	
    this.sessionClient = new dialogflow.SessionsClient(config)
    this.intentsClient = new dialogflow.IntentsClient(config);
    this.projectAgentPath = this.intentsClient.projectAgentPath(this.projectId);



	}

	async sendTextMessageToDialogFlow(textMessage, sessionId) {
		// Define session path
		const sessionPath = this.sessionClient.sessionPath(this.projectId, sessionId);
		// The text query request.
		const request = {
			session: sessionPath,
			queryInput: {
				text: {
					text: textMessage,
					languageCode: LANGUAGE_CODE
				}
			}
    }
    // if(context!=null){
    //   request.queryParams = {
    //     contexts:context
    //   }
    // }
		try {
			let responses = await this.sessionClient.detectIntent(request)			
      		console.log('DialogFlow.sendTextMessageToDialogFlow: Detected intent');
				
		  	return responses[0]['queryResult']['fulfillmentText'];
		}
		catch(err) {
			console.error('DialogFlow.sendTextMessageToDialogFlow ERROR:', err);
			throw err
		}
  }
}

const dialogflowtest = new DialogFlow('rainbowchatbot-gumcjk');
const sessionid = uuid.v4();


app.post('/', (req, res) => {
    console.log(req.body["text"])
    console.log(sessionid)
	dialogflowtest.sendTextMessageToDialogFlow(req.body["text"],sessionid).then(result=>{
		return res.send(result)
	}
	
	);
	}
)


app.listen(port, () =>
  console.log(`Example app listening on port ${port}!`),
);
