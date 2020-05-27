//router/index.js
var express = require("express");
var router = express.Router();
/* ${`var handle = require("../modules/${settings.name}/handle");`} */
/* GET user listing. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "SQL for MySQL" });
});
router.post("/add", function(req, res, next) {
  handle.add(req, res, next);
});
router.get("/queryAll", function(req, res, next) {
  handle.queryAll(req, res, next);
});
router.get("/query", function(req, res, next) {
  handle.queryById(req, res, next);
});
router.get("/delete", function(req, res, next) {
  handle.delete(req, res, next);
});
router.post("/update", function(req, res, next) {
  handle.update(req, res, next);
});
module.exports = router;
