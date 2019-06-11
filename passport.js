const passport = require("passport");
const config = require("./config/config");
const ObjectId = require("mongodb").ObjectId;

let database;
require("./controllers/dbConnector")
  .then(db => {
    database = db;
  })
  .catch(err => {
    if (err) {
      console.log(err);
    }
  });

const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.authentication.jwtSecret
    },
    async function(jwtPayload, done) {
      console.log("jwtPayload");
      console.log(jwtPayload);
      try {
        const user = await database.collection("_users").findOne({
          _id: new ObjectId(jwtPayload._id)
        });
        console.log("user");
        console.log(user);
        if (!user) {
          console.log("no user" + user);
          return done(new Error(), false);
        }
        return done(null, user);
      } catch (err) {
        console.log("err" + err);
        return done(new Error(), false);
      }
    }
  )
);
