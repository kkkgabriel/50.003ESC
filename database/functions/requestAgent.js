const axios = require('axios');
var async = require('async');
const express = require('express');
var router = express.Router();
const connection = require('../database');

var tasksList = ["AccountsNBills","MobilePostpaid","MobilePrepaid","Broadband","TV","HomeLine","OnlinePurchase","Lifestyle"];

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

async function loop(tag,callback){
    console.log('Performing task for ' + tag);
    var complete = false;
    /* think busy waiting maybe quite a stupid method, but since this is a asynchronous queue why not?
    probably have to check for heap overflow */
    while(!complete){
        var response = await axios.get("https://neobow.appspot.com/techrequest",{
            params:{
                tag:tag
            }
        })
        console.log(response.data)
        console.log(response.data.success);
        if (response.data.success == true){
            complete = true;
        } 
    }
    callback(null,response.data)
}

// async function makeQuery(tag, callback){
//     connection.query(
//         "SELECT rainbowid from techentries INNER JOIN techagententries ON techentries.`techid` = techagententries.`techid` INNER JOIN tagentries ON techagententries.`tagid` = tagentries.`tagid` WHERE tagentries.`tagname` = ? and techentries.`status`='available' and techentries.`loggedin`=1 LIMIT 1", tag,
//         function(error, results, fields) {

//             if (error) throw error;
            
//             if (results.length == 1){
//                 console.log("these are result for select query");
//                 console.log(results);
//                 let rainbowid = results[0].rainbowid;
//                 console.log("this is rid: "+rid);
//                 connection.query(
//                     "UPDATE techentries SET `status`='not available' where `rainbowid`=?", rainbowid,

//                     (error, results, field)=>{
//                         if (error) {
//                             throw error;
//                         }

//                         if (results.affectedRows == 1){
//                             if (results.message == "(Rows matched: 1  Changed: 1  Warnings: 0" ){
//                                 console.log("this is rainbowid: "+rainbowid);
//                                 callback(null,{rainbowid: rainbowid, success: true})
//                                 return rid = await Promise.resolve(rainbowid);
//                             }
//                         } 

//                         console.log("these are result for select query2");
//                         console.log(results);
//                     }
//                 );
//             }

//             console.log("these are result for select query");
//             console.log(results);
//         }
//     );

// }

var q = async.queue(function(task, callback) {
}, tasksList.length);

var AccountsNBillsq = async.queue(function(task,callback){
    loop("AccountsNBills",callback);
},1);
var MobilePostpaidq = async.queue(function(task,callback){
    loop("MobilePostpaid",callback);
},1);
var MobilePrepaidq = async.queue(function(task,callback){
    loop("MobilePrepaid",callback);
},1);
var Broadbandq = async.queue(function(task,callback){
    loop("Broadband",callback);
},1);
var singtelTVq = async.queue(function(task,callback){
    loop("TV",callback);
},1);
var HomeLineq = async.queue(function(task,callback){
    loop("HomeLine",callback);
},1);
var OnlinePurchaseq = async.queue(function(task,callback){
    loop("OnlinePurchase",callback);
},1);
var Lifestyleq = async.queue(function(task,callback){
    loop("Lifestyle",callback);
},1);


function error_log(queue,name){
    console.error(queue+ "experienced an error: " + name);
}
// assign an error callback
q.error(function(err, task) {
    error_log("queue",task.name);
});
AccountsNBillsq.error(function(err, task) {
    error_log("AccountsNBillsq",task.name)
});
MobilePostpaidq.error(function(err, task) {
    error_log("MobilePostpaidq",task.name)
});
MobilePrepaidq.error(function(err, task) {
    error_log("MobilePrepaidq",task.name)
});
Broadbandq.error(function(err, task) {
    error_log("Broadbandq",task.name)
});
singtelTVq.error(function(err, task) {
    error_log("singtelTVq",task.name)
});
HomeLineq.error(function(err, task) {
    error_log("HomeLineq",task.name)
});
OnlinePurchaseq.error(function(err, task) {
    error_log("OnlinePurchaseq",task.name)
});
Lifestyleq.error(function(err,task){
    error_log("Lifestyleq",task.name)
});

//get request to add user to relevant queue.
router.get('/requestAgent',(req,res)=>{
    tag = req.query.tag;
    var tagq = eval(tag+"q");
    tagq.push({name:req.query.name}, function(err,resp){
        res.json(resp);
    })
})

//initialise queue with tags
for(var i =0; i<tasksList.length;i++){
    q.push({name:tasksList[i]},function(err){
    })
}


module.exports=router