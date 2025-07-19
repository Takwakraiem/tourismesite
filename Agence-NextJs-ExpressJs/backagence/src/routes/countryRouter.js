const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Country = require('../models/Country'); 
const authMiddleware = require('../middlewares/authMiddleware');
const isAdmin = require('../middlewares/isAdmin');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });
router.post('/add', upload.single('image'), async (req, res) => {
  try {
    const { name, slug, description } = req.body;
    const imagePath = req.file ? req.file.filename : null;
    
    const country = new Country({
      name,
      slug,
      description,
      image: imagePath,
    });

    await country.save();
    res.status(201).json(country);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Le nom ou le slug existe déjà.' });
    }
    res.status(500).json({ error: err.message });
  }
});
router.patch('/updateImage/:id', upload.single('image'), async (req, res) => {
  try {
    const countryId = req.params.id;
    if (!req.file) {
      return res.status(400).json({ error: "Aucune image fournie." });
    }
    const newImagePath = req.file.filename;
    const updatedCountry = await Country.findByIdAndUpdate(
      countryId,
      { image: newImagePath },
      { new: true }
    );
    if (!updatedCountry) {
      return res.status(404).json({ error: "Pays non trouvé." });
    }
    res.json({
      message: "Image mise à jour avec succès.",
      country: updatedCountry,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/getall', async (req, res) => {
  try {
    const countries = await Country.find()
         .populate('programs', 'title') 
    res.json(countries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get('/get/:id', async (req, res) => {
  try {
    const country = await Country.findById(req.params.id);
    if (!country) {
      return res.status(404).json({ error: 'Pays non trouvé.' });
    }
    res.json(country);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.put("/updateCountry/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, slug, description } = req.body;

    const updateFields = {
      name,
      slug,
      description,
    };

    if (req.file?.filename) {
      updateFields.image = req.file.filename;
    }

    const updatedCountry = await Country.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    );

    console.log(`Country updated: ${updatedCountry}`);

    if (!updatedCountry) {
      return res.status(404).json({ error: "Pays non trouvé." });
    }

    res.json(updatedCountry);
  } catch (err) {
    console.error("Erreur lors de la mise à jour :", err);
    res.status(500).json({ error: err.message });
  }
});
router.delete('/delete/:id', async (req, res) => {
  try {
    const deletedCountry = await Country.findByIdAndDelete(req.params.id);
    if (!deletedCountry) {
      return res.status(404).json({ error: 'Pays non trouvé.' });
    }
    res.json({ message: 'Pays supprimé avec succès.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;
