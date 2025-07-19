const Program = require("../models/Program");
const ProgramImage = require("../models/ProgramImage");
exports.getImagesByProgram = async (req, res) => {
  try {
    const images = await ProgramImage.find({ programId: req.params.programId }).sort({ order: 1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.addImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Aucune image fournie." });

    const { alt, order } = req.body;
    const newImage = new ProgramImage({
      url: req.file.filename,
      alt: alt || null,
      order: order || 0,
      programId: req.params.programId,
    });

    await newImage.save();
      await Program.findByIdAndUpdate(req.params.programId, {
      $push: { images: newImage._id },
    });
    res.status(201).json(newImage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.deleteImage = async (req, res) => {
  try {
    const image = await ProgramImage.findByIdAndDelete(req.params.imageId);
    if (!image) return res.status(404).json({ error: "Image non trouvée." });

    res.json({ message: "Image supprimée." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.updateImage = async (req, res) => {
  try {
    const { alt, order } = req.body;

    const image = await ProgramImage.findByIdAndUpdate(
      req.params.imageId,
      { alt, order },
      { new: true, runValidators: true }
    );

    if (!image) return res.status(404).json({ error: "Image non trouvée." });

    res.json(image);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
