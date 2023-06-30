const { DataTypes } = require("sequelize");
const sequelize = require("../config");

const user = sequelize.define(
  "user",
  {
    name: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
  },
  { timestamps: false }
);

async () => {
  await user.sync();
};

module.exports = user;
