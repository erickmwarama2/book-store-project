const Sequelize = require("sequelize");

const sequelize = new Sequelize("nodedb", "root", "erick", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
