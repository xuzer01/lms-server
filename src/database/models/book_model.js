const { DataTypes } = require("sequelize");
const sequelize = require("../config");

const Book = sequelize.define(
  "book",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    title: DataTypes.STRING,
    author: DataTypes.STRING,
    publisher: DataTypes.STRING,
    synopsis: DataTypes.TEXT,
    release_date: DataTypes.DATEONLY,
    image_url: DataTypes.STRING,
  },
  { timestamps: false }
);

async () => {
  await Book.sync();
};

module.exports = Book;
