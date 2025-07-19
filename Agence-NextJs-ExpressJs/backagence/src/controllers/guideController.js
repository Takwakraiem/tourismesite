const { mongoose } = require("mongoose");
const Country = require("../models/Country");
const Guide = require("../models/Guide");
const {ProgramGuide} = require("../models/ProgramGuide");
const GuideReview = require("../models/GuideReview");
exports.createGuide = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ error: "Aucune image fournie." });
    const newGuide = new Guide({
      name: req.body.name,
      email: req.body.email,
      specialty: req.body.specialty,
      bio: req.body.bio,
      experience: req.body.experience,
      languages: req.body.languages,
      country: req.body.country,
      image: req.file.filename,
    });
    const savedGuide = await newGuide.save();
    if (req.body.country) {
      await Country.findByIdAndUpdate(
        req.body.country,
        { $push: { guides: savedGuide._id } },
        { new: true }
      );
    }
    res.status(201).json(savedGuide);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
exports.updateGuide = async (req, res) => {
  try {
    const guideId = req.params.id;
    const newCountryId = req.body.country;

    const oldGuide = await Guide.findById(guideId);
    if (!oldGuide) {
      return res.status(404).json({ error: "Guide non trouvé" });
    }

    const imagePath = req.file ? `${req.file.filename}` : oldGuide.image;
    const updateData = {
      ...req.body,
      image: imagePath,
    };

    const updatedGuide = await Guide.findByIdAndUpdate(guideId, updateData, {
      new: true,
    });
    const oldCountryId = oldGuide.country?.toString();
    if (newCountryId && newCountryId !== oldCountryId) {
      if (oldCountryId) {
        await Country.findByIdAndUpdate(oldCountryId, {
          $pull: { guides: guideId },
        });
      }
      await Country.findByIdAndUpdate(newCountryId, {
        $addToSet: { guides: guideId },
      });
    }

    res.status(200).json(updatedGuide);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
exports.getAllGuides = async (req, res) => {
  try {
    const guides = await Guide.find().populate("country");
    res.status(200).json(guides);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getAllGuidesbyProgramId = async (req, res) => {
  try {
    const countryId = req.params.countryId;
    if (!mongoose.Types.ObjectId.isValid(countryId)) {
      return res.status(400).json({ error: "ID de pays invalide." });
    }
    const guides = await Guide.find({ country: countryId,isActive:true });
    res.status(200).json(guides);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getGuideById = async (req, res) => {
  try {
    const guide = await Guide.findById(req.params.id).populate("country");
    if (!guide) return res.status(404).json({ error: "Guide non trouvé" });
    res.status(200).json(guide);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.createGuidet = async (req, res) => {
  try {
    const newGuide = new Guide(req.body);
    const savedGuide = await newGuide.save();
    if (req.body.country) {
      await Country.findByIdAndUpdate(
        req.body.country,
        { $push: { guides: savedGuide._id } },
        { new: true }
      );
    }
    res.status(201).json(savedGuide);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
exports.updateGuide = async (req, res) => {
  try {
    const guideId = req.params.id;
    const newCountryId = req.body.country;
    const oldGuide = await Guide.findById(guideId);
    if (!oldGuide) {
      return res.status(404).json({ error: "Guide non trouvé" });
    }
    const oldCountryId = oldGuide.country?.toString();
    const updatedGuide = await Guide.findByIdAndUpdate(guideId, req.body, {
      new: true,
    });
    if (newCountryId && newCountryId !== oldCountryId) {
      if (oldCountryId) {
        await Country.findByIdAndUpdate(oldCountryId, {
          $pull: { guides: guideId },
        });
      }
      await Country.findByIdAndUpdate(newCountryId, {
        $addToSet: { guides: guideId },
      });
    }
    res.status(200).json(updatedGuide);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
exports.deleteGuide = async (req, res) => {
  try {
    const guideId = req.params.id;
    const guide = await Guide.findById(guideId);
    if (!guide) {
      return res.status(404).json({ error: "Guide non trouvé" });
    }
    await ProgramGuide.deleteMany({ _id: { $in: guide.programs } });
    await GuideReview.deleteMany({ _id: { $in: guide.reviews } });
    await Country.updateMany(
      { _id: guide.country },
      { $pull: { guides: guide._id } }
    );
    await Guide.findByIdAndDelete(guideId);
    res.status(200).json({ message: "Guide et ses données associées supprimés." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.toggleGuideStatus = async (req, res) => {
  try {
    const guide = await Guide.findById(req.params.id);
    if (!guide) return res.status(404).json({ error: "Guide non trouvé" });
    guide.isActive = !guide.isActive;
    await guide.save();
    res.status(200).json({ isActive: guide.isActive });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
