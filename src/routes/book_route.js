const { Router } = require("express");
const Book = require("../database/models/book_model");
const {
  generateSuccessResponse,
  generateErrorResponse,
} = require("../default/response");
const Library_Books = require("../database/models/library_book_model");
const Library = require("../database/models/library_model");
const { body, validationResult } = require("express-validator");
const { verifyAdmin } = require("../middleware/authentication_middleware");

const book_router = Router();

book_router.get("/", async (req, res) => {
  const books = await Book.findAll();
  return res.send(generateSuccessResponse(200, "", books));
});

book_router.get("/:id", async (req, res) => {
  const books = await Book.findByPk(req.params.id, {
    include: [Library],
  });
  return res.send(generateSuccessResponse(200, "", books));
});

book_router.post(
  "/",
  [
    verifyAdmin,
    body("title").notEmpty().withMessage("title tidak boleh kosong"),
    body("author").notEmpty().withMessage("author tidak boleh kosong"),
    body("publisher").notEmpty().withMessage("publisher tidak boleh kosong"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).send(generateErrorResponse(422, errors.array()));
    }
    const book = await Book.create(req.body);
    return res.send(generateSuccessResponse(201, "", book));
  }
);

module.exports = book_router;
