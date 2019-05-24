const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const api = express();

const PORT = process.env.PORT || 5000;

api.use(cors());
api.use(bodyParser.json());

require("./routes")(api);

api.listen(PORT, () => console.log(`listening on port ${PORT}`));
