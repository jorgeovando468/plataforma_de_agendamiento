# Plataforma de Agendamiento

Aplicación completa para gestionar citas de un consultorio psicológico. Incluye un frontend estático servido por Nginx, un backend en Node.js/Express con MySQL y un panel administrativo.

## 🧭 Componentes
- **Frontend** (`Frontend/`): HTML/CSS/JS estático con Nginx (puerto 80).
- **Backend** (`Backend/`): API REST en Express que maneja reservas, correos y (opcional) WhatsApp (puerto 3000).
- **Base de datos** (`db/`): MySQL 8.0 con esquema y datos de ejemplo en `db/init.sql`.
- **Panel admin** (`admin/`): HTML/JS estático para gestionar citas (se puede servir con cualquier servidor estático).

## 🔧 Prerrequisitos
- Docker y Docker Compose.
- Node.js 18+ y npm (solo si quieres correr sin contenedores).

## 🚀 Pasos rápidos con Docker Compose (recomendado)
1. Clona el repositorio y entra en la carpeta:
   ```bash
   git clone <repo_url>
   cd plataforma_de_agendamiento
   ```
2. Copia el entorno del backend y ajusta valores según necesidad:
   ```bash
   cd Backend
   cp .env.example .env
   # Ajusta credenciales de email/WhatsApp si los usarás.
   cd ..
   ```
   Variables clave:
   - `ENABLE_WHATSAPP` (`false` por defecto) evita lanzar Chromium en desarrollo.
   - `ENABLE_EMAIL` (`true` por defecto) usa nodemailer; en `false` solo registra en consola.
   - `DB_*` ya apunta al contenedor `db` que levanta `docker-compose.yml`.
3. Levanta los servicios (desde la raíz del repo):
   ```bash
   docker compose up -d db backend frontend
   ```
   Si recibes un error de **"container name ... is already in use"**, limpia contenedores previos con:
   ```bash
   docker compose down               # detiene el stack actual
   docker rm -f consultorio-frontend consultorio-db 2>/dev/null || true
   docker compose up -d db backend frontend
   ```
   Si el contenedor **db** aparece como `unhealthy`:
   ```bash
   docker compose logs -f db                   # revisa el motivo (por ejemplo, tiempo de inicio lento)
   docker compose down -v                      # detiene servicios y borra el volumen db_data
   docker compose up -d db backend frontend    # recrea MySQL con los datos de ejemplo
   ```
4. Comprueba que el backend inició correctamente:
   ```bash
   docker compose logs -f backend
   ```
   Verás mensajes de conexión a MySQL y el estado de WhatsApp/Email.
5. Accede a la aplicación:
   - Frontend público: http://localhost (servido por Nginx).
   - API: http://localhost:3000 (por ejemplo `GET /api/available-times/2025-01-01`).
6. (Opcional) Panel admin estático: sirve la carpeta `admin/` con cualquier servidor estático, por ejemplo:
   ```bash
   npx serve admin -l 8080
   ```
   Ajusta las URLs dentro de `admin/` si tu backend corre en otra dirección.

### Puertos y volúmenes
- **80**: Frontend (Nginx) apuntando a `Frontend/`.
- **3000**: Backend Express.
- **3307**: MySQL (mapeado al 3306 interno del contenedor `db`).
- Volúmenes: `db_data` (persistencia MySQL) y `whatsapp_session` (sesiones de WhatsApp Web).

### Credenciales y datos de ejemplo
- Base de datos se inicializa con `db/init.sql` (appointments y usuarios admin de muestra).
- Usuario admin de ejemplo: `admin` con contraseña ya hasheada en la tabla `admin`.

## 🧪 Ejecución manual sin Docker
1. **Base de datos**: instala MySQL local, crea la base y carga el esquema:
   ```bash
   mysql -u root -p < db/init.sql
   ```
2. **Backend**:
   ```bash
   cd Backend
   cp .env.example .env
   # Ajusta DB_HOST/USER/PASSWORD/NAME a tu instancia local
   npm install
   npm run dev   # o npm start
   ```
3. **Frontend**: sirve la carpeta estática `Frontend/` con el servidor que prefieras (ej.: `npx serve Frontend -l 8080`) o abre `index.html` directamente.
4. **Panel admin**: igual que el frontend, sirve `admin/` de forma estática.

## ❓ Preguntas frecuentes (XAMPP, puertos y MySQL)
- **¿Necesito XAMPP para usar MySQL?** No. Con `docker compose up` ya se levanta MySQL dentro del contenedor `db`; XAMPP no es necesario y puede quedarse apagado. Solo usa MySQL de XAMPP si decides ejecutar el backend sin Docker y apuntas `DB_HOST/DB_PORT` a esa instancia.
- **Apache de XAMPP muestra "Port 80 in use"**: el contenedor `frontend` usa el puerto 80 por defecto. Para liberar el puerto, detén los contenedores con `docker compose down`. Si necesitas correr ambos, cambia el puerto de Apache en el panel de XAMPP (p.ej. 8081) o edita `docker-compose.yml` para mapear `frontend` a otro puerto externo (p.ej. `8080:80`).
- **Conflicto con el puerto de MySQL**: el contenedor expone MySQL en el puerto 3307 del host. Si tienes MySQL local en 3306 (como el de XAMPP), no debería haber choque. Si cambias el puerto de XAMPP o quieres usarlo, ajusta `DB_PORT` en `Backend/.env` para que coincida.

## 🔍 Comandos útiles
- Detener servicios Docker: `docker compose down`
- Reconstruir contenedores tras cambios en código backend: `docker compose build backend && docker compose up -d backend`
- Probar estado de WhatsApp: `curl http://localhost:3000/api/whatsapp/status`

## 🤝 Contribución
- Haz fork, crea una rama y envía PRs.
- Por favor no subas archivos `.env` ni credenciales reales.

## 📄 Licencia
MIT License.
