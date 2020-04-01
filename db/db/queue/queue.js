var async = require('async');
var express = require('express');

const app = express();
// create a queue object with concurrency tasksList.length
var tasksList = ["accountsAndBills","mobilePostpaid","mobilePrepaid","broadband","singtelTV","homeLine","onlinePurchase","lifestyle"];

var q = async.queue(function(task, callback) {
    // console.log('Performing tags concurrently ');
    // console.log('-------------------------------------------');
}, tasksList.length);

var accountsAndBillsq = async.queue(function(task,callback){
    console.log('Performing task for accountsAndBills: ' + task.name);
    console.log('-------------------------------------------');

    setTimeout(function(){
        callback();
    },5000);
},1);
var mobilePostpaidq = async.queue(function(task,callback){
    console.log('Performing task for mobilePostpaid: ' + task.name);
    console.log('-------------------------------------------');

    setTimeout(function(){
        callback();
    },5000);
},1);
var mobilePrepaidq = async.queue(function(task,callback){
    console.log('Performing task for mobilePrepaid: ' + task.name);
    console.log('-------------------------------------------');

    setTimeout(function(){
        callback();
    },5000);
},1);

var broadbandq = async.queue(function(task,callback){
    console.log('Performing task for broadband: ' + task.name);
    console.log('-------------------------------------------');

    setTimeout(function(){
        callback();
    },5000);
},1);
var singtelTVq = async.queue(function(task,callback){
    console.log('Performing task for singtelTV: ' + task.name);
    console.log('-------------------------------------------');

    setTimeout(function(){
        callback();
    },5000);
},1);
var homeLineq = async.queue(function(task,callback){
    console.log('Performing task for homeLine: ' + task.name);
    console.log('-------------------------------------------');

    setTimeout(function(){
        callback();
    },5000);
},1);
var onlinePurchaseq = async.queue(function(task,callback){
    console.log('Performing task for onlinePurchase: ' + task.name);
    console.log('-------------------------------------------');

    setTimeout(function(){
        callback();
    },5000);
},1);
var lifestyleq = async.queue(function(task,callback){
    console.log('Performing task for lifestyle: ' + task.name);
    console.log('-------------------------------------------');

    setTimeout(function(){
        callback();
    },5000);
},1);


// assign an error callback
q.error(function(err, task) {
    console.error('queue experienced an error: ' +task.name);
});

accountsAndBillsq.error(function(err, task) {
    console.error('accountsAndBillsq experienced an error: ' +task.name);
});
mobilePostpaidq.error(function(err, task) {
    console.error('qumobilePostpaidq experienced an error: ' +task.name);
});
mobilePrepaidq.error(function(err, task) {
    console.error('mobilePrepaidq experienced an error: ' +task.name);
});
broadbandq.error(function(err, task) {
    console.error('broadbandq experienced an error: ' +task.name);
});

singtelTVq.error(function(err, task) {
    console.error('singtelTVq experienced an error: ' +task.name);
});
homeLineq.error(function(err, task) {
    console.error('homelineq experienced an error: ' +task.name);
});
onlinePurchaseq.error(function(err, task) {
    console.error('onlinePurchaseq experienced an error: ' +task.name);
});
lifestyleq.error(function(err,task){
    console.error('lifestyleq experienced an error: ' +task.name);
});
// add some items to the queue
for(var i =0; i<tasksList.length;i++){
    q.push({name:tasksList[i]},function(err){
    })
}

//basically the statement we want to use to add a task to the job.
app.get('/addaccountsAndBills',(req,res)=>{
    accountsAndBillsq.push({name:req.id}, function(err){
        res.send(req.id);
    })
})
app.get('/addmobilePostpaid',(req,res)=>{
    mobilePostpaidq.push({name:req.id}, function(err){
        res.send(req.id);
    })
})
app.get('/addmobilePrepaid',(req,res)=>{
    mobilePrepaidq.push({name:req.id}, function(err){
        res.send(req.id);
    })
})
app.get('/addsingtelTV',(req,res)=>{
    singtelTVq.push({name:req.id}, function(err){
        res.send(req.id);
    })
})
app.get('/addbroadband',(req,res)=>{
    broadbandq.push({name:req.id}, function(err){
        res.send(req.id);
    })
})

app.get('/addhomeLine',(req,res)=>{
    homeLineq.push({name:req.id}, function(err){
        res.send(req.id);
    })
})
app.get('/addonlinePurchase',(req,res)=>{
    onlinePurchaseq.push({name:req.id}, function(err){
        res.send(req.id);
    })
})
app.get('/addlifestyle',(req,res)=>{
    lifestyleq.push({name:req.id}, function(err){
        res.send(req.id);
    })
})


app.listen("3234",()=> console.log("server started on port 3234"));

/* 
NOTES:
so from what I have gathered, node.js responses are sychronous, meaning to say we will not run into race condition when modifying DB.
However we can also implement an asynchronous option for multiple different queues that modify different tables, so that we can speed up efficiency.
i.e. we implement a queue system for each tag.

[user1, user2, user3] --> available_homeline{agent1,agent2}
[user3] --> available_AccountsandBills(agent3)

all of the above should be handled asynchronously.
*/