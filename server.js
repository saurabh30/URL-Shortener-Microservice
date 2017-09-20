// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var express = require("express");
var logger = require("morgan");
var http = require("http");
var app = express();

app.use(logger());
// Fun fact: logger() returns a function.


// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
