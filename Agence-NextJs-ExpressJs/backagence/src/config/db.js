
const mongoose = require('mongoose');
const createAdmin = require('../controllers/createAdmin');
require('dotenv').config();
const url = "mongodb://localhost:27017/" + process.env.DB_NAME
mongoose.connect(url)
.then(async() => {
    await createAdmin();
    console.log('Connecté à MongoDB');
})
.catch(err => {
    console.error('Erreur de connexion à MongoDB: ', err);
    process.exit(1);
});

module.exports = mongoose;
