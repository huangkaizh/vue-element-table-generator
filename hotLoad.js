var express = require("express");
var app = express();
var reload = require("express-reload");

var pathMain = __dirname + "/app";
app.use(reload(pathMain));

app.listen(3000, () => console.log("Listening on 3000"));
