const ObjectId = require("mongodb").ObjectId;
let database;
require("./dbConnector")
  .then(db => {
    database = db;
  })
  .catch(err => {
    if (err) {
      console.log(err);
    }
  });
module.exports = {
  ///////////////////////////////
  //                           //
  //     Send an array with    //
  //       every document      //
  //     in the collection     //
  //                           //
  ///////////////////////////////

  async fetchDocuments(req, res) {
    let coll = database.collection(req.query.coll);
    try {
      if (req.query.isDbOn === "false") throw "";
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
    let selector = {
      _id: new ObjectId(req.body._id)
    };
    let modif = {
      [req.body.modifyer]: req.body.payload
    };
    try {
      if (!req.body.isDbOn) throw "";
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
      if (!req.body.isDbOn) throw "";
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
      if (!req.body.isDbOn) throw "";
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
