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
    isAvailable: DataTypes.BOOLEAN,
  },
  { timestamps: false }
);

module.exports = Library_Books;
