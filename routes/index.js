var express = require('express')
const mqtt = require('../mqtt')
var router = express.Router()
var fs = require("fs");
var prettyHtml = require('json-pretty-html').default

const callInterval = 1000

mqtt()





/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { callInterval });
})

router.get('/data', (req, res) => {
  let content = fs.readFileSync("currentData.json")
  content = JSON.parse(content)
  var html = prettyHtml(content, content.dimensions)
  res.send({html, content})
})

router.get('/data-points', (req, res) => {
  let content = fs.readFileSync("dataPoints.json")
  content = JSON.parse(content)
  res.send(content)
})

module.exports = router
