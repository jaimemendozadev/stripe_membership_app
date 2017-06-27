var express = require('express');
var router = express.Router();

var templateProps = { title: 'School of Knife Throwing' };

router.get('/', function(req, res, next) {
  if (req.session && req.session.userid) {
  	templateProps.email = req.session.email;
  	return res.render('account', templateProps);
  }
  res.render('signup', templateProps);
});

router.get('/login', function(req, res, next) {
  if (req.session && req.session.userid) { return res.redirect('/'); }
  res.render('login', templateProps);
});

router.get('/logout', function(req, res, next) {
  req.session.destroy();
  res.render('login', templateProps);
})


module.exports = router;
