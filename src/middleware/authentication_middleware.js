const jwt = require("jsonwebtoken");
const Role = require("../database/models/role_model");
require("dotenv").config();

const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.send(403);
  }
};

const verifyAdmin = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    jwt.verify(bearerToken, process.env.JWT_SECRET_KEY, async (err, data) => {
      if (err) {
        return res.status(403).send("Dari jwt");
      }
      const role = await Role.findOne({ where: { id: data.roleId } });
      if (role === null || role.name !== "Admin") {
        console.log("Dari validasi");

        return res.status(403).send("Dari validasi");
      }
      if (err === null && role !== null && role.name === "Admin") {
        req.user = data;
        next();
      }
    });
  } else {
    return res.send(403);
  }
};

const verifyStaff = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    jwt.verify(bearerToken, process.env.JWT_SECRET_KEY, async (err, data) => {
      if (err) {
        console.log("Dari jwt");

        return res.status(403).send("Dari jwt");
      }
      const role = await Role.findOne({ where: { id: data.roleId } });
      if (role === null || role.name !== "Staff") {
        console.log("Dari validasi");

        return res.status(403).send("Dari validasi");
      }
      if (err === null && role !== null && role.name === "Staff") {
        req.user = data;
        next();
      }
    });
  } else {
    return res.send(403);
  }
};

const verifyUser = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    jwt.verify(bearerToken, process.env.JWT_SECRET_KEY, async (err, data) => {
      if (err) {
        console.log("Dari jwt");

        return res.status(403).send("Dari jwt");
      }
      const role = await Role.findOne({ where: { id: data.roleId } });
      if (role === null || role.name !== "User") {
        console.log("Dari validasi");

        return res.status(403).send("Dari validasi");
      }
      if (err === null && role !== null && role.name === "User") {
        req.user = data;
        next();
      }
    });
  } else {
    return res.send(403);
  }
};

module.exports = {
  verifyToken,
  verifyAdmin,
  verifyStaff,
  verifyUser,
};
