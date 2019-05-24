const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
let badUri = "";
let uri =
  "mongodb+srv://material_crud_user:f7Vr3VPLKEmmFY9g@rapport01-brub3.mongodb.net/test?retryWrites=true";
let client = new MongoClient(uri, { useNewUrlParser: true });

let workingDB = true;

const databaseName = "sample_crud_material";
const collectionName = "collection_0";

let coll;

(async function openConnection() {
  try {
    const connection = await client.connect();
    coll = await connection.db(databaseName).collection(collectionName);
  } catch (err) {
    console.error(err);
  }
})();

async function resetConnection() {
  client.close();
  try {
    const connection = await client.connect();
    coll = await connection.db(databaseName).collection(collectionName);
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  ///////////////////////////////
  //                           //
  //     Toggle Connexion      //
  //                           //
  ///////////////////////////////

  async toggleConnexion(req, res) {
    if (client.s.url) {
      await client.close();
    }
    if (!workingDB) {
      client = await new MongoClient(uri, { useNewUrlParser: true });
      resetConnection();
      res.send({
        DB: true,
        msg: "connection turned on"
      });
    } else {
      client = await new MongoClient(badUri, { useNewUrlParser: true });
      resetConnection();
      res.send({
        DB: false,
        msg: "connection turned off"
      });
    }
    workingDB = !workingDB;
  },

  ///////////////////////////////
  //                           //
  //     Send an array with    //
  //       every document      //
  //     in the collection     //
  //                           //
  ///////////////////////////////

  async fetchDocuments(req, res) {
    try {
      const data = await coll.find().toArray();
      res.send(data);
    } catch (err) {
      res.status(500).send({
        error: "Unable to get the Documents"
      });
    }
  },

  async modifyDocument(req, res) {
    let selector = {
      _id: new ObjectId(req.body._id)
    };
    let modif = {
      [req.body.modifyer]: req.body.payload
    };
    try {
      const data = await coll.updateOne(selector, modif);
      res.send(data);
    } catch (err) {
      res.status(500).send({
        error: "Unable to modify the Document"
      });
    }
  },

  async createDocument(req, res) {
    try {
      const data = await coll.insertOne(req.body.payload);
      res.send(data);
    } catch (err) {
      res.status(500).send({
        error: "Unable to create the Document"
      });
    }
  },

  async deleteDocument(req, res) {
    let selector = { _id: new ObjectId(req.body._id) };
    try {
      const data = await coll.deleteOne(selector);
      res.send(data);
    } catch (err) {
      res.status(500).send({
        error: "Unable to delete the Document"
      });
    }
  }

  ///////////////////////////////
  //                           //
  //     MongoDB Reference     //
  //                           //
  ///////////////////////////////

  // client.connect(err => {
  //   const collection = client
  //     .db("<database_name>")
  //     .collection("<collection_name>")
  //   // perform actions on the collection object

  //   client.close()
  // })
};
