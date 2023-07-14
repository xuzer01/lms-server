const { Router } = require("express");
const {
  verifyUser,
  verifyAdmin,
  verifyStaff,
} = require("../middleware/authentication_middleware");
const { body, validationResult } = require("express-validator");
const Lending = require("../database/models/lending_model");
const {
  generateErrorResponse,
  generateSuccessResponse,
} = require("../default/response");
const Cart = require("../database/models/cart_model");
const Library_Books = require("../database/models/library_book_model");
const Lending_Detail = require("../database/models/lending_detail_model");
const User = require("../database/models/user_model");
const Library = require("../database/models/library_model");
const Book = require("../database/models/book_model");
const { Op } = require("sequelize");

const lending_route = Router();

lending_route.post(
  "/add",
  [
    verifyUser,
    body("duration").notEmpty().withMessage("duration tidak boleh kosong"),
  ],
  async (req, res) => {
    const { duration, cart_id } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send(generateErrorResponse(400, errors.array()));
    }

    const dueDate = new Date(
      new Date().setDate(new Date().getDate() + parseInt(duration))
    );

    const carts = await Cart.findAll({
      where: {
        userId: req.user.id,
      },
      include: [Library_Books],
    });
    if (carts.length === 0) {
      return res.status(400).send(
        generateErrorResponse(400, [
          {
            field: "Cart",
            msg: "Keranjang Kosong",
          },
        ])
      );
    }
    // return res.send(carts);
    const lending = await Lending.create({
      userId: req.user.id,
      due_date: dueDate,
    });
    try {
      carts.map(async (cart) => {
        await Lending_Detail.create({
          lendingId: lending.id,
          libraryBookId: cart.libraryBookId,
        });
      });
      await Cart.destroy({
        where: {
          userId: req.user.id,
        },
      });

      return res.send(
        201,
        generateSuccessResponse(201, "Pinjaman terlah berhasil dibuat")
      );
    } catch (error) {
      return res.status(500).send(generateErrorResponse(500, error));
    }
  }
);

lending_route.get("/library", [verifyStaff], async (req, res) => {
  const { active, returned } = req.query;
  console.log(active);
  const user = await User.findByPk(req.user.id);
  let data;
  if (active) {
    data = await Lending_Detail.findAll({
      include: [
        {
          model: Lending,
          include: User,
        },
        {
          model: Library_Books,
          where: {
            libraryId: user.libraryId,
          },
          include: Book,
        },
      ],
      where: {
        status: "active",
      },
    });
  } else if (returned) {
    data = await Lending_Detail.findAll({
      include: [
        {
          model: Lending,
          include: User,
        },
        {
          model: Library_Books,
          where: {
            libraryId: user.libraryId,
          },
          include: Book,
        },
      ],
      where: {
        status: "returned",
      },
    });
  } else {
    data = await Lending_Detail.findAll({
      include: [
        {
          model: Lending,
          include: User,
        },
        {
          model: Library_Books,
          where: {
            libraryId: user.libraryId,
          },
          include: Book,
        },
      ],
    });
  }
  res.send(generateSuccessResponse(200, "", data));
});
lending_route.post(
  "/return",
  [
    verifyStaff,
    body("lending_detail_id")
      .notEmpty()
      .withMessage("lending_detail_id tidak boleh kosong")
      .custom(async (value) => {
        const found = await Lending_Detail.findByPk(value);
        if (Object.keys(found).length === 0) {
          throw new Error("lending_detail_id tidak ditemukan");
        }
      }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send(generateErrorResponse(400, errors.array()));
    }

    const { lending_detail_id } = req.body;

    const detail = await Lending_Detail.findByPk(lending_detail_id);
    try {
      await detail.update({ status: "returned", returned_date: new Date() });
      return res.send(
        202,
        generateSuccessResponse(202, "Buku telah dikembalikan")
      );
    } catch (error) {
      return res.status(500).send(generateErrorResponse(500, error));
    }
  }
);
module.exports = lending_route;
