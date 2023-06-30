const { Router } = require("express");
const auth_router = require("./auth_route");
const user_router = require("./user_route");

const router = Router();

router.use("/auth", auth_router);
router.use("/user", user_router);

module.exports = router;
