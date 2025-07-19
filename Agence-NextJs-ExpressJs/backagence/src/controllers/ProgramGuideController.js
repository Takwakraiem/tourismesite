const { ProgramGuide } = require('../models/ProgramGuide');
const Program = require('../models/Program');
const Guide = require('../models/Guide');
const {sendEmail} = require('../utils/mailer');
const createProgramGuide = async (req, res) => {
  try {
    const { programId, guideId } = req.body;
    const programGuide = await ProgramGuide.create({ programId, guideId });
    await Program.findByIdAndUpdate(programId, {
      $addToSet: { programguide: programGuide._id } 
    });

    await Guide.findByIdAndUpdate(guideId, {
      $addToSet: { programguide: programGuide._id }
    });
   const program = await Program.findById(programId);
    const guide = await Guide.findById(guideId);
     await sendEmail(
        guide.email,
        `Nouvelle affectation : ${program.title}`,
        `
          <p>Bonjour ${guide.name},</p>
          <p>Vous avez été affecté au programme <strong>${program.title}</strong>.</p>
          <p>Merci de contact votre admin pour plus de détails.</p>
          <p>— L'équipe</p>
        `,
      );
    res.status(201).json(programGuide);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllProgramGuides = async (req, res) => {
  try {
    const list = await ProgramGuide.find()
      .populate('programId')
      .populate('guideId');
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProgramGuideById = async (req, res) => {
  try {
    const programGuide = await ProgramGuide.findById(req.params.id)
      .populate('programId')
      .populate('guideId');
    if (!programGuide) {
      return res.status(404).json({ message: "ProgramGuide non trouvé" });
    }
    res.json(programGuide);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteProgramGuide = async (req, res) => {
  try {
    const programGuide = await ProgramGuide.findByIdAndDelete(req.params.id);

    if (!programGuide) {
      return res.status(404).json({ message: "ProgramGuide non trouvé" });
    }
    await Program.findByIdAndUpdate(programGuide.programId, {
      $pull: { programguide: programGuide._id }
    });

    await Guide.findByIdAndUpdate(programGuide.guideId, {
      $pull: { programguide: programGuide._id }
    });

    res.json({ message: "ProgramGuide supprimé et références mises à jour" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
  createProgramGuide,
  getAllProgramGuides,
  getProgramGuideById,
  deleteProgramGuide,
};
