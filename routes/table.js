//router/index.js
var express = require("express");
var router = express.Router();
var table = require("../modules/table/handle");
/* GET user listing. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "SQL for MySQL" });
});
router.get("/queryAll", function(req, res, next) {
  table.queryAll(req, res, next);
});

router.get("/query", function(req, res, next) {
  table.queryByName(req, res, next);
});
module.exports = router;
