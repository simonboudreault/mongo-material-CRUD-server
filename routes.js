const databaseController = require("./controllers/databaseController");

module.exports = api => {
  api.get("/connexion", databaseController.toggleConnexion);

  api.get("/", databaseController.fetchDocuments);

  api.put("/", databaseController.modifyDocument);

  api.post("/", databaseController.createDocument);

  api.delete("/", databaseController.deleteDocument);
};
