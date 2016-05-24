var express = require('express');
var router = express.Router();
var partials = { layout: "layout", header: "header", footer: "footer" };

console.log('routes/index.hjs');

router.get('/', function(req, res) {
  res.render('index', { title: 'CambriArms', partials: partials });
});



module.exports = router;
