const { Router } = require("express");
const User = require("../database/models/user_model");
const DefaultResponse = require("../default/response");
const Role = require("../database/models/role_model");
const { Op } = require("sequelize");

const user_router = Router();

user_router.get("/", async (req, res) => {
  const { is_user } = req.query;

  console.log(req.params);
  let users;
  if (is_user) {
    users = await User.findAll({
      include: [
        {
          model: Role,
          where: {
            name: {
              [Op.like]: `user`,
            },
          },
        },
      ],
    });
  } else {
    users = await User.findAll();
  }

  res.send(DefaultResponse.generateSuccessResponse(200, users));
});

module.exports = user_router;
