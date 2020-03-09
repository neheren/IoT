var express = require('express')
const moment = require('moment');
const mqtt = require('../mqtt')
var router = express.Router()
var fs = require("fs");
var prettyHtml = require('json-pretty-html').default

const callInterval = 1000

mqtt()

function collectDataPoint() {
  try{
    let content = fs.readFileSync("currentData.json")
    content = JSON.parse(content)
    const currentDataPiece = (content.payload_fields.short)
    
    const dataPoints = JSON.parse(fs.readFileSync("dataPoints.json"))
    dataPoints.amplitude.push(currentDataPiece)
    dataPoints.dates.push(moment().format('HH.mm:ss'))
    if(dataPoints.amplitude.length > 3600){
      console.log('REMOVING DATA')
      dataPoints.amplitude = dataPoints.amplitude.slice(1 - dataPoints.amplitude.length)
      dataPoints.dates = dataPoints.dates.slice(1 - dataPoints.dates.length)
    }

    fs.writeFile('dataPoints.json', JSON.stringify(dataPoints), console.warn)
  }catch(e){
    console.warn('Data collection error')
  }
}

const schedule = setInterval(() => {
  console.log('collecting DATAPOINT')
  collectDataPoint()
}, callInterval)






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
