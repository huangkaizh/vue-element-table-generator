module.exports = function(app) {
  app.use("/", require("./routes/index"));
  app.use("/user", require("./routes/user"));
  app.use("/table", require("./routes/table"));
  app.use("/column", require("./routes/column"));
  app.use("/generate", require("./routes/generate"));
};
