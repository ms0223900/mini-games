/* eslint-disable linebreak-style */
// eslint-disable-next-line linebreak-style
/* eslint-disable quotes */
/* eslint-disable no-unused-vars */
require('dotenv').config()

var path = require('path')
var fs = require('fs')
var FileStreamRotator = require('file-stream-rotator')
var express = require('express')
var compression = require('compression')
var morgan = require('morgan')


var app = express()
var port = process.env.PORT || 3010

if (process.env.NODE_ENV == 'development' || process.env.NODE_ENV == 'testing'){
  var log_path = path.join(__dirname, '/storage/logs');
  fs.existsSync(log_path) || fs.mkdirSync(log_path)

  var log_stream = FileStreamRotator.getStream({
    date_format: 'YYYYMMDD',
    filename: log_path + '/access-%DATE%.log',
    frequency: 'daily',
    verbose: false
  });
  app.use(morgan('combined',{ stream: log_stream }));
}



app.use(compression())
app.use(express.static(__dirname + '/dist'))



app.listen(port, function(err) {
  if(err) {
    console.error(err)
  } else {
    console.info('==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.', port, port)
  }
})