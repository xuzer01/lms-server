const { Router } = require("express");
const { verifyUser } = require("../middleware/authentication_middleware");
const Cart = require("../database/models/cart_model");
const {
  generateSuccessResponse,
  generateErrorResponse,
} = require("../default/response");
const { body, validationResult, param } = require("express-validator");
const Library_Books = require("../database/models/library_book_model");
const user = require("../database/models/user_model");
const Library = require("../database/models/library_model");
const Book = require("../database/models/book_model");

const cart_router = Router();

cart_router.get("/", verifyUser, async (req, res) => {
  const carts = await Cart.findAll({
    where: {
      userId: req.user.id,
    },
    include: [
      user,
      {
        model: Library_Books,
        include: [Library, Book],
      },
    ],
  });
  console.log(req.user.id);
  res.send(200, generateSuccessResponse(200, "", carts));
});

cart_router.post(
  "/",
  [
    verifyUser,
    body("library_book_id")
      .notEmpty()
      .withMessage("library_book_id tidak boleh kosong")
      .custom(async (value) => {
        const libraryBook = await Library_Books.findByPk(value);
        if (libraryBook === null) {
          throw new Error("Buku tidak ditemukan");
        }
      }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    const { library_book_id } = req.body;
    const userId = req.user.id;
    if (!errors.isEmpty()) {
      return res.status(500).send(generateErrorResponse(500, errors.array()));
    }
    const exists = await Cart.findOne({
      where: {
        userId,
        libraryBookId: library_book_id,
      },
    });
    if (exists) {
      return res
        .status(500)
        .send(
          generateErrorResponse(500, [
            { field: "cart", msg: "Item sudah ada di keranjang" },
          ])
        );
    }
    try {
      await Cart.create({
        userId,
        libraryBookId: library_book_id,
      });
      return res
        .status(201)
        .send(generateSuccessResponse(201, "Berhasil menambahan ke keranjang"));
    } catch (error) {
      return res.status(500).send(generateErrorResponse(500, error));
    }
  }
);

cart_router.delete(
  "/:id",
  [verifyUser, param("id").notEmpty().withMessage("ID tidak boleh kosong")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send(generateErrorResponse(400, errors.array()));
    }
    try {
      const data = await Cart.destroy({
        where: {
          id: req.params.id,
        },
      });
      return res
        .status(202)
        .send(generateSuccessResponse(202, "Data berhasil dihapus"));
    } catch (error) {
      return res.status(500).send(generateErrorResponse(500, error));
    }
  }
);
module.exports = cart_router;
