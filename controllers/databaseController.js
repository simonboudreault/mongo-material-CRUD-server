const ObjectId = require("mongodb").ObjectId;
let database;
// eslint-disable-next-line no-console
require("./dbConnector").then(db => {
  database = db;
});
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
      await resetConnection();
      res.send({
        DB: true,
        msg: "connection turned on"
      });
    } else {
      client = await new MongoClient(badUri, { useNewUrlParser: true });
      await resetConnection();
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
    let name = req.query.coll;
    let coll = database.collection(name);
    try {
      const documents = await coll.find().toArray();
      const data = {
        db: true,
        documents: documents
      };
      res.send(data);
    } catch (err) {
      res.status(500).send({
        error: "Unable to get the Documents"
      });
    }
  },

  async modifyDocument(req, res) {
    let coll = database.collection(req.body.coll);
    console.log(req.body);
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
    let coll = database.collection(req.body.coll);
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
    let coll = database.collection(req.body.coll);
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
