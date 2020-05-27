//router/index.js
var express = require("express");
var router = express.Router();
var user = require("../modules/user/handle");
/* GET user listing. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "SQL for MySQL" });
});
router.post("/add", function(req, res, next) {
  user.add(req, res, next);
});
router.get("/queryAll", function(req, res, next) {
  user.queryAll(req, res, next);
});

router.get("/query", function(req, res, next) {
  user.queryById(req, res, next);
});
router.get("/delete", function(req, res, next) {
  user.delete(req, res, next);
});
router.get("/update", function(req, res, next) {
  res.render("update");
});
router.post("/update", function(req, res, next) {
  user.update(req, res, next);
});
module.exports = router;
