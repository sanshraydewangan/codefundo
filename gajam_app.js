var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('sync-request');

app.use(express.static('static'));
app.use(bodyParser.urlencoded({ extended: false }));

var trainRouteTemplate='https://api.railwayapi.com/v2/route/train/<train number>/apikey/<apikey>/'
var seatAvailabilityTemplate='https://api.railwayapi.com/v2/check-seat/train/<train number>/source/<stn code>/dest/<dest code>/date/<dd-mm-yyyy>/pref/<class code>/quota/<quota code>/apikey/<apikey>/'
var betweenStationsTemplate='https://api.railwayapi.com/v2/between/source/<stn code>/dest/<stn code>/date/<dd-mm-yyyy>/apikey/<apikey>/'
var fairEnquiryTemplate='https://api.railwayapi.com/v2/fare/train/<train number>/source/<stn code>/dest/<stn code>/age/<age>/pref/<class code>/quota/<quota code>/date/<dd-mm-yyyy>/apikey/<apikey>/'

var apikey = 'lpk3cytwri';

var fs = require("fs");

var betweenstations=require('./betweenstations.json');
function get_between_stations(format_url){
	if(betweenstations[format_url]==undefined){
		var res=request('GET',format_url);
		var jsonpkt=JSON.parse(res.getBody('utf8'));
		console.log(res);
		betweenstations[format_url]=jsonpkt;
		fs.writeFile('./betweenstations.json',JSON.stringify(betweenstations),'utf-8',()=>{console.log('stored: '+format_url)});
		return jsonpkt;
	}
	else return betweenstations[format_url];
}
function main_algo(src,dst,day,month,year,trainClass){
	format_url=betweenStationsTemplate.replace('<stn code>',src).replace('<stn code>',dst).replace('<dd-mm-yyyy>',day+'-'+month+'-'+year).replace('<apikey>',apikey);
	console.log(format_url);
	
	// var res=request('GET',format_url);
	// var jsonpkt=JSON.parse(res.getBody('utf8'));
	jsonpkt=get_between_stations(format_url);
	console.log(jsonpkt);
}
app.get('/', function(req, res) {
	res.render('index.ejs');
});

app.get('/station_list.js', function(req, res) {
	res.render('station_list.js');
});

app.get('/test',function(req,res){
	main_algo('KZJ','MUGR','07','01','2018','SL');
	res.write('data received!!');
	res.end();
});
app.get('/trainenquiry',function(req,res){
	var suggestions='date received!!';
	// suggestions=main_algo(req.query['src'],
	// 	req.query['dst'],
	// 	req.query['date'].substr(8,2),
	// 	req.query['date'].substr(5,2),
	// 	req.query['date'].substr(0,4),
	// 	req.query['class']
	// );
	res.write(suggestions);
	res.end();
});

app.listen(8000, function() {
	console.log('listening on port 8000');
});