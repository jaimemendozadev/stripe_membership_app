var express = require('express');
var router = express.Router();
var Product = require('../db/models/product.js');
var Charge = require('../db/models/charge.js');

var templateProps = { title: 'School of Knife Throwing' };

router.get('/', function(req, res, next) {
  if (req.session && req.session.userid) {
    
    templateProps.email = req.session.email;
    Product.find({}, 'name description amount downloadURL', function(err, products) {


      Charge.find({ user: req.session.userid })
      .exec(function(err, charges) {

        for (productIndex in products) {
          for (chargeIndex in charges) {
            if (JSON.stringify(charges[chargeIndex].product) === JSON.stringify(products[productIndex]._id)) {
              products[productIndex].amount = null;

            }
            else {
              products[productIndex].downloadURL = null;
            }
          }
        }
        templateProps.products = products;
        res.render('account', templateProps);
      });
    });
  }
  else {
    res.render('signup', templateProps);
  }
});

router.get('/login', function(req, res, next) {
  if (req.session && req.session.userid) { 
    return res.redirect('/'); 
  }
  res.render('login', templateProps);
});

router.get('/logout', function(req, res, next) {
  req.session.destroy();
  res.render('login', templateProps);
})

router.post('/purchase', function(req, res, next) {
  Product.findById(req.body._id, function(err, product) {
    if (!err && product) {
      product.purchase(req.body.stripeToken, req.session.userid, function(err, charge){
        if (err) {
            templateProps.message = err.message;
            res.render('account', templateProps);
        }
        else { res.redirect('/');}
      });
    }
  });
});

module.exports = router;