const { Sequelize } = require("sequelize");

const database_host = "localhost";
const database_port = 3306;
const database_name = "lms";
const database_username = "root";
const database_password = "";

const sequelize = new Sequelize(
  database_name,
  database_username,
  database_password,
  {
    host: database_host,
    port: database_port,
    dialect: "mysql",
  }
);

module.exports = sequelize;
