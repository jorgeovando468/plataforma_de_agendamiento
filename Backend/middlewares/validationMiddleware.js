function validateAppointmentRequest(req, res, next) {
  const { email, nombre_completo, telefono, age, reason, date, time, price } = req.body;

  if (!email || !nombre_completo || !telefono || !age || !reason || !date || !time || !price) {
    return res.status(400).json({ status: 'error', message: 'Todos los campos son obligatorios' });
  }
  if (age < 18) {
    return res.status(400).json({ status: 'error', message: 'Debes tener al menos 18 años' });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ status: 'error', message: 'Correo electrónico inválido' });
  }
  if (nombre_completo.trim().length === 0) {
    return res.status(400).json({ status: 'error', message: 'Nombre completo es obligatorio' });
  }
  const telefonoRegex = /^(\+595|0)?\s?9\d{2}\s?\d{3}\s?\d{3}$/;
  if (!telefonoRegex.test(telefono)) {
    return res
      .status(400)
      .json({ status: 'error', message: 'Teléfono inválido (ejemplo: +595 981 123 456 o 0981 123 456)' });
  }

  next();
}

module.exports = {
  validateAppointmentRequest
};
