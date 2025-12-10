# Formulario de Agendamiento de Citas - Consultorio Psicológico

Una aplicación web simple y responsiva para agendar citas en un consultorio psicológico. Incluye validaciones, selección de fecha/hora, precios dinámicos y simulación de backend.

## 🚀 Características

- **Formulario Interactivo**: Campos para email, edad, motivo, fecha y hora con validaciones en tiempo real.
- **Selector de Fecha**: Usa Flatpickr para fechas futuras, deshabilitando sábados y domingos.
- **Horarios Dinámicos**: Carga opciones de hora con precios asociados al seleccionar una fecha.
- **Simulación de API**: Funciones simuladas para guardar citas y enviar correos.
- **Persistencia**: Guarda el estado del formulario en LocalStorage.
- **UI Moderna**: Estilos responsivos con Tailwind CSS y animaciones.
- **Accesibilidad**: Diseño adaptable a móviles y desktop.

## 🛠 Tecnologías

- **HTML5**: Estructura de la página.
- **CSS3 + Tailwind CSS**: Estilos y responsividad.
- **JavaScript (ES6+)**: Lógica del formulario y eventos.
- **Librerías**: Flatpickr (fechas), Font Awesome (íconos).

## 📁 Estructura del Proyecto/ 
├── index.html # Página principal HTML 
├── estilos.css # Estilos personalizados 
├── script.js # Lógica JavaScript └── README.md # Esta documentación


## 🔧 Instalación y Uso

1. **Clona o descarga** los archivos en una carpeta local.
2. **Abre `index.php`** en un navegador web moderno.
3. **Llena el formulario**:
   - Ingresa datos válidos (email, edad >=18, motivo).
   - Selecciona una fecha (solo días hábiles).
   - Elige una hora para ver el precio.
4. **Envía** para simular el agendamiento (verás carga y resumen).
5. **Reinicia** con el botón "Agendar otra cita".

### Pruebas
- Verifica validaciones: Campos vacíos o inválidos muestran errores.
- Persistencia: Recarga la página y el formulario se restaura.
- Consola: Abre DevTools para logs de errores.

## 📝 Correcciones Aplicadas
- **Sintaxis**: Corregido template literal en resumen de edad.
- **Fechas**: Deshabilita sábados y domingos.
- **Timing**: `fetchAvailableTimes` ahora es asíncrona para evitar race conditions.
- **Validaciones**: Mejorada extracción de precios y reinicio completo.
- **Errores**: Manejo robusto en envío del formulario.

## 🤝 Contribución
- Forkea el repo y envía pull requests.
- Reporta bugs o sugerencias en issues.

## 📄 Licencia
MIT License - Úsalo libremente.

---

**Desarrollado para fines educativos. ¡Mejora la salud mental con tecnología!** 🧠