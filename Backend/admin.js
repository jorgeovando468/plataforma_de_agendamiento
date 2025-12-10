const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('./db');

// Middleware de autenticación
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ status: 'error', message: 'No autorizado' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ status: 'error', message: 'Token inválido' });
  }
};

// ==========================================
// RUTAS DE CITAS (YA EXISTENTES)
// ==========================================

// Obtener todas las citas
router.get('/citas', authMiddleware, async (req, res) => {
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
    console.error('Error obteniendo citas:', error);
    res.status(500).json({ status: 'error', message: 'Error obteniendo citas' });
  }
});

// Confirmar cita
router.put('/citas/:id/confirmar', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const query = 'UPDATE appointments SET estado = ? WHERE id = ?';
    await db.execute(query, ['confirmada', id]);
    res.json({ status: 'success', message: 'Cita confirmada' });
  } catch (error) {
    console.error('Error confirmando cita:', error);
    res.status(500).json({ status: 'error', message: 'Error confirmando cita' });
  }
});

// Cancelar cita
router.put('/citas/:id/cancelar', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const query = 'UPDATE appointments SET estado = ? WHERE id = ?';
    await db.execute(query, ['cancelada', id]);
    res.json({ status: 'success', message: 'Cita cancelada' });
  } catch (error) {
    console.error('Error cancelando cita:', error);
    res.status(500).json({ status: 'error', message: 'Error cancelando cita' });
  }
});

// Reprogramar cita
router.put('/citas/:id/reprogramar', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { fecha, hora } = req.body;
  try {
    const query = 'UPDATE appointments SET date = ?, time = ? WHERE id = ?';
    await db.execute(query, [fecha, hora, id]);
    res.json({ status: 'success', message: 'Cita reprogramada' });
  } catch (error) {
    console.error('Error reprogramando cita:', error);
    res.status(500).json({ status: 'error', message: 'Error reprogramando cita' });
  }
});

// Eliminar cita
router.delete('/citas/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const query = 'DELETE FROM appointments WHERE id = ?';
    await db.execute(query, [id]);
    res.json({ status: 'success', message: 'Cita eliminada' });
  } catch (error) {
    console.error('Error eliminando cita:', error);
    res.status(500).json({ status: 'error', message: 'Error eliminando cita' });
  }
});

// ==========================================
// RUTAS DE CONFIGURACIÓN DE HORARIOS Y PRECIOS (NUEVAS)
// ==========================================

// Obtener todos los horarios
router.get('/time-slots', authMiddleware, async (req, res) => {
  try {
    const [slots] = await db.execute('SELECT * FROM time_slots ORDER BY time_value ASC');
    res.json({ status: 'success', data: slots });
  } catch (error) {
    console.error('Error obteniendo horarios:', error);
    res.status(500).json({ status: 'error', message: 'Error obteniendo horarios' });
  }
});

// Crear nuevo horario
router.post('/time-slots', authMiddleware, async (req, res) => {
  const { time_value, time_display, price, is_active } = req.body;
  
  if (!time_value || !time_display || !price) {
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
    console.error('Error creando horario:', error);
    res.status(500).json({ status: 'error', message: 'Error creando horario' });
  }
});

// Actualizar horario
router.put('/time-slots/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { time_value, time_display, price, is_active } = req.body;

  try {
    const query = 'UPDATE time_slots SET time_value = ?, time_display = ?, price = ?, is_active = ? WHERE id = ?';
    await db.execute(query, [time_value, time_display, price, is_active, id]);
    res.json({ status: 'success', message: 'Horario actualizado' });
  } catch (error) {
    console.error('Error actualizando horario:', error);
    res.status(500).json({ status: 'error', message: 'Error actualizando horario' });
  }
});

// Eliminar horario
router.delete('/time-slots/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute('DELETE FROM time_slots WHERE id = ?', [id]);
    res.json({ status: 'success', message: 'Horario eliminado' });
  } catch (error) {
    console.error('Error eliminando horario:', error);
    res.status(500).json({ status: 'error', message: 'Error eliminando horario' });
  }
});

// ==========================================
// RUTAS DE FECHAS BLOQUEADAS
// ==========================================

// Obtener fechas bloqueadas
router.get('/blocked-dates', authMiddleware, async (req, res) => {
  try {
    const [dates] = await db.execute('SELECT * FROM blocked_dates ORDER BY date ASC');
    res.json({ status: 'success', data: dates });
  } catch (error) {
    console.error('Error obteniendo fechas bloqueadas:', error);
    res.status(500).json({ status: 'error', message: 'Error obteniendo fechas bloqueadas' });
  }
});

// Agregar fecha bloqueada
router.post('/blocked-dates', authMiddleware, async (req, res) => {
  const { date, reason } = req.body;
  
  if (!date) {
    return res.status(400).json({ status: 'error', message: 'Fecha requerida' });
  }

  try {
    const query = 'INSERT INTO blocked_dates (date, reason) VALUES (?, ?)';
    await db.execute(query, [date, reason || 'No disponible']);
    res.status(201).json({ status: 'success', message: 'Fecha bloqueada agregada' });
  } catch (error) {
    console.error('Error agregando fecha bloqueada:', error);
    res.status(500).json({ status: 'error', message: 'Error agregando fecha bloqueada' });
  }
});

// Eliminar fecha bloqueada
router.delete('/blocked-dates/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute('DELETE FROM blocked_dates WHERE id = ?', [id]);
    res.json({ status: 'success', message: 'Fecha bloqueada eliminada' });
  } catch (error) {
    console.error('Error eliminando fecha bloqueada:', error);
    res.status(500).json({ status: 'error', message: 'Error eliminando fecha bloqueada' });
  }
});

// ==========================================
// RUTAS DE CONFIGURACIÓN GENERAL
// ==========================================

// Obtener configuración general
router.get('/settings', authMiddleware, async (req, res) => {
  try {
    const [settings] = await db.execute('SELECT * FROM config_settings');
    const config = {};
    settings.forEach(s => {
      config[s.setting_key] = s.setting_value;
    });
    res.json({ status: 'success', data: config });
  } catch (error) {
    console.error('Error obteniendo configuración:', error);
    res.status(500).json({ status: 'error', message: 'Error obteniendo configuración' });
  }
});

// Actualizar configuración general
router.put('/settings', authMiddleware, async (req, res) => {
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
    console.error('Error actualizando configuración:', error);
    res.status(500).json({ status: 'error', message: 'Error actualizando configuración' });
  }
});

module.exports = router;