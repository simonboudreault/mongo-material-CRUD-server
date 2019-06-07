const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const test = "testing";

const api = express();

const PORT = process.env.PORT || 5000;

api.use(cors());
api.use(bodyParser.json({ limit: "1mb" }));

require("./routes")(api);

api.listen(PORT, () => console.log(`listening on port ${PORT}`));
