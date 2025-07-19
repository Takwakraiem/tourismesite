import nodemailer from "nodemailer"

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: Number.parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendBookingConfirmationEmail(booking: any) {
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: booking.user.email,
    subject: "Confirmation de réservation - Polyglotte Tourism",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Confirmation de réservation</h1>
        <p>Bonjour ${booking.user.name},</p>
        <p>Votre réservation pour le programme <strong>${booking.program.title}</strong> a été confirmée.</p>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Détails de la réservation :</h3>
          <ul>
            <li><strong>Programme :</strong> ${booking.program.title}</li>
            <li><strong>Destination :</strong> ${booking.program.location}</li>
            <li><strong>Date :</strong> ${new Date(booking.bookingDate).toLocaleDateString("fr-FR")}</li>
            <li><strong>Participants :</strong> ${booking.participants}</li>
            <li><strong>Prix total :</strong> ${booking.totalPrice}€</li>
            ${booking.guide ? `<li><strong>Guide :</strong> ${booking.guide.name}</li>` : ""}
          </ul>
        </div>
        
        <p>Nous vous contacterons prochainement pour finaliser les détails de votre voyage.</p>
        <p>Cordialement,<br>L'équipe Polyglotte Tourism</p>
      </div>
    `,
  }

  await transporter.sendMail(mailOptions)
}

export async function sendContactEmail(data: any) {
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: process.env.ADMIN_EMAIL,
    subject: `Nouveau message de ${data.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Nouveau message de contact</h1>
        <p><strong>Nom :</strong> ${data.name}</p>
        <p><strong>Email :</strong> ${data.email}</p>
        <p><strong>Sujet :</strong> ${data.subject}</p>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Message :</strong></p>
          <p>${data.message}</p>
        </div>
      </div>
    `,
  }

  await transporter.sendMail(mailOptions)
}
