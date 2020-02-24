var express = require('express');
const mqtt = require('../mqtt');
var router = express.Router();
var fs = require("fs");
mqtt()
var prettyHtml = require('json-pretty-html').default;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/data/', (req, res) => {
  let content = fs.readFileSync("currentData.json");
  content = JSON.parse(content)
  var html = prettyHtml(content, content.dimensions);
  res.send({html, content})
})



module.exports = router;
