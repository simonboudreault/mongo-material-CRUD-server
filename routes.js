const databaseController = require("./controllers/databaseController");
const AuthenticationController = require("./controllers/AuthenticationController");
const AuthenticationControllerPolicy = require("./policies/AuthenticationControllerPolicy");
const isAuthenticated = require("./policies/isAuthenticated");

module.exports = api => {
  api.get("/", isAuthenticated, databaseController.fetchDocuments);

  api.put("/", isAuthenticated, databaseController.modifyDocument);

  api.post("/", isAuthenticated, databaseController.createDocument);

  api.post(
    "/register",
    AuthenticationControllerPolicy.register,
    AuthenticationController.register
  );

  api.post("/login", AuthenticationController.login);

  api.delete("/", isAuthenticated, databaseController.deleteDocument);
};
