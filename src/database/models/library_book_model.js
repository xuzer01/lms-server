const { DataTypes } = require("sequelize");
const sequelize = require("../config");

const Library_Books = sequelize.define(
  "library_books",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  { timestamps: false }
);

module.exports = Library_Books;
