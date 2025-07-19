const express = require("express");
const router = express.Router();
const programImageController = require("../controllers/programImageController");
const multer = require('multer');
const path = require('path');
const authMiddleware = require('../middlewares/authMiddleware');
const isAdmin = require('../middlewares/isAdmin');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });
router.get("/programImage/:programId", programImageController.getImagesByProgram);
router.post("/programImage/:programId", upload.single("image"), programImageController.addImage);
router.delete("/programImage/image/:imageId", programImageController.deleteImage);
router.patch("/programImage/image/:imageId", programImageController.updateImage);

module.exports = router;
