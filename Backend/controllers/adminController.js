const db = require('../db');

async function getCitas(req, res, next) {
  try {
    const query = `
      SELECT id, email as email, nombre_completo as paciente, telefono,
             age as edad, reason as motivo, date as fecha, time as hora,
             price, estado
      FROM appointments
      ORDER BY date DESC, time DESC
    `;
    const [citas] = await db.execute(query);
    res.json({ status: 'success', data: citas });
  } catch (error) {
    next(error);
  }
}

async function confirmarCita(req, res, next) {
  try {
    const { id } = req.params;
    await db.execute('UPDATE appointments SET estado = ? WHERE id = ?', ['confirmada', id]);
    res.json({ status: 'success', message: 'Cita confirmada' });
  } catch (error) {
    next(error);
  }
}

async function cancelarCita(req, res, next) {
  try {
    const { id } = req.params;
    await db.execute('UPDATE appointments SET estado = ? WHERE id = ?', ['cancelada', id]);
    res.json({ status: 'success', message: 'Cita cancelada' });
  } catch (error) {
    next(error);
  }
}

async function reprogramarCita(req, res, next) {
  try {
    const { id } = req.params;
    const { fecha, hora } = req.body;
    await db.execute('UPDATE appointments SET date = ?, time = ? WHERE id = ?', [fecha, hora, id]);
    res.json({ status: 'success', message: 'Cita reprogramada' });
  } catch (error) {
    next(error);
  }
}

async function eliminarCita(req, res, next) {
  try {
    const { id } = req.params;
    await db.execute('DELETE FROM appointments WHERE id = ?', [id]);
    res.json({ status: 'success', message: 'Cita eliminada' });
  } catch (error) {
    next(error);
  }
}

async function getHorarios(req, res, next) {
  try {
    const [slots] = await db.execute('SELECT * FROM time_slots ORDER BY time_value ASC');
    res.json({ status: 'success', data: slots });
  } catch (error) {
    next(error);
  }
}

async function crearHorario(req, res, next) {
  const { time_value, time_display, price, is_active } = req.body;

  if (!time_value || !time_display || price === undefined) {
    return res.status(400).json({ status: 'error', message: 'Faltan datos requeridos' });
  }

  try {
    const query = 'INSERT INTO time_slots (time_value, time_display, price, is_active) VALUES (?, ?, ?, ?)';
    const [result] = await db.execute(query, [time_value, time_display, price, is_active ?? true]);
    res.status(201).json({
      status: 'success',
      message: 'Horario creado correctamente',
      data: { id: result.insertId }
    });
  } catch (error) {
    next(error);
  }
}

async function actualizarHorario(req, res, next) {
  const { id } = req.params;
  const { time_value, time_display, price, is_active } = req.body;

  try {
    const query = 'UPDATE time_slots SET time_value = ?, time_display = ?, price = ?, is_active = ? WHERE id = ?';
    await db.execute(query, [time_value, time_display, price, is_active, id]);
    res.json({ status: 'success', message: 'Horario actualizado' });
  } catch (error) {
    next(error);
  }
}

async function eliminarHorario(req, res, next) {
  try {
    const { id } = req.params;
    await db.execute('DELETE FROM time_slots WHERE id = ?', [id]);
    res.json({ status: 'success', message: 'Horario eliminado' });
  } catch (error) {
    next(error);
  }
}

async function getFechasBloqueadas(req, res, next) {
  try {
    const [dates] = await db.execute('SELECT * FROM blocked_dates ORDER BY date ASC');
    res.json({ status: 'success', data: dates });
  } catch (error) {
    next(error);
  }
}

async function agregarFechaBloqueada(req, res, next) {
  const { date, reason } = req.body;

  if (!date) {
    return res.status(400).json({ status: 'error', message: 'Fecha requerida' });
  }

  try {
    const query = 'INSERT INTO blocked_dates (date, reason) VALUES (?, ?)';
    await db.execute(query, [date, reason || 'No disponible']);
    res.status(201).json({ status: 'success', message: 'Fecha bloqueada agregada' });
  } catch (error) {
    next(error);
  }
}

async function eliminarFechaBloqueada(req, res, next) {
  try {
    const { id } = req.params;
    await db.execute('DELETE FROM blocked_dates WHERE id = ?', [id]);
    res.json({ status: 'success', message: 'Fecha bloqueada eliminada' });
  } catch (error) {
    next(error);
  }
}

async function getSettings(req, res, next) {
  try {
    const [settings] = await db.execute('SELECT * FROM config_settings');
    const config = {};
    settings.forEach((s) => {
      config[s.setting_key] = s.setting_value;
    });
    res.json({ status: 'success', data: config });
  } catch (error) {
    next(error);
  }
}

async function updateSettings(req, res, next) {
  const settings = req.body;

  try {
    for (const [key, value] of Object.entries(settings)) {
      const query = `
        INSERT INTO config_settings (setting_key, setting_value)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE setting_value = ?
      `;
      await db.execute(query, [key, value, value]);
    }
    res.json({ status: 'success', message: 'Configuración actualizada' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getCitas,
  confirmarCita,
  cancelarCita,
  reprogramarCita,
  eliminarCita,
  getHorarios,
  crearHorario,
  actualizarHorario,
  eliminarHorario,
  getFechasBloqueadas,
  agregarFechaBloqueada,
  eliminarFechaBloqueada,
  getSettings,
  updateSettings
};
