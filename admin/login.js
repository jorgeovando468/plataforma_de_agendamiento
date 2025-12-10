// login.js
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const usuario = document.getElementById('usuario').value;
    const contrasena = document.getElementById('contraseña').value;
    const messageEl = document.getElementById('message');

    try {
        // Enviar la contraseña en la clave 'contrasena' (sin tilde) para evitar problemas de encoding
        const response = await fetch('http://localhost:3000/api/auth/login', {  // Ajusta la URL si es diferente
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario, contrasena })
        });
        const data = await response.json();

        if (data.status === 'success') {
            localStorage.setItem('token', data.data.token);  // Guardar token
            window.location.href = 'panel.html';  // Redirigir al panel (cambiado de .php a .html)
        } else {
            messageEl.textContent = data.message;
        }
    } catch (error) {
        messageEl.textContent = 'Error de conexión.';
    }
});