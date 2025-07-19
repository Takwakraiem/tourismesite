const ProgramInclude = require("../models/ProgramInclude");
exports.createInclude = async (req, res) => {
  try {
    const { description } = req.body;
    const { programId } = req.params;

    const include = await ProgramInclude.create({ description, programId });
    res.status(201).json(include);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getIncludesByProgram = async (req, res) => {
  try {
    const { programId } = req.params;
    const includes = await ProgramInclude.find({ programId });
    res.json(includes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.updateInclude = async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;

    const updated = await ProgramInclude.findByIdAndUpdate(
      id,
      { description },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ error: "Include non trouvé." });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.deleteInclude = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ProgramInclude.findByIdAndDelete(id);

    if (!deleted) return res.status(404).json({ error: "Include non trouvé." });

    res.json({ message: "Include supprimé." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
