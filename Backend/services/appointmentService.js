const db = require('../db');

async function isSlotTaken(date, time) {
  const [rows] = await db.execute(
    'SELECT id FROM appointments WHERE date = ? AND time = ? LIMIT 1',
    [date, time]
  );
  return rows.length > 0;
}

async function createAppointment({ email, nombre_completo, telefono, age, reason, date, time, price }) {
  const query =
    'INSERT INTO appointments (email, nombre_completo, telefono, age, reason, date, time, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  const [result] = await db.execute(query, [
    email,
    nombre_completo,
    telefono,
    age,
    reason,
    date,
    time,
    price
  ]);
  return result.insertId;
}

async function getActiveTimeSlots() {
  const [slots] = await db.execute(
    'SELECT id, time_value, time_display, price FROM time_slots WHERE is_active = TRUE ORDER BY time_value ASC'
  );
  return slots;
}

async function getBlockedDates() {
  const [dates] = await db.execute('SELECT id, date, reason FROM blocked_dates ORDER BY date ASC');
  return dates;
}

async function getConfigSettings() {
  const [settings] = await db.execute('SELECT * FROM config_settings');
  const config = {};
  settings.forEach((setting) => {
    config[setting.setting_key] = setting.setting_value;
  });
  return config;
}

module.exports = {
  isSlotTaken,
  createAppointment,
  getActiveTimeSlots,
  getBlockedDates,
  getConfigSettings
};
