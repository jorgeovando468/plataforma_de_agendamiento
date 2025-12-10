const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const ENABLE_WHATSAPP = process.env.ENABLE_WHATSAPP === 'true';
const ENABLE_EMAIL = process.env.ENABLE_EMAIL !== 'false';

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a MySQL
const db = require('./db');

// Configuración de Nodemailer
let transporter = null;
if (ENABLE_EMAIL && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
} else {
  console.log('📨 Envío de correos deshabilitado o credenciales faltantes. Se registrarán en consola.');
}

// Inicialización de WhatsApp con persistencia
let client = null;
if (ENABLE_WHATSAPP) {
  client = new Client({
    authStrategy: new LocalAuth({
      dataPath: './.wwebjs_auth'
    }),
    puppeteer: {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ],
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium-browser'
    }
  });
}

let whatsappReady = false;

if (client) {
  client.on('qr', qr => {
    console.log('\n===========================================');
    console.log('📱 ESCANEA ESTE QR CON WHATSAPP:');
    console.log('===========================================\n');
    qrcode.generate(qr, { small: true });
    console.log('\n===========================================');
    console.log('Abre WhatsApp > Dispositivos vinculados > Vincular dispositivo');
    console.log('===========================================\n');
  });

  client.on('authenticated', () => {
    console.log('✅ WhatsApp autenticado correctamente');
  });

  client.on('ready', () => {
    console.log('✅ WhatsApp Web está listo para enviar mensajes');
    whatsappReady = true;
  });

  client.on('auth_failure', msg => {
    console.error('❌ Error de autenticación WhatsApp:', msg);
    whatsappReady = false;
  });

  client.on('disconnected', (reason) => {
    console.log('⚠️  WhatsApp desconectado:', reason);
    whatsappReady = false;
  });

  // Inicializar WhatsApp
  console.log('🔄 Inicializando cliente de WhatsApp...');
  client.initialize().catch(err => {
    console.error('❌ Error al inicializar WhatsApp:', err);
  });
} else {
  console.log('📵 WhatsApp deshabilitado para este entorno.');
}

// Función auxiliar para enviar WhatsApp
async function sendWhatsApp(telefono, mensaje) {
  if (!client) {
    return false;
  }
  if (!whatsappReady) {
    console.log('⚠️  WhatsApp no está listo, mensaje no enviado');
    return false;
  }

  try {
    // Limpiar y formatear número
    let numero = telefono.replace(/\s/g, '').replace(/\+/g, '');
    
    // Si empieza con 0, reemplazar por código de país (595 para Paraguay)
    if (numero.startsWith('0')) {
      numero = '595' + numero.substring(1);
    }
    // Si no tiene código de país, agregarlo
    if (!numero.startsWith('595')) {
      numero = '595' + numero;
    }

    const chatId = numero + '@c.us';
    await client.sendMessage(chatId, mensaje);
    console.log('✅ Mensaje WhatsApp enviado a:', telefono);
    return true;
  } catch (err) {
    console.error('❌ Error enviando WhatsApp:', err.message);
    return false;
  }
}

// Rutas
app.post('/api/appointments', async (req, res) => {
  const { email, nombre_completo, telefono, age, reason, date, time, price } = req.body;

  // Validaciones
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
    return res.status(400).json({ status: 'error', message: 'Teléfono inválido (ejemplo: +595 981 123 456 o 0981 123 456)' });
  }

  try {
    const query = 'INSERT INTO appointments (email, nombre_completo, telefono, age, reason, date, time, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const [result] = await db.execute(query, [email, nombre_completo, telefono, age, reason, date, time, price]);

    // Mensaje de confirmación
    const mensajeConfirmacion = `Hola ${nombre_completo}, tu cita ha sido agendada para ${date} a las ${time}. Precio: ${price}. ¡Gracias por confiar en nosotros!`;

    // Enviar email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Confirmación de Cita - Consultorio Psicológico',
      html: `
        <h2>Confirmación de Cita</h2>
        <p><strong>Hola ${nombre_completo},</strong></p>
        <p>Tu cita ha sido agendada exitosamente:</p>
        <ul>
          <li><strong>Fecha:</strong> ${date}</li>
          <li><strong>Hora:</strong> ${time}</li>
          <li><strong>Motivo:</strong> ${reason}</li>
          <li><strong>Precio:</strong> ${price}</li>
          <li><strong>Teléfono de contacto:</strong> ${telefono}</li>
        </ul>
        <p>¡Gracias por confiar en nosotros!</p>
      `
    };

    if (transporter) {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log('❌ Error enviando email:', error);
        } else {
          console.log('✅ Email enviado:', info.response);
        }
      });
    } else {
      console.log('📨 (Modo desarrollo) Email no enviado, contenido:');
      console.log(mailOptions);
    }

    // Enviar WhatsApp (no bloqueante)
    sendWhatsApp(telefono, mensajeConfirmacion);

    res.status(201).json({ 
      status: 'success', 
      message: 'Cita agendada correctamente', 
      data: { id: result.insertId } 
    });
  } catch (err) {
    console.error('❌ Error guardando cita:', err);
    res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
});

