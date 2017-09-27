 /******************************************************
 * PLEASE DO NOT EDIT THIS FILE
 * the verification process may break
 * ***************************************************/

'use strict';

var fs = require('fs');
var express = require('express');
var app = express();
var dbconn;
//databse starts
var url = process.env.MONGOLAB_URI;
var mongodb = require('mongodb');

function connect(){
  var MongoClient = mongodb.MongoClient;
   MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    console.log('Connection established to', url);
    
    // do some work here with the database.
  
  
    //Close connection
    dbconn=db;
  }
});
  
}

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
function hash(s){
  var sum=0;
  for(var i=0;i<s.length;i++){
    sum+=s.charCodeAt(i);
  }
  return sum;
}
app.get('/:id',function(req,res){
    
  res.send({err:'url not found'});
});
app.get('/new/http://www.:id.com',function(req,res){
  var db=connect();
  var site='http://www.'+req.params.id+'.com';
  var collection=dbconn.collection('urls');
  collection.find({$match:{url:site}}).toArray(function(err,docs){
    res.end(JSON.stringify(docs));
    
  })
  var obj={url:site,
  shorturl:site+'/'+hash(site)};
  collection.insert(obj);
  res.end(JSON.stringify(obj));
  dbconn.close();
});
app.get('/new/https://www.:id.com',function(req,res){
  var site=req.params.id;
  res.end('https://'+site);
});  

//my code ends
// Respond not found to all the wrong routes
app.use(function(req, res, next){
  res.status(404);

  res.type('txt').send({err:'Invalid URL format'});
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

