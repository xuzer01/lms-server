const { DataTypes } = require("sequelize");
const sequelize = require("../config");

const Cart = sequelize.define(
  "cart",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
  },
  { timestamps: false }
);

module.exports = Cart;
