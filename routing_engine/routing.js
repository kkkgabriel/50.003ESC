// receive tags from the customer
// queries agents based on tags
// send the tags back

const express = require('express');

exports.getAgent = (req, res, next) => {
    const tags = req.body.tags
    // connect to database to retrieve agents name
    // if falied => send an error message to customer
    // after retrieving the agents name, send a call request to the agent
    // after the agent accepted the call => 
}