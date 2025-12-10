// middleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config();  // Cargar variables de entorno

/**
 * Middleware para verificar el token JWT.
 * Extrae el token del header 'Authorization' (formato: Bearer <token>).
 * Si es válido, añade el payload del token a req.user.
 * Si no, devuelve error 401.
 */
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];  // Extraer token después de 'Bearer '

    if (!token) {
        return res.status(401).json({ status: 'error', message: 'Acceso denegado. Token no proporcionado.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ status: 'error', message: 'Token inválido.' });
        }
        req.user = user;  // Guardar datos del usuario en req.user
        next();
    });
};

module.exports = { verifyToken };