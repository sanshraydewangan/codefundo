var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var https = require('https');
var request = require('sync-request');

app.set('view engine', 'ejs');
app.use(express.static('static'));
app.use(bodyParser.urlencoded({ extended: false }));

var apikey = 'lpk3cytwri';

function gettrains(src, dest, dd, mm, yyyy) {
	var stations = new Set();
	var format = 'https://api.railwayapi.com/v2/between/source/<src code>/dest/<dest code>/date/<dd-mm-yyyy>/apikey/<apikey>/';
	var url = format.replace('<src code>', src).replace('<dest code>', dest).replace('<dd-mm-yyyy>', dd+'-'+mm+'-'+yyyy).replace('<apikey>', apikey);
	
	var data = request('GET', url);
	trains = JSON.parse(data.getBody('utf8'))['trains'];
	
	for(var i=0;i<trains.length;i++) {
		format = 'https://api.railwayapi.com/v2/route/train/<train number>/apikey/<apikey>/';
		url = format.replace('<train number>', trains[i]['number']).replace('<apikey>', apikey);
		// console.log(url);
		data = request('GET', url);
		temp = JSON.parse(data.getBody('utf8'))['route'];
		// console.log(temp);
		var j=0;
		// console.log(temp.length);
		while(j<temp.length && temp[j]['station']['code'] != src) j++;
		j++;
		while(j<temp.length && temp[j]['station']['code'] != dest) {
			stations.add(temp[j]['station']['code']);
			j++;
		}	
	}

}

app.get('/', function(req, res) {
	gettrains('OGL', 'KZJ', '07', '01', '2018');
	res.render('index.ejs');
});

app.get('/station_list.js', function(req, res) {
	res.render('station_list.js');
});

app.get('/trainenquiry',function(req,res){
	res.write("data received!!");
	res.end();
});

app.listen(8000, function() {
	console.log('listening on port 8000');
});