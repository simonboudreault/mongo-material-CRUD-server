const MongoClient = require("mongodb").MongoClient;
let badUri = "";
let uri =
  "mongodb+srv://material_crud_user:f7Vr3VPLKEmmFY9g@rapport01-brub3.mongodb.net/test?retryWrites=true";
let client = new MongoClient(uri, { useNewUrlParser: true });

let workingDB = true;

const databaseName = "sample_crud_material";

async function openConnection(resolve, reject) {
  try {
    const connection = await client.connect();
    const db = await connection.db(databaseName);
    resolve(db);
  } catch (err) {
    console.error(err);
    reject();
  }
}

module.exports = new Promise((resolve, reject) => {
  openConnection(resolve, reject);
});
