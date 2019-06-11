const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const test = "testing";
const config = require("./config/config");

const api = express();

api.use(cors());
api.use(bodyParser.json({ limit: "1mb" }));

require("./passport");

require("./routes")(api);

api.listen(config.port, () => console.log(`listening on port ${config.port}`));
