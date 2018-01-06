const https = require('https');
//variables...
var api_key='XXXXXXXXXX'
// templates..
var live_train_api_template='https://api.railwayapi.com/v2/live/train/<train number>/date/<dd-mm-yyyy>/apikey/<apikey>/';


//apis
var live_train_api=live_train_api_template.replace('<train number>','57625').replace('<dd-mm-yyyy>','06-01-2018').replace('<apikey>',api_key);

https.get(live_train_api, (resp) => {
  let data = '';

  // A chunk of data has been recieved.
  resp.on('data', (chunk) => {
    data += chunk;
  });

  // The whole response has been received. Print out the result.
  resp.on('end', () => {
    console.log(JSON.parse(data).route);
  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
});