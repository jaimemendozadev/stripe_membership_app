var mongoose = require('mongoose');
var validate = require('mongoose-validator');
var Schema = mongoose.Schema;

var stripeValidator = [
  validate({
    validator: 'isLength',
    arguments: [20, 255],
    message: 'Stripe Token must be at least {ARGS[0]} and less than {ARGS[1]} characters'
  })
];

var chargeSchema = new Schema({
  stripe_token: { type: String, validate: stripeValidator },
  product: { type : Schema.ObjectId, ref : 'Product' },
  user: { type : Schema.ObjectId, ref : 'User' },
  created_at: Date
});

module.exports = mongoose.model('Charge', chargeSchema);
