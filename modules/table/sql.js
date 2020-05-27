//sql.js
// SQL语句封裝
const mysql = require("../../config/mysql");
var table = {
//   insert: "INSERT INTO user(name, age) VALUES(?,?)",
//   update: "UPDATE user SET name=?, age=? WHERE id=?",
//   delete: "DELETE FROM user WHERE id=?",
//   queryByName: `select table_name,table_comment from information_schema.tables where table_schema = '${mysql.database}' and table_name =?`,
  queryTotal:  `select count(*) as total from information_schema.tables`,
  queryAll: `select table_name,table_comment,table_rows,avg_row_length,data_length,engine,create_time,update_time from information_schema.tables`
};
module.exports = table;
