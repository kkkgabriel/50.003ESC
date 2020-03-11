import ReactDOM from 'react-dom';
import React from 'react';
import App from 'components/App';

document.addEventListener('DOMContentLoaded', () => {

    // do your setup here
    console.log("[DEMO] :: Starter-Kit of the Rainbow SDK for Web with React started!");
  
    var applicationID = "dcb692b0564b11eabb3887f44e39165a", 
        applicationSecret = "BrxZMv6ThPI1ZfdSRvpWhj6BZudBtQzI6dxHMmqV6uDEGmwO6WuvSpkfmA64cEhS";

    /* Bootstrap the SDK */
    angular.bootstrap(document, ["sdk"]).get("rainbowSDK");

    /* Callback for handling the event 'RAINBOW_ONREADY' */
    var onReady = function onReady() {
        console.log("[DEMO] :: On SDK Ready !");
        // do something when the SDK is ready
        ReactDOM.render(<App />, document.querySelector('#app'));
    };

    /* Callback for handling the event 'RAINBOW_ONCONNECTIONSTATECHANGED' */
    var onLoaded = function onLoaded() {
        console.log("[DEMO] :: On SDK Loaded !");

        rainbowSDK.initialize(applicationID, applicationSecret).then(function() {
            console.log("[DEMO] :: Rainbow SDK is initialized!");
        }).catch(function(err) {
            console.log("[DEMO] :: Something went wrong with the SDK...", err);
        });
    };

    /* Listen to the SDK event RAINBOW_ONREADY */
    $(document).on(rainbowSDK.RAINBOW_ONREADY, onReady);

    /* Listen to the SDK event RAINBOW_ONLOADED */
    $(document).on(rainbowSDK.RAINBOW_ONLOADED, onLoaded);

    /* Load the SDK */
    rainbowSDK.load();


  
});
