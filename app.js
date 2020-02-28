var express = require("express");
var app = express();
app.set('view engine', 'ejs');
app.use('/assets', express.static('assets'));

app.get('/', function(req, res){
	res.render('index');
});

app.get('/user2', function(req, res){
	res.render('user2');
});

app.listen(3000);