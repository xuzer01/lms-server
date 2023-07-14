const { Router } = require("express");
const Book = require("../database/models/book_model");
const {
  generateSuccessResponse,
  generateErrorResponse,
} = require("../default/response");
const Library_Books = require("../database/models/library_book_model");
const Library = require("../database/models/library_model");
const { body, validationResult, param } = require("express-validator");
const {
  verifyAdmin,
  verifyStaff,
} = require("../middleware/authentication_middleware");
const User = require("../database/models/user_model");
const { Op } = require("sequelize");

const book_router = Router();

book_router.get("/", async (req, res) => {
  const query = req.query.q || "";
  const books = await Book.findAll({
    where: {
      title: {
        [Op.like]: `%${query}%`,
      },
    },
  });
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
    verifyStaff,
    body("title").notEmpty().withMessage("title tidak boleh kosong"),
    body("author").notEmpty().withMessage("author tidak boleh kosong"),
    body("publisher").notEmpty().withMessage("publisher tidak boleh kosong"),
    body("release_date")
      .notEmpty()
      .withMessage("Tanggal Liris tidak boleh kosong"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).send(generateErrorResponse(422, errors.array()));
    }
    const user = await User.findByPk(req.user.id, { include: [Library] });
    const library = await Library.findByPk(user.library.id);
    const book = await Book.create(req.body);
    await book.addLibrary(library);
    return res.send(generateSuccessResponse(201, "", book));
  }
);

book_router.put(
  "/:id",
  [
    verifyStaff,
    param("id").notEmpty().withMessage("ID tidak boleh kosong"),
    body("title").notEmpty().withMessage("title tidak boleh kosong"),
    body("author").notEmpty().withMessage("author tidak boleh kosong"),
    body("publisher").notEmpty().withMessage("publisher tidak boleh kosong"),
    body("release_date").notEmpty().withMessage("date tidak boleh kosong"),
  ],

  async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    const { title, author, publisher, release_date } = req.body;
    if (book == null) {
      return res.send(generateErrorResponse(404, "Buku tidak ditemukan"));
    }
    try {
      const data = await book.update({
        title,
        author,
        publisher,
        release_date,
      });
      return res.send(generateSuccessResponse(200, "Buku telah diubah", data));
    } catch (error) {
      return res.send(generateErrorResponse(500, error));
    }
  }
);

book_router.delete(
  "/:id",
  [verifyStaff, param("id").notEmpty().withMessage("ID tidak boleh kosong")],
  async (req, res) => {
    const userId = req.user.id;
    const user = await User.findByPk(userId);

    try {
      const data = await Library_Books.destroy({
        where: {
          bookId: req.params.id,
          libraryId: user.libraryId,
        },
      });
      return res.send(generateSuccessResponse(202, "Buku telah dihapus", data));
    } catch (error) {
      return res.send(generateErrorResponse(500, error));
    }
  }
);

module.exports = book_router;
