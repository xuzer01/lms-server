const { Router } = require("express");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const DefaultResponse = require("../default/response");
const User = require("../database/models/user_model");
const { verifyToken } = require("../middleware/authentication_middleware");
const Role = require("../database/models/role_model");
const Library = require("../database/models/library_model");

require("dotenv").config();

const auth_router = Router();

auth_router.post("/", verifyToken, (req, res) => {
  jwt.verify(req.token, process.env.JWT_SECRET_KEY, async (err, data) => {
    if (err) {
      res.send(403);
    } else {
      const user = await User.findByPk(data.id, {
        include: [Role, Library],
      });
      res.send(DefaultResponse.generateSuccessResponse(200, "", user));
    }
  });
});

auth_router.post(
  "/login",
  [
    body("username").notEmpty().withMessage("username tidak boleh kosong"),
    body("password").notEmpty().withMessage("password tidak boleh kosong"),
  ],
  async (req, res) => {
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
      res
        .status(500)
        .send(DefaultResponse.generateErrorResponse(500, validation.array()));
    }
    const { username, password } = req.body;

    //Check existing user
    const existingUser = await User.findOne({ where: { username } });

    if (existingUser) {
      const match = bcrypt.compareSync(password, existingUser.password);

      if (match == false) {
        res.status(404).send(
          DefaultResponse.generateErrorResponse(404, {
            user: "Username atau password salah",
          })
        );
        return;
      }
    } else {
      res.status(404).send(
        DefaultResponse.generateErrorResponse(404, {
          user: "Username atau password salah",
        })
      );
      return;
    }

    const token = jwt.sign(
      {
        id: existingUser.id,
        username: existingUser.username,
        roleId: existingUser.roleId,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );
    res.send(
      DefaultResponse.generateSuccessResponse(200, "Login berhasil", {
        token: `Bearer ${token}`,
      })
    );
  }
);

auth_router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name tidak boleh kosong"),
    body("username")
      .notEmpty()
      .withMessage("Username tidak boleh kosong")
      .isLength({ min: 5 })
      .withMessage("Username minimal 5 huruf")
      .custom(async (value) => {
        const user = await User.findOne({
          where: {
            username: value,
          },
        });
        if (user) {
          throw new Error("Username sudah digunakan");
        }
      }),
    body("password")
      .notEmpty()
      .withMessage("Password tidak boleh kosong")
      .isLength({ min: 5 })
      .withMessage("Password minimal 5 huruf"),
    body("gender").notEmpty().withMessage("Gender tidak boleh kosong"),
    body("address").notEmpty().withMessage("address tidak boleh kosong"),
    body("phone").notEmpty().withMessage("Phone tidak boleh kosong"),
  ],
  async (req, res) => {
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
      res
        .status(500)
        .send(DefaultResponse.generateErrorResponse(500, validation.array()));
      return;
    }

    const { name, username, password, gender, address, phone } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = await User.create({
      name,
      username,
      password: hashedPassword,
      gender,
      address,
      phone,
    });
    const role = await Role.findOne({
      where: {
        name: "User",
      },
    });
    if (role) {
      await newUser.update({ roleId: role.id });
    }

    res
      .status(201)
      .send(
        DefaultResponse.generateSuccessResponse(
          201,
          "Pendaftaran berhasil",
          User
        )
      );
  }
);

module.exports = auth_router;
