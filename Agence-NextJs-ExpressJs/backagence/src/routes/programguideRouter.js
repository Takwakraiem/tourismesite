const express = require('express');
const router = express.Router();
const programGuideController = require('../controllers/ProgramGuideController');
const authMiddleware = require('../middlewares/authMiddleware');
router.post('/ProgramGuide', programGuideController.createProgramGuide);
router.get('/ProgramGuide', programGuideController.getAllProgramGuides);
router.get('/ProgramGuide/:id', programGuideController.getProgramGuideById);
router.delete('/ProgramGuide/:id', programGuideController.deleteProgramGuide);

module.exports = router;
