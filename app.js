var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var setRoutes = require("./setRoutes");

// const fs = require("fs");

// var indexRouter = require("./routes/index");
// var userRouter = require("./routes/user");
// var tableRouter = require("./routes/table");
// var columnRouter = require("./routes/column");
// var generateRouter = require("./routes/generate");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

setRoutes(app);

// app.use("/", indexRouter);
// app.use("/user", userRouter);
// app.use("/table", tableRouter);
// app.use("/column", columnRouter);
// app.use("/generate", generateRouter);

// app.use("/", require("./routes/index"));

//   var indexRouter = require("./routes/index");
//   var userRouter = require("./routes/user");
//   var tableRouter = require("./routes/table");
//   var columnRouter = require("./routes/column");
//   var generateRouter = require("./routes/generate");

//   app.use("/", indexRouter);
//   app.use("/user", userRouter);
//   app.use("/table", tableRouter);
//   app.use("/column", columnRouter);
//   app.use("/generate", generateRouter);

// fs.readdirSync("./modules", (err, fileNames) => {
//   for (let fileName of fileNames) {
//     console.log("fileName", fileName);
//     const path = `/${fileName}`;
//     console.log("path", path);
//     const router = require(`./routes/${fileName}`);
//     console.log("router", router);
//     app.use(path, router);
//   }
// });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
