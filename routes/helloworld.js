var express = require('express');
var router = express.Router();

/* GET HelloWorld page. */
router.get('/', function(req, res, next) {
  res.render('helloworld', { title: 'HelloWorld' });
});

module.exports = router;
