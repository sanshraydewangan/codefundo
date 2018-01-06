var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var https = require('https');
var request = require('sync-request');

app.set('view engine', 'ejs');
app.use(express.static('static'));
app.use(bodyParser.urlencoded({ extended: false }));

var apikey = 'lpk3cytwri'; // '366i842wed'
var quotacode = 'GN';

//db things--------------------------
var fs = require('fs');
var db_file = require('./db.json');
function get_db(format_url) {

	if(db_file[format_url]==undefined){
		var res=request('GET',format_url);
		var jsonpkt=JSON.parse(res.getBody('utf8')); 

		// console.log(jsonpkt);
		if(format_url.substr(31, 10) != 'check-seat' && jsonpkt['response_code'] == '200') { 
			db_file[format_url]=jsonpkt;
			fs.writeFileSync('./db.json',JSON.stringify(db_file),'utf-8');
		}
		return jsonpkt;
	}
	else return db_file[format_url];
}
//-----------------------------------

function gettrains(src, dest, category, age, dd, mm, yyyy) {
	var stations = new Set();
	var format = 'https://api.railwayapi.com/v2/between/source/<src code>/dest/<dest code>/date/<dd-mm-yyyy>/apikey/<apikey>/';
	var url = format.replace('<src code>', src).replace('<dest code>', dest).replace('<dd-mm-yyyy>', dd+'-'+mm+'-'+yyyy).replace('<apikey>', apikey);
	var trains = get_db(url)['trains'];
	
	for(var i=0;i<trains.length;i++) {
		format = 'https://api.railwayapi.com/v2/route/train/<train number>/apikey/<apikey>/';
		url = format.replace('<train number>', trains[i]['number']).replace('<apikey>', apikey);
		// console.log(url);
		temp = get_db(url)['route'];
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
	console.log(stations);
	stations.forEach(function(station) {
		// console.log(station);
		format = 'https://api.railwayapi.com/v2/between/source/<src code>/dest/<dest code>/date/<dd-mm-yyyy>/apikey/<apikey>/';
   		url = format.replace('<src code>', src).replace('<dest code>', station).replace('<dd-mm-yyyy>', dd+'-'+mm+'-'+yyyy).replace('<apikey>', apikey);
   		var srcinter = get_db(url)['trains'];
   		
   		format = 'https://api.railwayapi.com/v2/between/source/<src code>/dest/<dest code>/date/<dd-mm-yyyy>/apikey/<apikey>/';
   		url = format.replace('<src code>', station).replace('<dest code>', dest).replace('<dd-mm-yyyy>', dd+'-'+mm+'-'+yyyy).replace('<apikey>', apikey);
   		var	interdest = get_db(url)['trains'];

   		console.log(station);
   		console.log(srcinter.length);
   		console.log(interdest.length);
   		var firsttrains = new Array();
   		var secondtrains = new Array();

   		srcinter.forEach(function(train1) {
   			var srcatime = new Array();
   			var srcdtime = new Array();
   			var destatime = new Array(); 
   			var destdtime = new Array();
   			var fare = new Array();
   			var availability = new Array();
   			format = 'https://api.railwayapi.com/v2/route/train/<train number>/apikey/<apikey>/';
   			url = format.replace('<train number>', train1['number']).replace('<apikey>', apikey);
   			data = get_db(url)['route'];
   			data.forEach(function(each) {
   				if(each['station']['code'] == src) {
   					srcatime.push(each['scharr']);
   					srcdtime.push(each['schdep']);
   				}
   				else if(each['station']['code'] == station) {
   					destatime.push(each['scharr']);
   					destdtime.push(each['schdep']);
   				}
   			});

   			format = 'https://api.railwayapi.com/v2/fare/train/<train number>/source/<src code>/dest/<dest code>/age/<age>/pref/<class code>/quota/<quota code>/date/<dd-mm-yyyy>/apikey/<apikey>/';
   			url = format.replace('<train number>', train1['number']).replace('<src code>', src).replace('<dest code>', station).replace('<age>', age).replace('<class code>', category).replace('<quota code>', quotacode).replace('<dd-mm-yyyy>', dd+'-'+mm+'-'+yyyy).replace('<apikey>', apikey);
   			data = get_db(url)['fare'];
   			fare.push(data);

   			format = 'https://api.railwayapi.com/v2/check-seat/train/<train number>/source/<src code>/dest/<dest code>/date/<dd-mm-yyyy>/pref/<class code>/quota/<quota code>/apikey/<apikey>/';
   			url = format.replace('<train number>', train1['number']).replace('<src code>', src).replace('<dest code>', station).replace('<class code>', category).replace('<quota code>', quotacode).replace('<dd-mm-yyyy>', dd+'-'+mm+'-'+yyyy).replace('<apikey>', apikey);
   			data = get_db(url)['availability'];
   			data.forEach(function(each) {
   				if(each['date'] == dd+'-'+mm+'-'+yyyy); {
   					availability.push(each['status']);
   				}
   			});

   			for(var i=0;i<srcatime.length;i++) {
   				var temp = new Object();
   				temp['srcatime'] = srcatime[i];
   				temp['srcdtime'] = srcdtime[i];
   				temp['destatime'] = destatime[i];
   				temp['destdtime'] = destdtime[i];
   				temp['fare'] = fare[i];
   				temp['availability'] = availability[i];
   				firsttrains.push(temp);
   			}
   		});

   		interdest.forEach(function(train1) {
   			var srcatime = new Array();
   			var srcdtime = new Array();
   			var destatime = new Array(); 
   			var destdtime = new Array();
   			var fare = new Array();
   			var availability = new Array();
   			format = 'https://api.railwayapi.com/v2/route/train/<train number>/apikey/<apikey>/';
   			url = format.replace('<train number>', train1['number']).replace('<apikey>', apikey);
   			data = get_db(url)['route'];
   			
   			data.forEach(function(each) {
   				if(each['station']['code'] == src) {
   					srcatime.push(each['scharr']);
   					srcdtime.push(each['schdep']);
   				}
   				else if(each['station']['code'] == station) {
   					destatime.push(each['scharr']);
   					destdtime.push(each['schdep']);
   				}
   			});

   			format = 'https://api.railwayapi.com/v2/fare/train/<train number>/source/<src code>/dest/<dest code>/age/<age>/pref/<class code>/quota/<quota code>/date/<dd-mm-yyyy>/apikey/<apikey>/';
   			url = format.replace('<train number>', train1['number']).replace('<src code>', src).replace('<dest code>', station).replace('<age>', age).replace('<class code>', category).replace('<quota code>', quotacode).replace('<dd-mm-yyyy>', dd+'-'+mm+'-'+yyyy).replace('<apikey>', apikey);
   			data = get_db(url)['fare'];
   			fare.push(data);

   			format = 'https://api.railwayapi.com/v2/check-seat/train/<train number>/source/<src code>/dest/<dest code>/date/<dd-mm-yyyy>/pref/<class code>/quota/<quota code>/apikey/<apikey>/';
   			url = format.replace('<train number>', train1['number']).replace('<src code>', src).replace('<dest code>', station).replace('<class code>', category).replace('<quota code>', quotacode).replace('<dd-mm-yyyy>', dd+'-'+mm+'-'+yyyy).replace('<apikey>', apikey);
   			data = get_db(url)['availability'];
   			data.forEach(function(each) {
   				if(each['date'] == dd+'-'+mm+'-'+yyyy); {
   					availability.push(each['status']);
   				}
   			});

   			for(var i=0;i<srcatime.length;i++) {
   				var temp = new Object();
   				temp['srcatime'] = srcatime[i];
   				temp['srcdtime'] = srcdtime[i];
   				temp['destatime'] = destatime[i];
   				temp['destdtime'] = destdtime[i];
   				temp['fare'] = fare[i];
   				temp['availability'] = availability[i];
   				secondtrains.push(temp);
   			}
   			console.log(secondtrains);
   		});
   		console.log('firsttrains');
   		console.log('secondtrains');
	});
}

app.get('/', function(req, res) {
	// res.render('index.ejs');
	gettrains('KZJ', 'MUGR', 'SL', '20', '07', '01', '2018');
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