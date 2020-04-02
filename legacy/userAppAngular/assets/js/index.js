/* Wait for the page to load */
$(function() {
    console.log("Ready! 5");


    // Update the variables below with your applicationID and applicationSecret strings
    var applicationID = "dcb692b0564b11eabb3887f44e39165a",
        applicationSecret = "BrxZMv6ThPI1ZfdSRvpWhj6BZudBtQzI6dxHMmqV6uDEGmwO6WuvSpkfmA64cEhS";

    /* Bootstrap the SDK */
    angular.bootstrap(document, ["sdk"]).get("rainbowSDK");

    /* Callback for handling the event 'RAINBOW_ONREADY' */
    var onReady = function onReady() {
        console.log("[DEMO] :: On SDK Ready !");

        // do something when the SDK is ready
        // var myRainbowLogin = "gabrielrulz@live.com.sg";       // Replace by your login
        // var myRainbowPassword = "iHz-A<@3Rz_6"; // Replace by your password

        var myRainbowLogin = "kkkgabriel@hotmail.com";
        var myRainbowPassword = "Longpassword!1";
        var strId = "5e52a877b4528b74a00c92df";

        rainbowSDK.connection.signin(myRainbowLogin, myRainbowPassword)
        .then(function(account) {
              // Successfully signed to Rainbow and the SDK is started completely. Rainbow data can be retrieved.
            console.log("Login successful.");

            rainbowSDK.contacts.searchById(strId).then(function(contact){
                console.log(contact);

                rainbowSDK.conversations.openConversationForContact(contact).then(function(conversation){
                    console.log("conversation opened!");
                    console.log(conversation);

                    // var strMessage = "Yes la its works";
                    // var message = rainbowSDK.im.sendMessageToConversation(conversation, strMessage);
                    // console.log(message);


                    document.getElementById("btn").addEventListener("click", function(){
                        console.log("btn is clicked");
                        var strMessage = document.getElementById("textbox").value;
                        var message = rainbowSDK.im.sendMessageToConversation(conversation, strMessage);
                        document.getElementById("textbox").value = "";
                        console.log(conversation.messages);

                    });
                    document.getElementById("btn2").addEventListener("click", function(){
                        console.log("View convo");
                        console.log(conversation.messages);
                    });


                }).catch(function(err){
                    console.log("error opening conversation for contact");
                    console.log(err);
                });


            }).catch(function(err){
                console.log(err);
            });            


            rainbowSDK.events.on('rainbow_onmessagereceived', function(message) {
                console.log("New message received");
                console.log(message);
            });
        })
        .catch(function(err) {
              // An error occurs (e.g. bad credentials). Application could be informed that sign in has failed
              console.log("login failed");
              console.log(err);
        });
    };

    /* Callback for handling the event 'RAINBOW_ONCONNECTIONSTATECHANGED' */
    var onLoaded = function onLoaded() {
        console.log("[DEMO] :: On SDK Loaded !");

        // Activate full SDK log
        rainbowSDK.setVerboseLog(false);

        rainbowSDK
            .initialize(applicationID, applicationSecret)
            .then(function() {
                console.log("[DEMO] :: Rainbow SDK is initialized!");
            })
            .catch(function(err) {
                console.log("[DEMO] :: Something went wrong with the SDK...", err);
            });
    };




    /* Listen to the SDK event RAINBOW_ONREADY */
    document.addEventListener(rainbowSDK.RAINBOW_ONREADY, onReady)

    /* Listen to the SDK event RAINBOW_ONLOADED */
    document.addEventListener(rainbowSDK.RAINBOW_ONLOADED, onLoaded);


    /* Load the SDK */
    rainbowSDK.load();
});