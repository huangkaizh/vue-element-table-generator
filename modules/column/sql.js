//sql.js
// SQL语句封裝
const mysql = require("../../config/mysql");
var user = {
//   insert: "INSERT INTO user(name, age) VALUES(?,?)",
//   update: "UPDATE user SET name=?, age=? WHERE id=?",
//   delete: "DELETE FROM user WHERE id=?",
  query: `select column_name,column_comment,data_type,column_default,character_maximum_length,column_key,is_nullable,extra from information_schema.columns where table_schema = '${mysql.database}' and table_name =?`,
  // queryAll: `select table_name,table_comment from information_schema.tables where table_schema = '${mysql.database}'`
};
module.exports = user;
