const sequelize = require("./config");
const user = require("./models/user_model");

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
