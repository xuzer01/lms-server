const { Router } = require("express");
const user = require("../database/models/user_model");
const DefaultResponse = require("../default/response");

const user_router = Router();

user_router.get("/", async (req, res) => {
  const users = await user.findAll();
  res.send(DefaultResponse.generateSuccessResponse(200, users));
});

module.exports = user_router;
