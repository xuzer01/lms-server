const sequelize = require("./config");
const Role = require("./models/role_model");
const user = require("./models/user_model");
const Library = require("./models/library_model");
const Book = require("./models/book_model");
const Library_Books = require("./models/library_book_model");

//Define Relationships
user.belongsTo(Role, {
  foreignKey: {
    allowNull: true,
  },
});
Role.hasMany(user);

user.belongsTo(Library);
Library.hasMany(user);

Library.belongsToMany(Book, { through: Library_Books });
Book.belongsToMany(Library, { through: Library_Books });

async function sync() {
  try {
    await sequelize.sync();
    console.log("Database synchronized");
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  sync,
};
