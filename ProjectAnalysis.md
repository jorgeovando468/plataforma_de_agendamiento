# Informe de análisis del proyecto de agendamiento

## Estructura general
- **Backend (./Backend):** API Node/Express con integración a MySQL, correos (Gmail) y WhatsApp Web.
- **Frontend (./Frontend):** Landing + formulario HTML/JS/CSS servidos por Nginx según docker-compose; el `package.json` declara scripts Next.js/React que no se usan en los assets actuales.
- **Infraestructura:** Docker Compose levanta MySQL, backend y frontend estático; incluye volumen para sesión de WhatsApp y monta SQL de inicialización.

## Dependencias clave
- **Backend:** Express 5, mysql2, bcrypt, jsonwebtoken, nodemailer y whatsapp-web.js; nodemon para desarrollo.
- **Frontend:** Declara Next 16/React 19 pero el código real es estático (Bootstrap, Flatpickr, Font Awesome en CDN).

## Comportamiento y funcionalidades
- La API expone `/api/appointments` para validar y guardar citas en MySQL, envía correo de confirmación y dispara mensaje de WhatsApp no bloqueante.
- Endpoints adicionales: `/api/available-times/:date` (horarios desde tabla `time_slots` con fallback), `/api/blocked-dates` (fechas bloqueadas) y `/api/config/public` (config pública con valores por defecto en caso de error).
- Estado de WhatsApp expuesto en `/api/whatsapp/status`; el cliente se inicializa con `LocalAuth` y Chromiun headless.

## Observaciones de correctitud/operatividad
- **Credenciales incrustadas:** `docker-compose.yml` expone usuario/contraseña de Gmail y DB, y monta `.env`; deben moverse a variables seguras.
- **Requisitos externos:** El backend necesita MySQL, acceso a Gmail SMTP y un navegador compatible (Chromium) para WhatsApp; sin ellos los endpoints de cita fallarán.
- **Desalineación frontend:** Los assets son HTML/JS estáticos, pero el `package.json` sugiere Next.js; los comandos `npm run dev/build/start` no sirven para el código actual.
- **Cobertura de pruebas:** No hay scripts de test en frontend y el backend sólo devuelve un placeholder, por lo que no existe verificación automatizada.

## Estado de pruebas locales
- No se ejecutaron pruebas automatizadas porque el proyecto no define suites; se recomienda agregar tests o healthchecks básicos antes de desplegar.
