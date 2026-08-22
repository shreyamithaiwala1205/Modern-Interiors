const express = require("express");

const router = express.Router();

const {
  getAllFurniture,
  getFurnitureById,
} = require("../controllers/furnitureController");

router.get("/", getAllFurniture);

router.get("/:id", getFurnitureById);

module.exports = router;