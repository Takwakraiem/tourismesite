const express = require("express");
const router = express.Router();
const includeController = require("../controllers/programIncludeController");
const authMiddleware = require('../middlewares/authMiddleware');
const isAdmin = require('../middlewares/isAdmin');
router.post("/programInclude/:programId", includeController.createInclude);
router.get("/programInclude/:programId", includeController.getIncludesByProgram);
router.patch("/programInclude/item/:id", includeController.updateInclude);
router.delete("/programInclude/item/:id", includeController.deleteInclude);

module.exports = router;
