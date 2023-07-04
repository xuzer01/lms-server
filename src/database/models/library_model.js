const { DataTypes } = require("sequelize");
const sequelize = require("../config");

const Library = sequelize.define(
  "library",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    location: DataTypes.TEXT,
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  { timestamps: false }
);

async () => {
  await Library.sync();
};

module.exports = Library;
