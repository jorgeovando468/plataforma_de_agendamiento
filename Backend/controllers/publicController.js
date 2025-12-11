const appointmentService = require('../services/appointmentService');

async function getHorarios(req, res, next) {
  try {
    const { date } = req.query;
    const slots = await appointmentService.getAvailableTimeSlotsForDate(date);
    const times = slots.map((slot) => ({
      id: slot.id,
      value: slot.time_value,
      label: slot.time_display,
      price: Number(slot.price),
      text: `${slot.time_display} - $${Number(slot.price).toLocaleString('es-PY')}`
    }));
    res.json({ status: 'success', data: times });
  } catch (error) {
    next(error);
  }
}

async function getAvailableTimes(req, res, next) {
  try {
    const { date } = req.params;
    const slots = await appointmentService.getAvailableTimeSlotsForDate(date);
    const times = slots.map((slot) => ({
      value: slot.time_value,
      text: `${slot.time_display} - $${Number(slot.price).toLocaleString('es-PY')}`,
      price: Number(slot.price)
    }));
    res.json(times);
  } catch (error) {
    next(error);
  }
}

async function getPrecios(req, res, next) {
  try {
    const slots = await appointmentService.getActiveTimeSlots();
    const prices = slots.map((slot) => ({ time: slot.time_value, price: Number(slot.price) }));
    const basePrice = prices.length > 0 ? prices[0].price : null;
    res.json({ status: 'success', data: { basePrice, prices } });
  } catch (error) {
    next(error);
  }
}

async function getFechas(req, res, next) {
  try {
    const dates = await appointmentService.getBlockedDates();
    const blockedDates = dates.map((d) => d.date);
    res.json({ status: 'success', data: { blockedDates } });
  } catch (error) {
    next(error);
  }
}

async function getBlockedDates(req, res, next) {
  try {
    const dates = await appointmentService.getBlockedDates();
    const blockedDates = dates.map((d) => d.date);
    res.json({ status: 'success', data: blockedDates });
  } catch (error) {
    next(error);
  }
}

async function getPublicConfig(req, res, next) {
  try {
    const config = await appointmentService.getConfigSettings();
    res.json({ status: 'success', data: config });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getHorarios,
  getAvailableTimes,
  getPrecios,
  getFechas,
  getBlockedDates,
  getPublicConfig
};