// Ruta de estado de WhatsApp
app.get('/api/whatsapp/status', (req, res) => {
  const status = client ? (whatsappReady ? 'connected' : 'initializing') : 'disabled';
  res.json({
    status,
    ready: whatsappReady,
    enabled: Boolean(client)
  });
});

// Otras rutas - Horarios disponibles (DINÁMICO desde DB)
app.get('/api/available-times/:date', async (req, res) => {
  const { date } = req.params;
  
  try {
    // Obtener horarios activos de la base de datos
    const [slots] = await db.execute(
      'SELECT time_value, time_display, price FROM time_slots WHERE is_active = TRUE ORDER BY time_value ASC'
    );
    
    // Formatear para el frontend
    const times = slots.map(slot => ({
      value: slot.time_value,
      text: `${slot.time_display} - ${slot.price.toFixed(3).replace(/\./g, '.')}`
    }));
    
    res.json(times);
  } catch (error) {
    console.error('Error obteniendo horarios:', error);
    // Fallback a horarios por defecto en caso de error
    const times = [
      { value: "09:00", text: "9:00 AM - $45.000" },
      { value: "10:30", text: "10:30 AM - $45.000" },
      { value: "12:00", text: "12:00 PM - $50.000" },
      { value: "15:00", text: "3:00 PM - $50.000" },
      { value: "16:30", text: "4:30 PM - $55.000" },
      { value: "18:00", text: "6:00 PM - $55.000" }
    ];
    res.json(times);
  }
});

// Ruta para obtener fechas bloqueadas (para el calendario)
app.get('/api/blocked-dates', async (req, res) => {
  try {
    const [dates] = await db.execute('SELECT date FROM blocked_dates');
    const blockedDates = dates.map(d => d.date);
    res.json({ status: 'success', data: blockedDates });
  } catch (error) {
    console.error('Error obteniendo fechas bloqueadas:', error);
    res.json({ status: 'success', data: [] });
  }
});

// Ruta para obtener configuración pública (días bloqueados, etc.)
app.get('/api/config/public', async (req, res) => {
  try {
    const [settings] = await db.execute('SELECT * FROM config_settings');
    const config = {};
    settings.forEach(s => {
      config[s.setting_key] = s.setting_value;
    });
    res.json({ status: 'success', data: config });
  } catch (error) {
    console.error('Error obteniendo configuración pública:', error);
    res.json({ 
      status: 'success', 
      data: { 
        blocked_weekdays: '0,6',
        min_booking_days: '0',
        max_booking_days: '30'
      } 
    });
  }
});

const authRoutes = require('./auth');
const adminRoutes = require('./admin');

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Iniciar servidor
app.listen(PORT, () => {
  const whatsappLog = client
    ? `${whatsappReady ? '✅' : '⏳'} ${whatsappReady ? 'Listo' : 'Inicializando...'}`
    : '🚫 Deshabilitado';

  console.log(`\n✅ Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📊 Estado de servicios:`);
  console.log(`   - Base de datos: ✅ Conectada`);
  console.log(`   - WhatsApp: ${whatsappLog}`);
  console.log(`\n🔗 Endpoints disponibles:`);
  console.log(`   - POST /api/appointments`);
  console.log(`   - GET  /api/whatsapp/status`);
  console.log(`   - GET  /api/available-times/:date\n`);
});
