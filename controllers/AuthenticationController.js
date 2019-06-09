let database;
// eslint-disable-next-line no-console
require("./dbConnector").then(db => {
  database = db;
});
module.exports = {
  ///////////////////////////////
  //                           //
  //     Users  Connexion      //
  //                           //
  ///////////////////////////////

  async findUser(req, res) {
    console.log(req.body.email);
    try {
      const user = await database.collection("_users").findOne({
        email: req.body.email
      });
      if (!user) {
        res.status(403).send({
          error: "Unable to find user"
        });
      } else {
        res.send(user);
      }
    } catch (err) {
      res.status(500).send({
        error: "There was an error trying to log in"
      });
    }
  },

  async register(req, res) {
    try {
      await database.collection("_users").insertOne(req.body);
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
            error: "Unable to Register"
          });
      }
    }
  }
};
