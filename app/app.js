var app = angular.module("telco", ["sdk"]);

app.controller("mainController", [
	"$scope",
	"$rootScope",
	"rainbowSDK",
	function($scope, $rootScope, sdk) {
	    "use strict";
	

	    /*********************************************************/
	    /**                INITIALIZATION STUFF                 **/
	    /*********************************************************/

	    console.log("[DEMO] :: Rainbow IM Application");

	    var appId = "dcb692b0564b11eabb3887f44e39165a";
	    var appSecret = "BrxZMv6ThPI1ZfdSRvpWhj6BZudBtQzI6dxHMmqV6uDEGmwO6WuvSpkfmA64cEhS";

	    var onReady = function onReady() {
			console.log("[DEMO] :: On SDK Ready !");
	    };

	    var onLoaded = function onLoaded() {
			console.log("[DEMO] :: Rainbow SDK has been loaded!");

			var myRainbowLogin = "kkkgabriel@hotmail.com";
	        var myRainbowPassword = "Longpassword!1";
	        var strId = "5e52a877b4528b74a00c92df";

			sdk
	        .initialize(appId, appSecret)
	        .then(function() {
				console.log("[DEMO] :: Rainbow SDK is initialized!");

				sdk.connection
				.signin(myRainbowLogin, myRainbowPassword)
				.then(function(account){
					console.log("sign in successful");

					sdk.contacts
					.searchById(strId)
					.then(function(contact){
						console.log("found contact");
						console.log(contact)

						sdk.conversations	
						.openConversationForContact(contact)
						.then(function(conversation){
							console.log("conversation opened!");
							console.log(conversation);
							$rootScope.conversation = conversation;
							// for (var m in conversation.messages ){
							// 	$rootScope.messages[conversation.messages.indexOf(m)] = m.data;
							// }

						})
						.catch(function(err){
							console.log(err);
						});
					})
					.catch(function(err){
						console.log(err);
					});

				})
				.catch(function(err){
					console.log("Log in failed");
				});
	        })
	        .catch(function(err) {
				console.log("[DEMO] :: Something went wrong with the SDK...");
				console.log(err);
	        });
	    };

	    var onNewMessage = function(message, conversation, cc){
	    	console.log("New message!");
	    	console.log(message);
	    	console.log(conversation);
	    	console.log(cc);
	    }


	    $rootScope.sendMsg = function(){
			var strMessage = $scope.draft;
			console.log("message sent!");
			sdk.im
			.sendMessageToConversation($rootScope.conversation, strMessage);
			console.log($rootScope.conversation.messages);
			$scope.draft = "";
		}



	    document.addEventListener(sdk.RAINBOW_ONREADY, onReady);

	    document.addEventListener(sdk.RAINBOW_ONLOADED, onLoaded);

	    document.addEventListener(sdk.RAINBOW_ONNEWIMMESSAGERECEIVED, onNewMessage);

	    sdk.load();

	    return true;
	}
]);
