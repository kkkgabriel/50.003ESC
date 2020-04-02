const axios = require('axios');
var async = require('async');
const express = require('express');
var router = express.Router()

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
                tagname:tag
            }
        })
        console.log(response.data)
        if(!isEmpty(response.data[0])){
            complete = true;
        }
    }
    callback(null,Object.values(response.data[0])[0])
}

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
    tag = req.query.tagname;
    var tagq = eval(tag+"q");
    tagq.push({name:req.query.name}, function(err,agent){
        res.send(agent);
    })
})

//initialise queue with tags
for(var i =0; i<tasksList.length;i++){
    q.push({name:tasksList[i]},function(err){
    })
}


module.exports=router
