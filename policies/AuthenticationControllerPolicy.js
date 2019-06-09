const Joi = require("joi");

module.exports = {
  register(req, res, next) {
    const schema = {
      email: Joi.string().email(),
      password: Joi.string().regex(new RegExp("^[a-zA-Z0-9]{6,14}$")),
      collName: Joi.string()
    };

    const { error, value } = Joi.validate(req.body, schema);

    if (error) {
      switch (error.details[0].context.key) {
        case "email":
          res.status(400).send({ error: "Email adress is invalid" });
          break;
        case "password":
          res.status(400).send({
            error:
              "The password must contain only letters and numbers and be 6 to 14 characters in length"
          });
          break;
        default:
          res.status(400).send({ error: "Invalid registration Information" });
          break;
      }
    } else {
      next();
    }
  }
};
