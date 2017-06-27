var express = require('express');
var router = express.Router();
var User = require('../db/models/user.js');

var templateProps = { title: 'School of Knife Throwing' };

router.post('/create', function(req, res) {
  User.findOne({ email: req.body.email }, function(err, user) {
    if (user) {
      templateProps.errors = [{ message: 'A user with that email already exists' }];
      templateProps.email = req.body.email;
      res.render('signup', templateProps);
    }
    else {
      var user = new User(req.body);
      user.save(function(err, user) {
        if (err) {
          templateProps.errors = err.errors;
          templateProps.email = req.body.email;
          res.render('signup', templateProps);
        }
        else {
          req.session.userid = user._id;
          req.session.email = user.email;
          res.redirect('/');
        }
      });
    }
  });
});

router.post('/login', function(req, res) {
  templateProps.email = req.body.email;
  User.findOne({ email: req.body.email }, function(err, user) {
    if (err) {
      templateProps.errors = err.errors;
      res.render('login', templateProps);
    }
    else if (!user) {
      templateProps.errors = [{ message: 'No user with that email' }];
      res.render('login', templateProps);
    }
    else if (!user.authenticate(req.body.password)) {
      templateProps.errors = [{ message: 'Incorrect password' }];
      res.render('login', templateProps);
    }
    else {
      req.session.userid = user._id;
      req.session.email = user.email;
      res.redirect('/');
    }
  });
});

  module.exports = router;