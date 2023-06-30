const { Router } = require("express");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const DefaultResponse = require("../default/response");
const user = require("../database/models/user_model");

require("dotenv").config();

const auth_router = Router();

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
    let { username, password } = req.body;
    //Check existing user
    const existingUser = await user.findOne({ where: { username } });

    //Check if password matched
    const match = bcrypt.compareSync(password, existingUser.password);
    console.log(match);
    if (existingUser === null || match === false) {
      res.status(404).send(
        DefaultResponse.generateErrorResponse(404, {
          user: "Tidak ditemukan",
        })
      );
    } else {
      const token = jwt.sign(
        {
          id: existingUser.id,
          username: existingUser.username,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "7d" }
      );

      res.send(
        DefaultResponse.generateSuccessResponse(200, "Berhasil login", {
          token: `Bearer ${token}`,
        })
      );
    }
  }
);

auth_router.post(
  "/register",
  [
    body("name").notEmpty(),
    body("username").notEmpty().isLength({ min: 5 }),
    body("password").notEmpty().isLength({ min: 5 }),
  ],
  async (req, res) => {
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
      res
        .status(500)
        .send(DefaultResponse.generateErrorResponse(500, validation.array()));
    }
    const { name, username, password } = req.body;
    console.log(password);
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = await user.create({
      name,
      username,
      password: hashedPassword,
    });

    res
      .status(201)
      .send(
        DefaultResponse.generateSuccessResponse(
          201,
          "Pendaftaran berhasil",
          user
        )
      );
  }
);

module.exports = auth_router;
