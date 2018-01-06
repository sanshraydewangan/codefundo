var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var https = require('https');
var request = require('sync-request');

app.set('view engine', 'ejs');
app.use(express.static('static'));
app.use(bodyParser.urlencoded({ extended: false }));

var apikey = 'lpk3cytwri';

function printstations(stations) {
	console.log(stations);
}

function aftergettingroute(src, dest, data, stations) {
	
 	// printstations(stations);
}

function getroute(src, dest, trains, idx, stations) {
	if(idx == trains.length)
	{
		printstations(stations);
		return;
	}
	
	if(trains[idx]['number']!=17405) {
	console.log(trains[idx]['number']);
	var format = 'https://api.railwayapi.com/v2/route/train/<train number>/apikey/<apikey>/';
	var url = format.replace('<train number>', trains[idx]['number']).replace('<apikey>', apikey);

	var data = '';
	https.get(url, (resp) => {
		resp.on('data', (chunk) => {
	    	data += chunk;
		});
		resp.on('end', () => {
			console.log(trains[idx]['number']);
			data = JSON.parse(data);
			temp = data['route'];
			console.log(temp.length);
			var i;
			for(i=0;i<temp.length;i++) {
				if(temp[i]['station']['code'] == src) {
					break;
				};
			}
			for(i=i+1;i<temp.length;i++) {
				console.log(temp[i]['station']['code']);
				if(temp[i]['station']['code'] == dest) {
					break;
				}
				// console.log(temp[i]['station']['code']);
				stations.add(temp[i]['station']['code']);
		 	}
		 	getroute(src, dest, trains, idx+1, stations);
		});
		}).on("error", (err) => {
			console.log("Error: " + err.message);
	});}
	else getroute(src, dest, trains, idx+1, stations);
}

function aftergettingtrains(src, dest, data) {
	var trains = data['trains'];
	var stations = new Set();
	getroute(src, dest, trains, 0, stations);
	// trains.forEach(function(each) {
	// 	getroute(src, dest, each['number'], stations);
	// 	console.log(each['number']);
	// });
}

function gettrains(src, dest, dd, mm, yyyy) {
	var stations = new Set();
	var format = 'https://api.railwayapi.com/v2/between/source/<src code>/dest/<dest code>/date/<dd-mm-yyyy>/apikey/<apikey>/';
	var url = format.replace('<src code>', src).replace('<dest code>', dest).replace('<dd-mm-yyyy>', dd+'-'+mm+'-'+yyyy).replace('<apikey>', apikey);
	
	var data = request('GET', url);
	trains = JSON.parse(data.getBody('utf8'))['trains'];
	
	for(var i=0;i<trains.length;i++) {
		format = 'https://api.railwayapi.com/v2/route/train/<train number>/apikey/<apikey>/';
		url = format.replace('<train number>', trains[i]['number']).replace('<apikey>', apikey);
		data = request('GET', url);
		temp = JSON.parse(data.getBody('utf8'))['route'];
		// var j=0;
		// while(temp[j]['station']['code'] != src) j++;
		// j++;
		// while(temp[j]['station']['code'] != dest) {
		// 	stations.add(temp[j]['station']['code']);
		// 	j++;
		// }
		for(var j=0;j<temp.length;j++) {
			stations.add(temp[j]['station']['code']);
		}	
	}

	console.log(stations);
	// var data = '';
	// https.get(url, (resp) => {
	// 	resp.on('data', (chunk) => {
	//     	data += chunk;
	// 	});
	// 	resp.on('end', () => {
	// 		data = JSON.parse(data);
	// 		aftergettingtrains(src, dest, data);
	// 	});
	// 	}).on("error", (err) => {
	// 		console.log("Error: " + err.message);
	// });
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