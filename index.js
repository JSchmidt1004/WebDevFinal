const express = require("express");
const pug = require("pug");
const cookieParser = require("cookie-parser");

const app = express();

app.get("/", routes.index);

app.listen(3000);