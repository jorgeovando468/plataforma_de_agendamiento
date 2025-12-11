const express = require('express');
const {
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
} = require('../controllers/adminController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/citas', verifyToken, getCitas);
router.put('/citas/:id/confirmar', verifyToken, confirmarCita);
router.put('/citas/:id/cancelar', verifyToken, cancelarCita);
router.put('/citas/:id/reprogramar', verifyToken, reprogramarCita);
router.delete('/citas/:id', verifyToken, eliminarCita);

router.get('/time-slots', verifyToken, getHorarios);
router.post('/time-slots', verifyToken, crearHorario);
router.put('/time-slots/:id', verifyToken, actualizarHorario);
router.delete('/time-slots/:id', verifyToken, eliminarHorario);

router.get('/blocked-dates', verifyToken, getFechasBloqueadas);
router.post('/blocked-dates', verifyToken, agregarFechaBloqueada);
router.delete('/blocked-dates/:id', verifyToken, eliminarFechaBloqueada);

router.get('/settings', verifyToken, getSettings);
router.put('/settings', verifyToken, updateSettings);

module.exports = router;
