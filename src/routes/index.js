const { Router } = require("express");
const auth_router = require("./auth_route");
const user_router = require("./user_route");
const role_router = require("./role_route");
const library_router = require("./library_role");
const book_router = require("./book_route");

const router = Router();

router.use("/auth", auth_router);
router.use("/user", user_router);
router.use("/role", role_router);
router.use("/library", library_router);
router.use("/book", book_router);

module.exports = router;
