const express = require("express");
const router = express.Router();
const controller = require("../controllers/guideReviewController");
const authMiddleware = require('../middlewares/authMiddleware');
router.post("/guideReview", controller.createGuideReview);
router.get("/guideReview", controller.getAllGuideReviews);
router.get("/guideReview/guide/:guideId", controller.getReviewsByGuide);
router.put("/guideReview/:id", controller.updateGuideReview);
router.delete("/guideReview/:id", controller.deleteGuideReview);

module.exports = router;
