var express = require('express');
var router = express.Router();
var partials = { layout: 'layout', header: 'header', footer: 'footer' };

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('get: index');
  res.render('index', { title: 'CambriArms', partials: partials });
});

module.exports = router;
