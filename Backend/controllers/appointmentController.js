const appointmentService = require('../services/appointmentService');
const emailService = require('../services/emailService');
const whatsappService = require('../services/whatsappService');

async function createAppointment(req, res, next) {
  const { email, nombre_completo, telefono, age, reason, date, time, price } = req.body;

  try {
    const slotTaken = await appointmentService.isSlotTaken(date, time);
    if (slotTaken) {
      return res.status(409).json({ error: 'Horario no disponible' });
    }

    const id = await appointmentService.createAppointment({
      email,
      nombre_completo,
      telefono,
      age,
      reason,
      date,
      time,
      price
    });

    const paciente = { nombre_completo, telefono, email, price };

    emailService
      .sendAppointmentConfirmation({ email, nombre_completo, telefono, reason, date, time, price })
      .catch((error) => console.error('❌ Error enviando email:', error.message));

    whatsappService.sendConfirmationMessage(paciente, date, time).catch((error) => {
      console.error('❌ Error enviando WhatsApp de confirmación:', error.message);
    });

    whatsappService.scheduleReminderMessage(paciente, date, time);

    res.status(201).json({
      status: 'success',
      message: 'Cita agendada correctamente',
      data: { id }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createAppointment
};
