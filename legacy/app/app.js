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

	    $scope.tags = [	// hardcoded tags
	    	"Accounts and Bills",
	    	"Mobile Postpaid",
	    	"Mobile Prepaid",
	    	"Broadband",
	    	"TV",
	    	"HomeLine",
	    	"Online Purchase",
	    	"Lifestyle"
    	];

	    var onReady = function onReady() {
			console.log("[DEMO] :: On SDK Ready !");

			$('#msgInput').keyup(function(event){
				if ( event.keyCode === 13 ){
					// console.log("enter button is pressed");
					$('#sendBtn').click();
				}
			});
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
							$scope.conversation = conversation;
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

	    $rootScope.sendMsg = function(){
			var strMessage = $scope.draft;
			console.log("message sent!");
			sdk.im
			.sendMessageToConversation($scope.conversation, strMessage);
			console.log($scope.conversation.messages);
			$scope.draft = "";
		}

		$rootScope.tagOnClick = function(tag){
			// console.log("tag clicked");
			console.log(tag);
			var strId = "";
			if ( tag == "Accounts and Bills" ){
				console.log("AccountNBills clicked");
				strId = '5e6009cad8084c29e64eb43f';
			} else if ( tag == "Mobile Postpaid" ){
				console.log("Mobile Postpaid clicked");
				strId = '5e600991d8084c29e64eb436';
			} else if ( tag == "Mobile Prepaid" ){
				console.log("Mobile prepaid clicked");
				strId = '5e6009e2d8084c29e64eb448';
			} else if ( tag == "Broadband"){
				console.log("broadband clicked");
				strId = '5e6009fed8084c29e64eb45a';
			} else if ( tag == "TV"){
				console.log("tv clicked");
				strId = '5e600a10d8084c29e64eb463';

			} else if ( tag == "HomeLine"){
				console.log("homeline clicked");
				strId = '5e600a2ad8084c29e64eb46c';

			} else if ( tag == "Online Purchase"){
				console.log("online purchase clicked");
				strId = '5e600a42d8084c29e64eb475';

			} else if ( tag == "Lifestyle" ){
				console.log("lifstyle clicked");
				strId = '5e600a59d8084c29e64eb47e';
			} else {
				// console.log("back to potato");
				// strId = '5e52a877b4528b74a00c92df';	// potator
			}
			
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
						$scope.conversation = conversation;

					})
					.catch(function(err){
						console.log(err);
					});
				})
				.catch(function(err){
					console.log(err);
				});

		}


	    document.addEventListener(sdk.RAINBOW_ONREADY, onReady);

	    document.addEventListener(sdk.RAINBOW_ONLOADED, onLoaded);

	    sdk.load();

	    return true;
	}
]);
