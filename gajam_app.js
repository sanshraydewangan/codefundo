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

app.get('/', function(req, res) {
	res.render('index.ejs');
});

app.get('/station_list.js', function(req, res) {
	res.render('station_list.js');
});

app.get('/trainenquiry',function(req,res){
    main_algo(req.query);
	res.write("data received!!");
	res.end();
});

app.listen(8000, function() {
	console.log('listening on port 8000');
});