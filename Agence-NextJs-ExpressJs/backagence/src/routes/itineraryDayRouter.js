const express = require('express');
const router = express.Router();
const itineraryController = require('../controllers/itineraryDayController');
const authMiddleware = require('../middlewares/authMiddleware');
router.get('/itinerary', itineraryController.getAll);
router.get('/itinerary/program/:id', itineraryController.getAllbyProgramId);
router.get('/itinerary/:id', itineraryController.getById);
router.post('/itinerary', itineraryController.create);
router.put('/itinerary/:id', itineraryController.update);
router.delete('/itinerary/:id', itineraryController.delete);

module.exports = router;
