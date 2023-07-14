const { Sequelize } = require("sequelize");

const database_host = "containers-us-west-152.railway.app";
const database_port = 7707;
const database_name = "railway";
const database_username = "root";
const database_password = "8e8pXJTbwYZseKDFSsH0";

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
