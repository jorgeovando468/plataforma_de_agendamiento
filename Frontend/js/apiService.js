const API_BASE = 'http://localhost:3000/api';

async function safeFetch(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Error de comunicación con el servidor');
  }
  return response.json();
}

async function getAvailableDates() {
  const data = await safeFetch(`${API_BASE}/fechas`);
  return data.data?.blockedDates || [];
}

async function getAvailableTimes(date) {
  const data = await safeFetch(`${API_BASE}/horarios${date ? `?date=${encodeURIComponent(date)}` : ''}`);
  return data.data || [];
}

async function getCurrentPrice() {
  const data = await safeFetch(`${API_BASE}/precios`);
  return data.data || { basePrice: null, prices: [] };
}

async function getPublicConfig() {
  const data = await safeFetch(`${API_BASE}/config/public`);
  return data.data || {};
}

window.apiService = {
  getAvailableDates,
  getAvailableTimes,
  getCurrentPrice,
  getPublicConfig
};
