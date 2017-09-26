 /******************************************************
 * PLEASE DO NOT EDIT THIS FILE
 * the verification process may break
 * ***************************************************/

'use strict';

var fs = require('fs');
var express = require('express');
var app = express();
//databse starts
var url = process.env.MONGOLAB_URI;
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
 MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    console.log('Connection established to', url);

    // do some work here with the database.
    
  
    //Close connection
    db.close();
  }
});
//db ends
//We need to work with "MongoClient" interface in order to connect to a mongodb server.

if (!process.env.DISABLE_XORIGIN) {
  app.use(function(req, res, next) {
    var allowedOrigins = ['https://narrow-plane.gomix.me', 'https://www.freecodecamp.com'];
    var origin = req.headers.origin || '*';
    if(!process.env.XORIG_RESTRICT || allowedOrigins.indexOf(origin) > -1){
         console.log(origin);
         res.setHeader('Access-Control-Allow-Origin', origin);
         res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    }
    next();
  });
}

app.use('/public', express.static(process.cwd() + '/public'));

app.route('/_api/package.json')
  .get(function(req, res, next) {
    console.log('requested');
    fs.readFile(__dirname + '/package.json', function(err, data) {
      if(err) return next(err);
      res.type('txt').send(data.toString());
    });
  });
  
app.route('/')
    .get(function(req, res) {
		  res.sendFile(process.cwd() + '/views/index.html');
    })
//my code starts

app.get('/new/http://:id',function(req,res){
  var site=req.params.id;
  if(/^www\.[a-zA-Z0-9]+\.com$/.test(site)){
     res.redirect('http://'+site);
  }
  else res.send({err:'invalid url'});
});
app.get('/new/https://:id',function(req,res){
  var site=req.params.id;
  if(/^www\.[a-zA-Z0-9]+\.com$/.test(site))
  res.redirect('https://'+site);
  else res.send({err:'invalid url'});
});
app.get('/new/:id',function(req,res){
  res.send({err:'invalid protocol'})
})
//my code ends
// Respond not found to all the wrong routes
app.use(function(req, res, next){
  res.status(404);

  res.type('txt').send('Not found');
});

// Error Middleware
app.use(function(err, req, res, next) {
  if(err) {
    res.status(err.status || 500)
      .type('txt')
      .send(err.message || 'SERVER ERROR');
  }  
})

app.listen(process.env.PORT, function () {
  console.log('Node.js listening ...');
});

