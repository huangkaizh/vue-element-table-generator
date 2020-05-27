//handel.js
/*
    数据增删改查模块封装
    req.query 解析GET请求中的参数 包含在路由中每个查询字符串参数属性的对象，如果没有则为{}
    req.params 包含映射到指定的路线“参数”属性的对象,如果有route/user/：name，那么“name”属性可作为req.params.name
    req.body通常用来解析POST请求中的数据
     +req.query.id 可以将id转为整数
 */
// 引入mysql
var mysql = require("mysql");
// 引入mysql连接配置
var mysqlconfig = require("../../config/mysql");
// 引入连接池配置
var poolextend = require("../../utils/poolextend");
// 引入SQL模块
var sql = require("./sql");
// 引入json模块
var json = require("../../utils/json");
// 使用连接池，提升性能
var pool = mysql.createPool(poolextend({}, mysqlconfig));

function parseSort(sort) {
  let columnName = "id";
  let sortType = "asc";
  if (!sort) return { columnName, sortType };
  const sortLength = sort.length;
  if (sortLength > 0) {
    const firstChar = sort[0];
    if (firstChar === "-" && sortLength > 1) {
      sortType = "desc";
      columnName = sort.slice(1);
    } else if (firstChar === "+" && sortLength > 1) {
      sortType = "asc";
      columnName = sort.slice(1);
    } else {
      sortType = "asc";
      columnName = sort;
    }
  }
  return { columnName, sortType };
}

var userData = {
  add: function(req, res, next) {
    var param = req.body;
    if (param.name == null || param.age == null) {
      json(res, undefined);
      return;
    }
    pool.getConnection(function(err, connection) {
      connection.query(sql.insert, [param.name || "", param.age || 0], function(
        err,
        result
      ) {
        if (result) {
          result = "add";
        }
        // 以json形式，把操作结果返回给前台页面
        json(res, result);
        // 释放连接
        connection.release();
      });
    });

    // pool.getConnection(function(err, connection) {
    //   var param = req.query || req.params;
    //   connection.query(sql.insert, [param.id, param.name, param.age], function(
    //     err,
    //     result
    //   ) {
    //     if (result) {
    //       result = "add";
    //     }
    //     // 以json形式，把操作结果返回给前台页面
    //     json(res, result);
    //     // 释放连接
    //     connection.release();
    //   });
    // });
  },
  delete: function(req, res, next) {
    pool.getConnection(function(err, connection) {
      var id = +req.query.id;
      connection.query(sql.delete, id, function(err, result) {
        if (result.affectedRows > 0) {
          result = "delete";
        } else {
          result = undefined;
        }
        json(res, result);
        connection.release();
      });
    });
  },
  update: function(req, res, next) {
    var param = req.body;
    if (param.name == null || param.age == null || param.id == null) {
      json(res, undefined);
      return;
    }
    pool.getConnection(function(err, connection) {
      connection.query(sql.update, [param.name, param.age, +param.id], function(
        err,
        result
      ) {
        if (result.affectedRows > 0) {
          result = "update";
        } else {
          result = undefined;
        }
        json(res, result);
        connection.release();
      });
    });
  },
  queryById: function(req, res, next) {
    var id = +req.query.id;
    pool.getConnection(function(err, connection) {
      connection.query(sql.queryById, id, function(err, result) {
        if (result !== "") {
          var _result = result;
          result = {
            result: "select",
            data: _result
          };
        } else {
          result = undefined;
        }
        json(res, result);
        connection.release();
      });
    });
  },
  queryAll: function(req, res, next) {
    const page = req.query.page ? +req.query.page : 1;
    const size = req.query.size ? +req.query.size : 10;
    const sort = req.query.sort;
    const offset = (page - 1) * size;
    const { columnName, sortType } = parseSort(sort);
    let sqlString = sql.queryAll;
    let sqlTotalString = sql.queryTotal;
    console.log("sqlString: ", sqlString);
    console.log("req.query", req.query);
    let appendString = "";
    let whereString = " where 1=1";
    if (req.query.name) {
      whereString += " and name like '%" + req.query.name + "%'";
    }
    if (![undefined, ""].includes(req.query.age)) {
      whereString += ` and age = ${+req.query.age}`;
    }
    appendString += whereString;
    let orderString = ` order by ${columnName} ` + sortType;
    appendString += orderString;
    let limitString = ` limit ${offset},${size}`;
    appendString += limitString;
    sqlString += appendString;
    sqlTotalString += whereString;

    console.log("sqlString: ", sqlString);
    pool.getConnection(function(err, connection) {
      connection.query(sqlTotalString, function(err_total, result_total) {
        console.log("err_total", err_total);
        console.log("result_total", result_total);
        const total = result_total[0].total;
        connection.query(sqlString, function(err, result) {
          if (result !== "") {
            var _result = result;
            result = {
              result: "selectall",
              data: _result,
              total: total
            };
          } else {
            result = undefined;
          }
          json(res, result);
          connection.release();
        });
      });
    });
  }
};
module.exports = userData;