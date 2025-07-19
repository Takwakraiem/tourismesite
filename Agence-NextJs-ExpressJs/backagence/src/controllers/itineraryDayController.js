const ItineraryDay = require('../models/ItineraryDay');
exports.getAll = async (req, res) => {
  try {
    const itineraryDays = await ItineraryDay.find().populate('programId');
    res.status(200).json(itineraryDays);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getAllbyProgramId = async (req, res) => {
  try {
    const itineraryDays = await ItineraryDay.find({ programId: req.params.id });
    res.status(200).json(itineraryDays);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getById = async (req, res) => {
  try {
    const itineraryDay = await ItineraryDay.findById(req.params.id).populate('programId');
    if (!itineraryDay) {
      return res.status(404).json({ message: 'Itinerary day not found' });
    }
    res.status(200).json(itineraryDay);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.create = async (req, res) => {
  try {
    const newDay = new ItineraryDay(req.body);
    const savedDay = await newDay.save();
    res.status(201).json(savedDay);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
exports.update = async (req, res) => {
  try {
    const updatedDay = await ItineraryDay.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedDay) {
      return res.status(404).json({ message: 'Itinerary day not found' });
    }
    res.status(200).json(updatedDay);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
exports.delete = async (req, res) => {
  try {
    const deletedDay = await ItineraryDay.findByIdAndDelete(req.params.id);
    if (!deletedDay) {
      return res.status(404).json({ message: 'Itinerary day not found' });
    }
    res.status(200).json({ message: 'Itinerary day deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
