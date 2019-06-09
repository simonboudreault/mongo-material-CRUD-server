const databaseController = require("./controllers/databaseController");
const AuthenticationController = require("./controllers/AuthenticationController");
const AuthenticationControllerPolicy = require("./policies/AuthenticationControllerPolicy");

module.exports = api => {
  api.get("/connexion", databaseController.toggleConnexion);

  api.get("/", databaseController.fetchDocuments);

  api.put("/", databaseController.modifyDocument);

  api.post("/", databaseController.createDocument);

  api.post(
    "/register",
    AuthenticationControllerPolicy.register,
    AuthenticationController.register
  );

  api.post("/login", AuthenticationController.findUser);

  api.delete("/", databaseController.deleteDocument);
};
