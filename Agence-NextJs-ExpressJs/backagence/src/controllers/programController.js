const { default: mongoose } = require('mongoose');
const Country = require('../models/Country');
const Program = require("../models/Program");
const ProgramImage = require("../models/ProgramImage");
const ItineraryDay = require("../models/ItineraryDay");
const ProgramInclude = require("../models/ProgramInclude");
const { Review } = require('../models/Review');
const {ProgramLike} = require("../models/ProgramLike");
const {Comment} = require("../models/Comment");
const {ProgramGuide} = require("../models/ProgramGuide");
exports.getAllPrograms = async (req, res) => {
  try {
    const programs = await Program.find().populate('country').populate('images','url');;
    res.status(200).json(programs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getProgramById = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id)
;
    if (!program) return res.status(404).json({ error: 'Programme non trouvé' });
    res.status(200).json(program);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.createProgram = async (req, res) => {
  try {
    const newProgram = new Program(req.body);   
    const saved = await newProgram.save();
      if (req.body.country) {
      await Country.findByIdAndUpdate(
        req.body.country,
        { $push: { programs: saved._id } },
        { new: true }
      );
    }

    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.updateProgram = async (req, res) => {
  try {
    const updated = await Program.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Programme non trouvé' });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.deleteProgram = async (req, res) => {
  try {
       const programId = req.params.id;
    const program = await Program.findById(programId);
    if (!program) {
      return res.status(404).json({ error: "Programme non trouvé" });
    }
    await ProgramImage.deleteMany({ _id: { $in: program.images } });
    await ItineraryDay.deleteMany({ _id: { $in: program.itinerary } });
    await ProgramInclude.deleteMany({ _id: { $in: program.includes } });
    await Review.deleteMany({ _id: { $in: program.reviews } });
    await ProgramLike.deleteMany({ _id: { $in: program.likes } });
    await Comment.deleteMany({ _id: { $in: program.comments } });
    await ProgramGuide.deleteMany({ _id: { $in: program.guides } });
    await Program.findByIdAndDelete(programId);
        res.status(200).json({ message: "Programme et ses données associées ont été supprimés." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Program.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.incrementViews = async (req, res) => {
  try {
    const program = await Program.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    res.status(200).json(program);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addLike = async (req, res) => {
  try {
    const userId = req.body.userId;
    const program = await Program.findById(req.params.id);
    if (!program.likes.includes(userId)) {
      program.likes.push(userId);
      await program.save();
    }
    res.status(200).json(program);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.removeLike = async (req, res) => {
  try {
    const userId = req.body.userId;
    const program = await Program.findByIdAndUpdate(
      req.params.id,
      { $pull: { likes: userId } },
      { new: true }
    );
    res.status(200).json(program);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const commentId = req.body.commentId;
    const program = await Program.findById(req.params.id);
    program.comments.push(commentId);
    await program.save();
    res.status(200).json(program);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.removeComment = async (req, res) => {
  try {
    const program = await Program.findByIdAndUpdate(
      req.params.id,
      { $pull: { comments: req.params.commentId } },
      { new: true }
    );
    res.status(200).json(program);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.searchPrograms = async (req, res) => {
  const query = req.query.q || '';
  try {
    const programs = await Program.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { location: { $regex: query, $options: 'i' } },
      ]
    });
    res.status(200).json(programs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getProgramsByCountry = async (req, res) => {
  try {
    const countryId = req.params.countryId;
    (countryId);
    if (!mongoose.Types.ObjectId.isValid(countryId)) {
      return res.status(400).json({ error: "ID de pays invalide." });
    }
    const programs = await Program.find({ country: countryId,status:"PUBLISHED" }).populate('images','url');
    res.status(200).json(programs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};