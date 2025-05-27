const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "erick",
  database: "nodedb",
});

module.exports = pool.promise();
