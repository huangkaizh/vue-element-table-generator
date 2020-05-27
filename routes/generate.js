//router/index.js
var express = require("express");
var router = express.Router();
var generate = require("../modules/generate/handle");
/* GET user listing. */
router.post("/", function(req, res, next) {
  generate.index(req, res, next);
});
module.exports = router;