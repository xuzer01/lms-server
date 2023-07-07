const { Router } = require("express");
const Role = require("../database/models/role_model");
const {
  generateSuccessResponse,
  generateErrorResponse,
} = require("../default/response");
const { validationResult, body, param } = require("express-validator");
const { verifyAdmin } = require("../middleware/authentication_middleware");
const user = require("../database/models/user_model");
const Library = require("../database/models/library_model");
const { Op } = require("sequelize");

const router = Router();

router.get("/", async (req, res) => {
  const name = req.query.name || "";
  const includeUser = req.query.user || false;
  const notStaff = req.query.nostaff || false;
  let roles;
  if (includeUser) {
    roles = await Role.findAll({
      where: {
        name: {
          [Op.like]: `%${name}%`,
        },
      },
      include: [
        {
          model: user,
          include: [Library],
        },
      ],
    });
  } else {
    roles = await Role.findAll({
      where: {
        name: {
          [Op.like]: `%${name}%`,
        },
      },
    });
  }

  res.send(generateSuccessResponse(200, "", roles));
});

router.get("/:id", async (req, res) => {
  const role = await Role.findByPk(req.params.id, { include: [user] });
  res.send(generateSuccessResponse(200, "", role));
});

router.post(
  "/",
  [
    verifyAdmin,
    body("name").custom(async (value) => {
      const role = await Role.findOne({ where: { name: value } });
      if (role) {
        throw new Error("Nama role sudah digunakan");
      }
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name } = req.body;
    try {
      const role = await Role.create({ name });
      return res.send(
        generateSuccessResponse(201, "Data berhasil dibuat", role)
      );
    } catch (error) {
      return res.send(generateErrorResponse(400, error));
    }
  }
);

router.put(
  "/:id",
  [
    verifyAdmin,
    param("id")
      .notEmpty()
      .withMessage("ID tidak boleh kosong")
      .custom(async (value) => {
        const found = await Role.findOne({ where: { id: value } });
        if (found === null) {
          throw new Error("ID Role tidak ada");
        }
      }),
    body("name").custom(async (value) => {
      const role = await Role.findOne({ where: { name: value } });
      if (role) {
        throw new Error("Nama role sudah digunakan");
      }
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { id } = req.params;
    const { name } = req.body;
    try {
      const data = await Role.update({ name: name }, { where: { id: id } });
      return res.send(
        generateSuccessResponse(200, "Data berhasil diubah", data)
      );
    } catch (error) {
      return res.send(generateErrorResponse(400, error));
    }
  }
);

router.delete(
  "/:id",
  [verifyAdmin, param("id").notEmpty().withMessage("ID tidak boleh kosong")],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;

    const del = await Role.destroy({ where: { id: id } });
    res.send(generateSuccessResponse(200, "Data berhasil dihapus", del));
  }
);

router.post(
  "/assign",
  [
    verifyAdmin,
    body("user_id")
      .notEmpty()
      .withMessage("user_id tidak boleh kosong")
      .custom(async (id) => {
        const found = await user.findByPk(id);
        if (found === null) {
          throw new Error("User tidak ditemukan");
        }
      }),
    body("library_id")
      .notEmpty()
      .withMessage("library_id tidak boleh kosong")
      .custom(async (id) => {
        const found = await Library.findByPk(id);
        if (found === null) {
          throw new Error("Library tidak ditemukan");
        }
      }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send(generateErrorResponse(400, errors));
    }
    const { user_id, library_id } = req.body;
    const role = await Role.findOne({
      where: {
        name: "Staff",
      },
    });

    if (role === null) {
      return res
        .status(404)
        .send(generateErrorResponse(404, { role: "Role tidak ditemukan" }));
    }
    try {
      const cUser = await user.update(
        {
          roleId: role.id,
          libraryId: library_id,
        },
        {
          where: {
            id: user_id,
          },
        }
      );
      return res.send(
        generateSuccessResponse(202, "Data berhasil diubah", cUser)
      );
    } catch (error) {
      return res.send(generateErrorResponse(500, error));
    }
  }
);

module.exports = router;
