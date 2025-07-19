const express = require("express");
const router = express.Router();
const likeController = require("../controllers/likeController");

router.post("/like", likeController.toggleLike);
router.get("/like/:programId", likeController.getLikesByProgram);
router.get("/like/check/:userId/:programId", likeController.checkUserLike);
module.exports = router;
