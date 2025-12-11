const express = require('express');
const { createAppointment } = require('../controllers/appointmentController');
const { validateAppointmentRequest } = require('../middlewares/validationMiddleware');

const router = express.Router();

router.post('/', validateAppointmentRequest, createAppointment);

module.exports = router;
