const { Router } = require("express");
const User = require("../database/models/user_model");
const DefaultResponse = require("../default/response");
const Role = require("../database/models/role_model");
const { Op } = require("sequelize");
const Library = require("../database/models/library_model");
const { param, validationResult } = require("express-validator");

const user_router = Router();

user_router.get("/", async (req, res) => {
  const { is_user, is_staff } = req.query;
  const query = req.query.q || "";

  let users;
  if (is_user) {
    users = await User.findAll({
      where: {
        name: {
          [Op.like]: `%${query}%`,
        },
      },
      include: [
        {
          model: Role,
          where: {
            name: {
              [Op.like]: `%user%`,
            },
          },
        },
        Library,
      ],
    });
  } else if (is_staff) {
    users = await User.findAll({
      where: {
        name: {
          [Op.like]: `%${query}%`,
        },
      },
      include: [
        {
          model: Role,
          where: {
            name: {
              [Op.like]: `%staff%`,
            },
          },
        },
        Library,
      ],
    });
  } else {
    users = await User.findAll({
      where: {
        name: {
          [Op.like]: `%${query}%`,
        },
      },
    });
  }

  res.send(DefaultResponse.generateSuccessResponse(200, "", users));
});

user_router.get(
  "/:id",
  [
    param("id").custom(async (value) => {
      const response = await User.findByPk(value);
      if (response === null) {
        throw new Error("ID tidak ditemukan");
      }
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.send(
        DefaultResponse.generateErrorResponse(403, errors.array())
      );
    }
    const user = await User.findByPk(req.params.id, { include: Role });
    return res.send(DefaultResponse.generateSuccessResponse(200, "", user));
  }
);

module.exports = user_router;
