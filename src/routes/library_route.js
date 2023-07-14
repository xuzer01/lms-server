const { Router } = require("express");
const Library = require("../database/models/library_model");
const User = require("../database/models/user_model");
const Book = require("../database/models/book_model");
const {
  generateSuccessResponse,
  generateErrorResponse,
} = require("../default/response");
const { body, validationResult, param } = require("express-validator");
const {
  verifyAdmin,
  verifyStaff,
} = require("../middleware/authentication_middleware");

const library_router = Router();

library_router.get("/", async (req, res) => {
  const data = await Library.findAll();
  res.send(generateSuccessResponse(200, "", data));
});

library_router.get("/:id", async (req, res) => {
  const data = await Library.findByPk(req.params.id);
  res.send(generateSuccessResponse(200, "", data));
});

library_router.get(
  "/:id/books",
  [verifyStaff, param("id").notEmpty().withMessage("ID tidak boleh kosong")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.send(generateErrorResponse(500, errors.array()));
    }

    const user = await User.findByPk(req.user.id);
    const library = await Library.findByPk(user.libraryId, { include: Book });
    if (library === null) {
      return res.send(generateSuccessResponse(200, "", []));
    } else {
      return res.send(generateSuccessResponse(202, "", library.books));
    }
  }
);

library_router.post(
  "/add",
  [
    verifyAdmin,
    body("name").notEmpty().withMessage("Name tidak boleh kosong"),
    body("location").notEmpty().withMessage("Lokasi tidak boleh kosong"),
    body("status")
      .notEmpty()
      .withMessage("Status tidak boleh kosong")
      .isBoolean()
      .withMessage("Status harus tipe data boolean"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send(generateErrorResponse(400, errors));
    }

    const { name, location, status } = req.body;

    try {
      const data = await Library.create({
        name,
        location,
        isActive: status,
      });
      return res
        .status(201)
        .send(
          generateSuccessResponse(201, "Perpustakaan berhasil dibuat", data)
        );
    } catch (error) {
      return res.status(400).send(generateErrorResponse(400, error));
    }
  }
);

library_router.delete(
  "/:id",
  [verifyAdmin, param("id").notEmpty().withMessage("ID tidak boleh kosong")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send(generateErrorResponse(400, errors));
    }
    const data = await Library.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.send(generateSuccessResponse(202, "Data berhasil dihapus", data));
  }
);

module.exports = library_router;
