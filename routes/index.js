var express = require('express');
const mqtt = require('../mqtt');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(mqtt.data())
  res.render('index', { title: 'Express' });
});

module.exports = router;
