var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');

app.set('view engine', 'ejs');
app.use(express.static('static'));
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res) {
	res.render('index.ejs');
});

app.listen(8000, function() {
	console.log('listening on port 8000');
});