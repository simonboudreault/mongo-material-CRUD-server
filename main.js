const MongoClient = require("mongodb").MongoClient
const ObjectId = require("mongodb").ObjectId
const uri =
  "mongodb+srv://material_crud_user:f7Vr3VPLKEmmFY9g@rapport01-brub3.mongodb.net/test?retryWrites=true"
const client = new MongoClient(uri, { useNewUrlParser: true })

const databaseName = "sample_crud_material"
const collectionName = "collection_0"

const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")

const corsOptions = {
  origin: "https://simonboudreault.github.io",
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

const api = express()

let coll

const PORT = process.env.PORT || 5000

api.use(cors(corsOptions))
api.use(bodyParser.json())

api.get("/", async (req, res) => {
  const data = await loadInfo()
  const sent = await res.send(data)
})

api.put("/", async (req, res) => {
  let id = new ObjectId(req.body._id)
  const data = await modifyInfo(id, req.body.payload, req.body.modifyer)
  console.log(data)
  const sent = await res.send(data)
})

api.post("/", async (req, res) => {
  const data = await addInfo(req.body.payload)
  console.log(data)
  const sent = await res.send(data)
})

api.delete("/", async (req, res) => {
  let id = new ObjectId(req.body._id)
  const data = await deleteItem(id)
  console.log(data)
  const sent = await res.send(data)
})

api.listen(PORT, () => console.log(`listening on port ${PORT}`))
// client.connect(err => {
//   const collection = client
//     .db("database_name_jd")
//     .collection("collection_name_jd")
//   // perform actions on the collection object

//   client.close()
// })

async function openConnection() {
  const connection = await client.connect()
  coll = await connection.db(databaseName).collection(collectionName)
  console.log(coll)
}
openConnection()

var infoAJour = ["avant"]

async function loadInfo() {
  const data = await coll.find().toArray()
  return data
}

async function addInfo(object) {
  return coll.insertOne(object)

  // ajout client close
  // client.close()
}

async function modifyInfo(id, object, modifyer) {
  let selector = {
    _id: id
  }
  let modif = {
    [modifyer]: object
  }

  return coll.updateOne(selector, modif)
  // ajout client close
  // await client.close()
}

async function unsetInfo(id, object) {
  let selector = {
    _id: id
  }
  let modif = {
    $unset: object
  }

  return coll.updateOne(selector, modif)
  // ajout client close
  // await client.close()
}

async function deleteItem(id) {
  let selector = { _id: id }
  return coll.deleteOne(selector)
}

function log() {
  console.log(infoAJour)
}
