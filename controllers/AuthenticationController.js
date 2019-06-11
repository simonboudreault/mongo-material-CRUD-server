let database;
require("./dbConnector").then(db => {
  database = db;
});

const jwt = require("jsonwebtoken");
const config = require("../config/config");

const Promise = require("bluebird");
const bcrypt = Promise.promisifyAll(require("bcrypt-nodejs"));

async function hashPassword(user) {
  const SALT_FACTOR = 8;

  let salt = await bcrypt.genSaltAsync(SALT_FACTOR);

  let hash = await bcrypt.hashAsync(user.password, salt, null);

  user.password = hash;
}

async function comparePassword(password, userPassword) {
  return await bcrypt.compareAsync(password, userPassword);
}

function jwtSignUser(user) {
  const ONE_WEEK = 60 * 60 * 24 * 7;
  return jwt.sign(user, config.authentication.jwtSecret, {
    expiresIn: ONE_WEEK
  });
}

module.exports = {
  ///////////////////////////////
  //                           //
  //     Users  Connexion      //
  //                           //
  ///////////////////////////////

  async login(req, res) {
    try {
      const { email, password } = req.body;
      let user = req.body;

      const dbUser = await database.collection("_users").findOne({
        email: email
      });
      if (!dbUser) {
        res.status(403).send({
          error: "Incorrect login information"
        });
      }
      const isPasswordValid = await comparePassword(password, dbUser.password);
      if (!isPasswordValid) {
        res.status(403).send({
          error: "Incorrect login pass information"
        });
      } else {
        res.send({
          user: dbUser,
          token: jwtSignUser(dbUser)
        });
      }
    } catch (err) {
      res.status(500).send({
        error: "There was an error trying to log in"
      });
    }
  },

  async register(req, res) {
    try {
      let user = req.body;
      await hashPassword(user);
      await database.collection("_users").insertOne(user);
      res.send({
        user: user,
        token: jwtSignUser(user)
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
