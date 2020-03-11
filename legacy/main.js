var express = require("express");
var expApp = express();
expApp.set('view engine', 'ejs');
expApp.use('/assets', express.static('assets'));
expApp.use('/app', express.static('app'));

expApp.get('/', function(req, res){
	res.render('index');
});


// expApp.get('/user2', function(req, res){
// 	res.render('user2');
// });

expApp.listen(3000);