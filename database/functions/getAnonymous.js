const express = require('express');
var router = express.Router();
const connection = require('../database');
const rainbowSDK = require('../RainbowAPI/config/rainbowSDK');

rainbowSDK.start()
.then(() => {
    console.log("rainbowSDK successfully started")
})

router.get(
	'/getAnonymous',
	(req, res, next)=>{
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
			res.json({status:status});
		});
	}
);

module.exports=router