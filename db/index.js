var app = require('./app.js');
var mongoose = require('mongoose');
var mongoDB = process.env.DATABASE_URL;
mongoose.connect(mongoDB);

var db = mongoose.connection;

var MongoStore = require('connect-mongo')(session);

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUnitialized: false,
  store: new MongoStore({ mongooseConnection: db})
}));

// CONNECTION EVENTS
// When successfully connected
db.on('connected', function () {  
  console.log('Mongoose default connection open');
}); 

// If the connection throws an error
db.on('error',function (err) {  
  console.log('Mongoose default connection error: ' + err);
}); 

// When the connection is disconnected
db.on('disconnected', function () {  
  console.log('Mongoose default connection disconnected'); 
});

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function() {  
  db.close(function () { 
    console.log('Mongoose default connection disconnected through app termination'); 
    process.exit(0); 
  }); 
}); 

module.exports = db;



