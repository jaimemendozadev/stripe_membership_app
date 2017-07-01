var mongoose = require('mongoose');
var mongoDB = process.env.DATABASE_URL;
console.log("mongoDB is ", mongoDB);
mongoose.connect(mongoDB);

var db = mongoose.connection;

// CONNECTION EVENTS
// When successfully connected
db.on('open', function () {  
  console.log('Mongoose default connection open');
}); 

// Seed the database 
if (process.env.NODE_ENV === 'development') {   
  require('./models/seeds/product.js')(); 
}

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



