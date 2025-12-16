const nodemailer = require('nodemailer');
require('dotenv').config();

const ENABLE_EMAIL = process.env.ENABLE_EMAIL !== 'false';
let transporter = null;

function initTransporter() {
  if (!ENABLE_EMAIL) {
    console.log('📨 Envío de correos deshabilitado.');
    return;
  }

  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  } else {
    console.log('📨 Credenciales de correo faltantes, se omite el envío real.');
  }
}

initTransporter();

async function sendAppointmentConfirmation({ email, nombre_completo, telefono, reason, date, time, price }) {
  if (!transporter) {
    console.log('📨 (Modo desarrollo) Email no enviado, contenido:', {
      email,
      nombre_completo,
      telefono,
      reason,
      date,
      time,
      price
    });
    return;
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Confirmación de Cita - Consultorio Psicológico',
    html: `
        <h2>Confirmación de Cita</h2>
        <p><strong>Hola ${nombre_completo},</strong></p>
        <p>Tu cita ha sido agendada exitosamente:</p>
        <ul>
          <li><strong>Fecha:</strong> ${date}</li>
          <li><strong>Hora:</strong> ${time}</li>
          <li><strong>Motivo:</strong> ${reason}</li>
          <li><strong>Precio:</strong> ${price}</li>
          <li><strong>Teléfono de contacto:</strong> ${telefono}</li>
        </ul>
        <p>¡Gracias por confiar en nosotros!</p>
      `
  };

  await transporter.sendMail(mailOptions);
}

module.exports = {
  sendAppointmentConfirmation
};
