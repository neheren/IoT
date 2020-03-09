const { data, application } = require('ttn')
var fs = require("fs");

var content = fs.readFileSync("currentData.json");
const appID = "laundrytracker"
const accessKey = "ttn-account-v2.tlwd-1CEZQnyg2J2XTbjaT4y5r3mLDwJir3HiaBB5Wo"
const appEUI = '70B3D57ED002B8EE'

module.exports = async () => {
  try{
    const client = await data(appID, accessKey)
    client.on("uplink", function (devID, payload) {
      console.log("Received uplink from ", devID)
      console.log(payload)
      fs.writeFile('currentData.json', JSON.stringify(payload), console.warn)
    })
    client.on('activation', (devID, payload) => {
      console.log("Received activation from ", devID)
      console.log(payload)
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
