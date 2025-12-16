const express = require('express');
const cors = require('cors');
require('dotenv').config();

const appointmentRoutes = require('./routes/appointmentRoutes');
const publicRoutes = require('./routes/publicRoutes');
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');
const whatsappRoutes = require('./routes/whatsappRoutes');
const errorHandler = require('./middlewares/errorHandler');
const whatsappService = require('./services/whatsappService');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/appointments', appointmentRoutes);
app.use('/api', publicRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/whatsapp', whatsappRoutes);

app.use(errorHandler);

function handleShutdown(signal) {
  console.log(`\n🛑 Recibida señal ${signal}. Cerrando WhatsApp y apagando servidor...`);
  Promise.resolve(whatsappService.shutdown())
    .catch((err) => console.error('⚠️  Error al cerrar WhatsApp:', err.message))
    .finally(() => process.exit(0));
}

process.once('SIGINT', handleShutdown);
process.once('SIGTERM', handleShutdown);

app.listen(PORT, () => {
  console.log(`\n✅ Servidor corriendo en http://localhost:${PORT}`);
  console.log('🔗 Endpoints disponibles:');
  console.log('   - POST /api/appointments');
  console.log('   - GET  /api/horarios');
  console.log('   - GET  /api/precios');
  console.log('   - GET  /api/fechas');
  console.log('   - GET  /api/available-times/:date');
});
