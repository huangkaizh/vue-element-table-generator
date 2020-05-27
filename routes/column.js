//router/index.js
var express = require("express");
var router = express.Router();
var column = require("../modules/column/handle");
/* GET user listing. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "SQL for MySQL" });
});
router.get("/query", function(req, res, next) {
  column.query(req, res, next);
});

// router.get("/query", function(req, res, next) {
//   column.queryByName(req, res, next);
// });
module.exports = router;
