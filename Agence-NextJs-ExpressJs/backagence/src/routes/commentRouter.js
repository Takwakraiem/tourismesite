const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const authMiddleware = require('../middlewares/authMiddleware');
router.post("/comments", commentController.createComment);
router.get("/program/:programId/comments", commentController.getCommentsByProgram);
router.delete("/comments/:id", commentController.deleteComment);
router.put("/comments/:id", commentController.updateComment);

module.exports = router;
