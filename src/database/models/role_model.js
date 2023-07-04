const { DataTypes } = require("sequelize");
const sequelize = require("../config");

const Role = sequelize.define(
  "role",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { timestamps: false }
);

async () => {
  await Role.sync();
};

module.exports = Role;
