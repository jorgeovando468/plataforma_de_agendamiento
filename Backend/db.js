// db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

let pool = null;

async function createConnection(retries = 10, delay = 5000) {
  for (let i = 0; i < retries; i++) {
    try {
      pool = mysql.createPool({
        host: process.env.DB_HOST || 'db',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'admin123',
        database: process.env.DB_NAME || 'consultorio_psicologico',
        port: 3306,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      });

      // Verificar la conexión haciendo una consulta de prueba
      const connection = await pool.getConnection();
      await connection.query('SELECT 1');
      console.log('✅ Conectado a MySQL exitosamente');
      connection.release();
      return pool;
    } catch (error) {
      console.log(`⚠️  Intento ${i + 1}/${retries} - Esperando MySQL...`);
      console.log(`   Error: ${error.message}`);
      
      if (i === retries - 1) {
        console.error('❌ No se pudo conectar a MySQL después de varios intentos');
        throw error;
      }
      
      // Esperar antes de reintentar
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Iniciar la conexión inmediatamente
createConnection().catch(err => {
  console.error('❌ Error fatal de base de datos:', err);
  process.exit(1);
});

// Exportar métodos que esperan a que el pool esté listo
module.exports = {
  execute: async (...args) => {
    if (!pool) {
      await createConnection();
    }
    return pool.execute(...args);
  },
  query: async (...args) => {
    if (!pool) {
      await createConnection();
    }
    return pool.query(...args);
  },
  getConnection: async () => {
    if (!pool) {
      await createConnection();
    }
    return pool.getConnection();
  }
};