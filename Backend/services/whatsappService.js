const fs = require('fs/promises');
const path = require('path');
const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const puppeteer = require('puppeteer');
require('dotenv').config();

let client = null;
let whatsappReady = false;
let whatsappEnabled = process.env.ENABLE_WHATSAPP === 'true';

const authPath = path.join(__dirname, '..', '.wapp_sessions');

async function removeLockFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      await removeLockFiles(fullPath);
      continue;
    }

    if (['SingletonLock', 'SingletonSocket', 'SingletonCookie'].includes(entry.name)) {
      try {
        await fs.unlink(fullPath);
        console.log(`🧹 Eliminado lock de WhatsApp: ${fullPath}`);
      } catch (error) {
        console.warn(`⚠️  No se pudo eliminar ${entry.name}: ${error.message}`);
      }
    }
  }
}

async function cleanupAuthLocks() {
  try {
    await removeLockFiles(authPath);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.warn(`⚠️  Limpieza de locks de WhatsApp falló: ${error.message}`);
    }
  }
}

async function loadClient() {
  if (!whatsappEnabled) {
    console.log('📵 WhatsApp deshabilitado por configuración.');
    return;
  }

  await cleanupAuthLocks();

  const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || puppeteer.executablePath();

  client = new Client({
    authStrategy: new LocalAuth({
      dataPath: authPath
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

loadClient().catch((error) => {
  console.error('❌ No se pudo iniciar el cliente de WhatsApp:', error.message);
});

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

async function shutdown() {
  if (client) {
    try {
      await client.destroy();
      console.log('👋 Cliente de WhatsApp cerrado correctamente.');
    } catch (error) {
      console.error('⚠️  Error al cerrar el cliente de WhatsApp:', error.message);
    }
  }
  client = null;
  whatsappReady = false;
}

function getClient() {
  return client;
}

module.exports = {
  sendConfirmationMessage,
  sendReminderMessage,
  scheduleReminderMessage,
  getStatus,
  shutdown,
  getClient
};
