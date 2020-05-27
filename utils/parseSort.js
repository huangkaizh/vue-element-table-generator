module.exports = function parseSort(sort, defaultColumnName, defaultSortType) {
  let columnName = defaultColumnName || "id";
  let sortType = defaultSortType || "asc";
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
