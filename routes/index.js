var express = require('express');
const mqtt = require('../mqtt');
var router = express.Router();
var fs = require("fs");
mqtt()

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/data', (req, res) => {
  let content = fs.readFileSync("currentData.json");
  content = JSON.parse(content)
  res.send({content})
})

module.exports = router;
