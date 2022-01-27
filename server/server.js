const express = require('express')
var cors = require('cors')
const app = express()
const port = process.env.PORT || 5000

app.use(cors());

let data = {
  clients: 0,
  clientIDs:[

  ]

}

app.get('/', (req, res) => {
  console.log("Got request:")
  const playerID = addClient()
  console.log(data)
  res.send({
    "playerID": playerID,
    "playerData" : data
   })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

function addClient(){
  const playerID = data.clients
  data.clientIDs.push(playerID)
  data.clients++;
  return playerID;
}
