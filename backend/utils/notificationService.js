const nodemailer = require('nodemailer');
const axios = require('axios');

// Configurazione del trasporto email
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Funzione per inviare notifiche tramite email
const sendEmailNotification = async (recipient, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipient,
    subject: subject,
    text: text
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email inviata con successo');
  } catch (error) {
    console.error('Errore nell\'invio dell\'email:', error);
  }
};

// Funzione per inviare notifiche tramite il sistema operativo
const sendSystemNotification = (title, message) => {
  new Notification(title, { body: message });
};

// Funzione per inviare notifiche tramite un alert
const sendAlertNotification = (message) => {
  alert(message);
};

module.exports = {
  sendEmailNotification,
  sendSystemNotification,
  sendAlertNotification
};