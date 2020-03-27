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
const rainbowSDK = require('./RainbowAPI/config/rainbowSDK')

const rainbowRouter = require('./RainbowAPI/router')
const dbRouter = require('./router/dbRouter')

app.use(bodyParser.urlencoded({ extended: true }))
rainbowSDK.start()
.then(() => {
    console.log("rainbowSDK successfully started")
})
app.get('/status', (req, res) => res.send('Working!'));
app.use(dbRouter)
app.use(rainbowRouter)
// Port 8080 for Google App Engine
app.listen(process.env.PORT || 3000);