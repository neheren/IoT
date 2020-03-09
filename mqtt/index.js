const { data, application } = require('ttn')
var fs = require("fs");
const moment = require('moment');
const server = require('http').createServer();
const io = require('socket.io')(server);

const appID = "laundrytracker"
const accessKey = "ttn-account-v2.tlwd-1CEZQnyg2J2XTbjaT4y5r3mLDwJir3HiaBB5Wo"


io.on('connection', client => {
  client.on('event', data => { /* … */ });
  client.on('disconnect', () => { /* … */ });
});

server.listen(4000);


// for testing
setInterval(() => {
  io.sockets.emit('update', 'everyone');
}, 2400)
  
function collectDataPoint() {

  try{
    let content = fs.readFileSync("currentData.json")
    content = JSON.parse(content)
    const currentDataPiece = (content.payload_fields.short)
    
    const dataPoints = JSON.parse(fs.readFileSync("dataPoints.json"))
    dataPoints.amplitude.push(currentDataPiece)
    dataPoints.dates.push(moment().format('HH.mm:ss'))
    console.log('sampling time point: ' + moment().format('HH.mm:ss') + ', with amplitude: ' + currentDataPiece)
    if(dataPoints.amplitude.length > 3600){
      console.log('REMOVING DATA')
      dataPoints.amplitude = dataPoints.amplitude.slice(1 - dataPoints.amplitude.length)
      dataPoints.dates = dataPoints.dates.slice(1 - dataPoints.dates.length)
    }

    fs.writeFile('dataPoints.json', JSON.stringify(dataPoints), (err) => console.warn({err}))
    io.sockets.emit('update', 'everyone');

  }catch(e){
    console.warn('Data collection error'+ e)
  }
}

module.exports = async () => {
  try{
    const client = await data(appID, accessKey)
    client.on("uplink", function (devID, payload) {
      console.log("Received uplink from ", devID)
      console.log({payload_fields: payload.payload_fields})
      collectDataPoint()
      fs.writeFile('currentData.json', JSON.stringify(payload), (err) => console.warn({err}))
    })
    client.on('activation', (devID, payload) => {
      console.log("Received activation from ", devID)
      console.log({payload})
    })
  } catch (err) {
    console.error(err)
    process.exit(1)
  }

  // discover handler and open application manager client
  application(appID, accessKey)
    .then(function (client) {
      return client.get()
    })
    .then(function (app) { 
      console.log("Got app", app)
    })
    .catch(function (err) {
      console.error(err)
      process.exit(1)
    })
}
