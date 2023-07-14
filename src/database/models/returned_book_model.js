const { DataTypes } = require("sequelize");
const sequelize = require("../config");

const Returned_Book = sequelize.define("returned_book", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
});
