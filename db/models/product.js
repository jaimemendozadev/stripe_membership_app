var mongoose = require('mongoose');
var validate = require('mongoose-validator');
var Schema = mongoose.Schema;
var stripe = require('stripe')(process.env.STRIPE_KEY);
var Charge = require('./charge.js');


// Product validators
var nameValidator = [
  validate({
    validator: 'isLength',
    arguments: [5, 50],
    message: 'Name must be at least {ARGS[0]} and less than {ARGS[1]} characters'
  })
];
var descriptionValidator = [
  validate({
    validator: 'isLength',
    arguments: [5, 300],
    message: 'Name must be at least {ARGS[0]} and less than {ARGS[1]} characters'
  })
];
var urlValidator = [
  validate({
    validator: 'isURL',
	arguments: [{ protocols: ['https'] }],

  })
];

var productSchema = new Schema({
  name: { type: String, validate: nameValidator },
  description: { type: String, validate: descriptionValidator },
  downloadURL: { type: String, validate: urlValidator },
  amount: { type: Number, min: 50, max: 10000 },
  currency: { type: String, default: 'USD' },
  created_at: Date,
  updated_at: Date
});

/*
See Mongoose Methods & Statics
http://mongoosejs.com/docs/2.7.x/docs/methods-statics.html
*/

productSchema.methods.purchase = function(token, user_id, cb) {


  var self = this;
  
  stripe.charges.create({
    source: token,
    currency: this.currency,
    amount: this.amount,
	description: this.description
  }, function(err, charge) {

    var charge = new Charge({
      stripe_token: token,
      product: self._id,
      user: user_id
    });
    
    charge.save(function(err) {
      cb(err, charge);
    });
  });
};

module.exports = mongoose.model('Product', productSchema);
