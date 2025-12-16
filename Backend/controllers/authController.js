const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
require('dotenv').config();

async function login(req, res, next) {
  const usuario = req.body.usuario || req.body.user;
  const contrasena = req.body.contrasena || req.body.password || req.body['contraseña'];

  if (!usuario || !contrasena) {
    return res.status(400).json({ status: 'error', message: 'Usuario y contraseña son requeridos.' });
  }

  try {
    const [rows] = await db.execute('SELECT * FROM admin WHERE usuario = ?', [usuario]);

    if (!rows || rows.length === 0) {
      return res.status(401).json({ status: 'error', message: 'Credenciales inválidas.' });
    }

    const admin = rows[0];
    let storedHash = admin.contrasena || admin['contraseña'] || admin.password || admin.contraseña;
    if (!storedHash) {
      const maybe = Object.values(admin).find((v) => typeof v === 'string' && v.startsWith('$2'));
      storedHash = maybe || null;
    }

    if (!storedHash) {
      return res.status(500).json({ status: 'error', message: 'Error interno: sin hash de contraseña.' });
    }

    if (storedHash.startsWith('$2y$')) {
      storedHash = storedHash.replace('$2y$', '$2b$');
    }

    const isValidPassword = await bcrypt.compare(contrasena, storedHash);
    if (!isValidPassword) {
      return res.status(401).json({ status: 'error', message: 'Credenciales inválidas.' });
    }

    const token = jwt.sign({ id: admin.id, usuario: admin.usuario }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ status: 'success', message: 'Login exitoso.', data: { token } });
  } catch (error) {
    next(error);
  }
}

module.exports = { login };
