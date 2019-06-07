const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
let badUri = "";
let uri =
  "mongodb+srv://material_crud_user:f7Vr3VPLKEmmFY9g@rapport01-brub3.mongodb.net/test?retryWrites=true";
let client = new MongoClient(uri, { useNewUrlParser: true });

let workingDB = true;

const databaseName = "sample_crud_material";
const collectionName = "collection_0";

const usersCollectionName = "_users";

let coll;
let usersCollection;

(async function openConnection() {
  try {
    const connection = await client.connect();
    usersCollection = await connection
      .db(databaseName)
      .collection(usersCollectionName);
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
  //     Users  Connexion      //
  //                           //
  ///////////////////////////////

  async findUser(req, res) {
    try {
      const user = await usersCollection.findOne({
        email: req.body.email
      });
      res.send(user);
    } catch (err) {
      res.status(500).send({
        error: "Unable to find user"
      });
    }
  },

  async register(req, res) {
    try {
      await usersCollection.insertOne(req.body);
      res.send({
        message: `hello ${req.body.email} your user was registered`
      });
    } catch (err) {
      switch (err.code) {
        case 11000:
          res.status(500).send({
            error: "This email is already in use"
          });
        case 64:
          res.status(500).send({
            error: "Write concern error"
          });
        default:
          res.status(500).send({
            error: "Unable to create the Document"
          });
      }
    }
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
      const documents = await coll.find().toArray();
      const data = {
        db: workingDB,
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
