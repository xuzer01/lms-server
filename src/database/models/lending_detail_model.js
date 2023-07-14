const { DataTypes } = require("sequelize");
const sequelize = require("../config");

const Lending_Detail = sequelize.define(
  "Lending_Detail",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    status: {
      type: DataTypes.ENUM("active", "returned"),
      defaultValue: "active",
    },
    returned_date: {
      type: DataTypes.DATE,
    },
  },
  { timestamps: false }
);

module.exports = Lending_Detail;
