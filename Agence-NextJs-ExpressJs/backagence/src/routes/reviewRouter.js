const express = require("express");
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const isAdmin = require('../middlewares/isAdmin');
const reviewController = require("../controllers/reviewController");
router.post("/review", reviewController.createReview);
router.get("/program/:programId/review", reviewController.getReviewsByProgram);
router.delete("/review/:id", reviewController.deleteReview);
router.put("/review/:id", reviewController.updateReview);

module.exports = router;
