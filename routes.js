const databaseController = require("./controllers/databaseController");
const AuthenticationController = require("./controllers/AuthenticationController");

module.exports = api => {
  api.get("/connexion", databaseController.toggleConnexion);

  api.get("/", databaseController.fetchDocuments);

  api.put("/", databaseController.modifyDocument);

  api.post("/", databaseController.createDocument);

  api.post("/register", databaseController.register);

  api.post("/login", databaseController.findUser);

  api.delete("/", databaseController.deleteDocument);
};
