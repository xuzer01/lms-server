const { DataTypes } = require("sequelize");
const sequelize = require("../config");

const user = sequelize.define(
  "user",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    gender: DataTypes.ENUM(["L", "P"]),
    address: DataTypes.TEXT,
    phone: DataTypes.STRING,
  },
  { timestamps: false }
);

async () => {
  await user.sync();
};

module.exports = user;
