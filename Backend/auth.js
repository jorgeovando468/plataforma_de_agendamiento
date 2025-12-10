// auth.js (corregido)
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./db');
require('dotenv').config();

const router = express.Router();

/**
 * POST /api/auth/login
 * Autentica al administrador.
 * Body: { usuario: string, contraseña: string }
 * Respuesta: { status, message, data: { token } } o error.
 */

router.post('/login', async (req, res) => {
    // Aceptar varias formas del campo contraseña para evitar problemas de encoding
    const usuario = req.body.usuario || req.body.user;
    const contrasena = req.body.contrasena || req.body.password || req.body['contraseña'];
    console.log('LOGIN - req.body =', req.body); // ver qué envía el cliente

    if (!usuario || !contrasena) {
        return res.status(400).json({ status: 'error', message: 'Usuario y contraseña son requeridos.' });
    }

    try {
        const [rows] = await db.execute('SELECT * FROM admin WHERE usuario = ?', [usuario]);
        console.log('LOGIN - filas devueltas por la BD:', rows);

        if (!rows || rows.length === 0) {
            return res.status(401).json({ status: 'error', message: 'Credenciales inválidas.' });
        }

        const admin = rows[0];

        // Verificar contraseña con bcrypt
        let storedHash = admin.contrasena || admin['contraseña'] || admin.password || admin.contraseña;
        if (!storedHash) {
            const maybe = Object.values(admin).find((v) => typeof v === 'string' && v.startsWith('$2'));
            storedHash = maybe || null;
        }

        console.log('LOGIN - storedHash (masked):', storedHash ? `${storedHash.slice(0, 7)}...` : storedHash);

        if (!storedHash) {
            console.error('LOGIN - no se encontró campo de hash en la fila admin:', Object.keys(admin));
            return res.status(500).json({ status: 'error', message: 'Error interno: sin hash de contraseña.' });
        }

        if (storedHash.startsWith('$2y$')) {
            storedHash = storedHash.replace('$2y$', '$2b$');
        }

        const isValidPassword = await bcrypt.compare(contrasena, storedHash);
        console.log('LOGIN - isValidPassword =', isValidPassword);
        if (!isValidPassword) {
            return res.status(401).json({ status: 'error', message: 'Credenciales inválidas.' });
        }

        const token = jwt.sign({ id: admin.id, usuario: admin.usuario }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ status: 'success', message: 'Login exitoso.', data: { token } });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor.' });
    }
});

module.exports = router;