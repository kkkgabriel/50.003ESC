const express = require('express')
var router = express.Router()
const connection = require('../database');

/*verification of agent password by comparing password from database to its respective username*/
router.get('/agentlogin', function(req, res, next) {
    connection.query(
      /*selects agent password from database*/
      "SELECT `techpw` FROM `techentries` WHERE `email`=?", req.query.userId,
      function(error, results, fields) {
        if (error) res.status(500).send(error);
        console.log(results);
        /* res.json returns the function*/
        // res.json(results);
      }
    );
    connection.query(
      /*updates the availability of the agent after successful login*/
      "UPDATE `techentries` SET `status`='available' WHERE `email` = ?", req.query.userId,
      function(error, results, fields) {
        if (error) res.status(500).send(error);
        console.log(results);
        res.json(results);
      }
    );

});

/*selects agents that are able to help with user's query by checking agent's tags and availability*/
router.get('/techrequest', function(req, res, next) {
  connection.query(
    "SELECT email from techentries INNER JOIN techagententries ON techentries.`techid` = techagententries.`techid` INNER JOIN tagentries ON techagententries.`tagid` = tagentries.`tagid` WHERE tagentries.`tagname` = ? and techentries.`status`='available' ", req.query.tagname,
    function(error, results, fields) {
      if (error) throw error;
    }
  );
});

/*selects an available account for a new user*/
router.get('/getguestaccount', function(req, res, next) {
  connection.query(
    /*selects an available account for a new user*/
    "SELECT email, userpw FROM entries WHERE entries.rainbowstatus ='available'", req.query.userId,
    function(error, results, fields) {
      if (error) throw error;
      res.json(results);
    }
  );
  connection.query(
    /*updates status of user account to prevent another user from trying to access the account while it is in session*/
    "UPDATE entries SET rainbowstatus='not available' WHERE email =?", req.query.userId,
    function(error, results, fields) {
      if (error) throw error;
      res.json(results);
    }
  );
});

/*updates status of user to available when session has ended*/
router.get('/endusercall', function(req, res, next) {
  connection.query(
    "UPDATE entries SET rainbowstatus='available' WHERE email =?", req.query.userId,
    function(error, results, fields) {
      if (error) throw error;
      res.json(results);
    }
  );
});

/*selects agents that are able to help with user's query by checking agent's tags and availability with exclusion of previous tech's email*/
router.get('/getanotheragent', function(req, res, next) {
  connection.query(
    "SELECT email from techentries INNER JOIN techagententries ON techentries.`techid` = techagententries.`techid` INNER JOIN tagentries ON techagententries.`tagid` = tagentries.`tagid`  WHERE tagentries.`tagname`=? and not techentries.`email`=? and techentries.`status`='available'" , [req.query.tagname,req.query.techemail],
    function(error, results, fields) {
      if (error) throw error;
      res.json(results);
    }
  );
});

/*selects agents that are able to help with user's query by checking agent's tags and availability*/
router.get('/getdifftag', function(req, res, next) {
  connection.query(
    "SELECT email from techentries INNER JOIN techagententries ON techentries.`techid` = techagententries.`techid` INNER JOIN tagentries ON techagententries.`tagid` = tagentries.`tagid` WHERE tagentries.`tagname` = ? and techentries.`status`='available' ", req.query.tagname,
    function(error, results, fields) {
      if (error) throw error;
      res.json(results);
    }
  );
});

/*updates agents availability status when a call has been ended*/
router.get('/getagentcall', function(req, res, next) {
  connection.query(
    "UPDATE techentries SET status='available' WHERE email = ?", req.query.userId,
    function(error, results, fields) {
      if (error) throw error;
      res.json(results);
    }
  );
});

module.exports = router


// /* returns user entries*/
// app.route('/entries')
//   .get(function(req, res, next) {
//     connection.query(
//       "SELECT * FROM `entries`", req.query.userId,
//       function(error, results, fields) {
//         if (error) throw error;
//         res.json(results);
//       }
//     );
//   });
// /*returns messages between agents and users (depreciated)*/
// app.route('/chat')
//   .get(function(req, res, next) {
//     connection.query(
//       "SELECT * FROM `chat`", req.params.userId,
//       function(error, results, fields) {
//         if (error) throw error;
//         res.json(results);
//       }
//     );
//   });