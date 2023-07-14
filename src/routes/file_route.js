const { Router } = require("express");
const path = require("path");

const file_router = Router();

file_router.get("/", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../../public/images", "book_placeholder.jpeg")
  );
});

module.exports = file_router;
