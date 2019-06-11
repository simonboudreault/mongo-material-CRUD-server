const ObjectId = require("mongodb").ObjectId;
let database;
///////////////////////////////
//                           //
//    import the connection  //
//      and set database     //
//     to the connection     //
//                           //
///////////////////////////////

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
      if (req.query.isDbOn === "false") throw "Unable to get the Documents";
      const documents = await coll.find().toArray();
      const data = {
        db: true,
        documents: documents
      };
      res.send(data);
    } catch (err) {
      res.status(500).send({
        error: err
      });
    }
  },

  ///////////////////////////////////////
  //                                   //
  //           coll.updateOne          //
  //      on the user's collection     //
  //use for unset key and modify value //
  //                                   //
  ///////////////////////////////////////

  async modifyDocument(req, res) {
    let coll = database.collection(req.body.coll);
    let selector = {
      _id: new ObjectId(req.body._id)
    };
    let modif = {
      [req.body.modifyer]: req.body.payload
    };
    try {
      if (!req.body.isDbOn) throw "Unable to modify the Document";
      const data = await coll.updateOne(selector, modif);
      res.send(data);
    } catch (err) {
      res.status(500).send({
        error: err
      });
    }
  },

  ///////////////////////////////
  //                           //
  //         insertOne         //
  //           on the          //
  //     user's collection     //
  //                           //
  ///////////////////////////////

  async createDocument(req, res) {
    let coll = database.collection(req.body.coll);
    try {
      if (!req.body.isDbOn) throw "Unable to create the Document";
      const data = await coll.insertOne(req.body.payload);
      res.send(data);
    } catch (err) {
      res.status(500).send({
        error: err
      });
    }
  },

  ///////////////////////////////
  //                           //
  //         deleteOne         //
  //                           //
  //                           //
  //                           //
  ///////////////////////////////

  async deleteDocument(req, res) {
    let coll = database.collection(req.body.coll);
    let selector = { _id: new ObjectId(req.body._id) };
    try {
      if (!req.body.isDbOn) throw "Unable to delete the Document";
      const data = await coll.deleteOne(selector);
      res.send(data);
    } catch (err) {
      res.status(500).send({
        error: err
      });
    }
  }
};
