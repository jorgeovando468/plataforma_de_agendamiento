const path = require('path');
const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const puppeteer = require('puppeteer');
require('dotenv').config();

let client = null;
let whatsappReady = false;
let whatsappEnabled = process.env.ENABLE_WHATSAPP === 'true';

function loadClient() {
  if (!whatsappEnabled) {
    console.log('📵 WhatsApp deshabilitado por configuración.');
    return;
  }

  const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || puppeteer.executablePath();

  client = new Client({
    authStrategy: new LocalAuth({
      dataPath: path.join(__dirname, '..', '.wapp_sessions')
    }),
    puppeteer: {
      headless: true,
      executablePath,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
      timeout: Number(process.env.WHATSAPP_LAUNCH_TIMEOUT_MS || 60000)
    }
  });

  client.on('qr', (qr) => {
    console.log('\n===========================================');
    console.log('📱 ESCANEA ESTE QR CON WHATSAPP:');
    console.log('===========================================\n');
    qrcode.generate(qr, { small: true });
    console.log('\n===========================================');
    console.log('Abre WhatsApp > Dispositivos vinculados > Vincular dispositivo');
    console.log('===========================================\n');
  });

  client.on('ready', () => {
    whatsappReady = true;
    console.log('✅ WhatsApp listo para enviar mensajes');
  });

  client.on('disconnected', (reason) => {
    whatsappReady = false;
    console.log('⚠️  WhatsApp desconectado:', reason);
  });

  client.on('auth_failure', (msg) => {
    whatsappReady = false;
    console.error('❌ Error de autenticación WhatsApp:', msg);
  });

  client.initialize().catch((err) => {
    whatsappReady = false;
    whatsappEnabled = false;
    console.error('❌ Error al inicializar WhatsApp:', err.message);
    console.error('ℹ️ Verifica que Chromium/Chrome esté instalado y accesible en:', executablePath);
    console.error('ℹ️ Si estás en Docker, asegúrate de rebuildear la imagen para instalar chromium.');
  });
}

loadClient();

function formatPhone(telefono) {
  let numero = telefono.replace(/\s/g, '').replace(/\+/g, '');
  if (numero.startsWith('0')) {
    numero = '595' + numero.substring(1);
  }
  if (!numero.startsWith('595')) {
    numero = '595' + numero;
  }
  return `${numero}@s.whatsapp.net`;
}

async function sendMessage(telefono, mensaje) {
  if (!whatsappEnabled || !client) {
    console.log('📵 WhatsApp no habilitado. Mensaje simulado:', mensaje);
    return false;
  }

  if (!whatsappReady) {
    console.log('⏳ WhatsApp aún no está listo. Mensaje en cola virtual.');
    return false;
  }

  const chatId = formatPhone(telefono);
  try {
    if (typeof client.sendMessage === 'function') {
      await client.sendMessage(chatId, mensaje);
    } else if (typeof client.sendText === 'function') {
      await client.sendText(chatId, mensaje);
    } else {
      throw new Error('Método de envío no disponible en el cliente de WhatsApp');
    }
    console.log(`✅ Mensaje enviado a ${telefono}`);
    return true;
  } catch (error) {
    console.error('❌ Error enviando WhatsApp:', error.message);
    return false;
  }
}

async function sendConfirmationMessage(paciente, fecha, hora) {
  const mensaje = `Hola ${paciente.nombre_completo}, tu cita ha sido agendada para ${fecha} a las ${hora}. Precio: ${paciente.price || ''}. ¡Gracias por confiar en nosotros!`;
  return sendMessage(paciente.telefono, mensaje);
}

async function sendReminderMessage(paciente, fecha, hora) {
  const mensaje = `Recordatorio: tienes una cita el ${fecha} a las ${hora}. Si necesitas reprogramar, contáctanos.`;
  return sendMessage(paciente.telefono, mensaje);
}

function scheduleReminderMessage(paciente, fecha, hora) {
  const appointmentDateTime = new Date(`${fecha}T${hora}:00`);
  const reminderDateTime = new Date(appointmentDateTime.getTime() - 2 * 60 * 60 * 1000);
  const delay = reminderDateTime.getTime() - Date.now();

  if (isNaN(delay)) {
    console.error('❌ No se pudo programar recordatorio, fecha/hora inválida');
    return;
  }

  if (delay <= 0) {
    sendReminderMessage(paciente, fecha, hora);
    return;
  }

  setTimeout(() => {
    sendReminderMessage(paciente, fecha, hora);
  }, delay);
}

function getStatus() {
  return {
    enabled: whatsappEnabled,
    ready: whatsappReady,
    initialized: Boolean(client)
  };
}

module.exports = {
  sendConfirmationMessage,
  sendReminderMessage,
  scheduleReminderMessage,
  getStatus
};
