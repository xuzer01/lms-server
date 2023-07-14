const sequelize = require("./config");
const Role = require("./models/role_model");
const user = require("./models/user_model");
const Library = require("./models/library_model");
const Book = require("./models/book_model");
const Library_Books = require("./models/library_book_model");
const Cart = require("./models/cart_model");
const Lending = require("./models/lending_model");
const Lending_Detail = require("./models/lending_detail_model");

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
Library_Books.belongsTo(Book);
Library_Books.belongsTo(Library);

Cart.belongsTo(user);
Cart.belongsTo(Library_Books);
Library_Books.hasMany(Cart);
user.hasMany(Cart);

Lending.belongsTo(user);
user.hasMany(Lending);

Lending_Detail.belongsTo(Lending);
Lending_Detail.belongsTo(Library_Books);
Lending.hasMany(Lending_Detail);
Library_Books.hasMany(Lending_Detail);

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
