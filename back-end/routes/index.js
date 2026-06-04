var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
  return res.render('index', { title: 'E-commerce Full Stack Application' });
});

module.exports = router;
