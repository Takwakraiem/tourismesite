
const nodemailer = require('nodemailer');
require('dotenv').config(); 
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_PORT === '465', // uniquement true si port = 465
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

/**
 * Envoyer un email
 * @param {string} to - Adresse email du destinataire
 * @param {string} subject - Sujet de l’email
 * @param {string} html - Contenu HTML de l’email
 */
const sendEmail = async (to, subject, html) => {
    try {
        await transporter.sendMail({
            from: `"Support" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html
        });
        console.log(`📧 Email envoyé à ${to}`);
    } catch (error) {
        console.error('❌ Erreur envoi email :', error.message);
    }
};

module.exports = { sendEmail };

