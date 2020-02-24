
// discover handler and open mqtt connection
const { data, application } = require('ttn')
// module.exports = {
//   data: () => {
//   },
// }

const appID = "washingmachine_nas"
const accessKey = "ttn-account-v2.c-h2jhoxpesYC_0ETfiniOc52VBPHX4BUEPoCbu8VJ4"
const appEUI = '70B3D57ED002B1EE'

data(appID, accessKey)
  .then(function (client) {
    client.on("uplink", function (devID, payload) {
      console.log("Received uplink from ", devID)
      console.log(payload)
    })
  })
  .catch(function (err) {
    console.error(err)
    process.exit(1)
  })

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
