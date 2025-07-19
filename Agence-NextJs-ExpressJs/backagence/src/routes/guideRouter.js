const express = require("express");
const router = express.Router();
const guideController = require("../controllers/guideController");
const multer = require('multer');
const path = require('path');
const authMiddleware = require('../middlewares/authMiddleware');


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
router.get("/guides", guideController.getAllGuides);
router.get("/guides/:id", guideController.getGuideById);
router.get("/guides/country/:countryId", guideController.getAllGuidesbyProgramId);
router.post("/addguides",upload.single("image"), guideController.createGuide);
router.put("/guides/:id",upload.single("image"),guideController.updateGuide);
router.delete("/guides/:id", guideController.deleteGuide);
router.patch("/guides/:id/status", guideController.toggleGuideStatus);

module.exports = router;
