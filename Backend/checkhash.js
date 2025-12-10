// checkHash.js
const bcrypt = require('bcrypt');
const hash = '$2b$10$FiQm761qQ0BnaODHwg4g3Ok8/JUrSSKCf4M0.NWhKjbD3Ki3KGbxW'; // reemplaza por tu hash real si es otro
const candidates = ['admin', '123456', 'contraseña', 'admin123']; // prueba tus contraseñas comunes

(async () => {
  for (const p of candidates) {
    const ok = await bcrypt.compare(p, hash);
    console.log(p, '=>', ok);
  }
})();
