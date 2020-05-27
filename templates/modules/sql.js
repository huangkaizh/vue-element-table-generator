//sql.js
// SQL语句封裝
var sqlObj = {
  /* ${`insert:'INSERT INTO ${settings.name}(${settings.columns.map(column => {
        return column.model;
    }).join(',')}) VALUES(${settings.columns.map(() => {return '?'}).join(',')})',`} */
  /* ${`update: "UPDATE ${settings.name} SET ${settings.columns.map(column => {
      return column.model + '=?'
  }).join(',')} WHERE id=?",`} */
  /* ${`delete: "DELETE FROM ${settings.name} WHERE id=?",`} */
  /* ${`queryById: "SELECT * FROM ${settings.name} WHERE id=?",`} */
  /* ${`queryAll: "SELECT * FROM ${settings.name}",`} */
  /* ${`queryTotal: "SELECT count(*) as total FROM ${settings.name}"`} */
};
module.exports = sqlObj;
