const express = require('express');
const {
  getHorarios,
  getAvailableTimes,
  getPrecios,
  getFechas,
  getBlockedDates,
  getPublicConfig
} = require('../controllers/publicController');

const router = express.Router();

router.get('/horarios', getHorarios);
router.get('/precios', getPrecios);
router.get('/fechas', getFechas);
router.get('/available-times/:date', getAvailableTimes);
router.get('/blocked-dates', getBlockedDates);
router.get('/config/public', getPublicConfig);

module.exports = router;
