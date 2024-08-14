require('dotenv').config(); // Carica le variabili d'ambiente dal file .env
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmailNotification = async (recipient, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipient,
    subject: subject,
    text: text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email inviata con successo');
  } catch (error) {
    console.error("Errore nell'invio dell'email:", error);
  }
};

const sendSystemNotification = (title, message) => {
  const notification = new Notification(title, {
    body: message,
  });
  notification.onclick = () => console.log('Notifica cliccata');
};

const sendAlertNotification = (message) => {
  alert(message);
};

// const sendNotification = async (userId, message, method) => {
//   // Recupera l'utente per ottenere dettagli di contatto
//   const user = await User.findById(userId);
//   if (!user) return console.error('Utente non trovato');

//   switch (method) {
//     case 'system':
//       sendSystemNotification('Reminder', message);
//       break;
//     case 'alert':
//       sendAlertNotification(message);
//       break;
//     case 'email':
//       sendEmailNotification(user.email, 'Reminder', message);
//       break;
//   }
// };

// module.exports = {
//   sendNotification,
// };