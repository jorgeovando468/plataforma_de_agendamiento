const token = localStorage.getItem('token');
const API_BASE = 'http://localhost:3000/api/admin';

if (!token) {
    window.location.href = 'login.html';
}

// ==========================================
// UTILIDADES
// ==========================================

function updateDateTime() {
    const now = new Date();
    document.getElementById('current-time').textContent = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    document.getElementById('current-date').textContent = now.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
}
setInterval(updateDateTime, 1000);
updateDateTime();

function logout() {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
}

async function apiRequest(url, options = {}) {
    const response = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    return response.json();
}

// ==========================================
// CITAS
// ==========================================

async function loadCitas() {
    try {
        const data = await apiRequest(`${API_BASE}/citas`);
        if (data.status !== 'success') throw new Error(data.message);

        const citas = data.data || [];
        citas.sort((a, b) => b.id - a.id);

        // Actualizar estadísticas
        const hoy = new Date().toISOString().split('T')[0];
        const citasHoy = citas.filter(c => c.fecha === hoy);
        document.getElementById('stat-citas-hoy').textContent = citasHoy.length;
        document.getElementById('stat-confirmadas').textContent = citas.filter(c => c.estado === 'confirmada').length;
        document.getElementById('stat-pendientes').textContent = citas.filter(c => c.estado === 'pendiente').length;
        document.getElementById('stat-canceladas').textContent = citas.filter(c => c.estado === 'cancelada').length;

        // Tabla de citas
        const tbody = document.getElementById('citasTable');
        tbody.innerHTML = citas.length === 0 ? '<tr><td colspan="6" class="text-center text-muted">No hay citas registradas</td></tr>' : '';

        citas.forEach(cita => {
            const estadoBadge = {
                'confirmada': 'success',
                'cancelada': 'danger',
                'pendiente': 'warning'
            }[cita.estado?.toLowerCase()] || 'secondary';

            const row = `
                <tr>
                    <td>${cita.id}</td>
                    <td><strong>${cita.paciente}</strong><br><small class="text-muted">${cita.email}</small></td>
                    <td>${cita.fecha}</td>
                    <td>${cita.hora?.slice(0, 5) || '--'}</td>
                    <td><span class="badge bg-${estadoBadge}">${cita.estado?.toUpperCase()}</span></td>
                    <td>
                        <button class="btn btn-sm btn-success me-1" onclick="confirmarCita(${cita.id})" ${cita.estado === 'confirmada' ? 'disabled' : ''}><i class="fas fa-check"></i></button>
                        <button class="btn btn-sm btn-info me-1" onclick="reprogramarCita(${cita.id}, '${cita.fecha}', '${cita.hora}')"><i class="fas fa-calendar-alt"></i></button>
                        <button class="btn btn-sm btn-warning me-1" onclick="cancelarCita(${cita.id})" ${cita.estado === 'cancelada' ? 'disabled' : ''}><i class="fas fa-times"></i></button>
                        <button class="btn btn-sm btn-danger" onclick="eliminarCita(${cita.id})"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });

        // Próximas citas (Dashboard)
        const proximasDiv = document.getElementById('proximas-citas');
        const proximas = citas.filter(c => new Date(c.fecha) >= new Date() && c.estado !== 'cancelada').slice(0, 5);
        proximasDiv.innerHTML = proximas.length === 0 ? '<p class="text-muted">No hay citas próximas</p>' : `
            <table class="table table-sm">
                <thead><tr><th>Paciente</th><th>Fecha</th><th>Hora</th><th>Estado</th></tr></thead>
                <tbody>${proximas.map(c => `<tr><td>${c.paciente}</td><td>${c.fecha}</td><td>${c.hora?.slice(0,5)}</td><td><span class="badge bg-${c.estado === 'confirmada' ? 'success' : 'warning'}">${c.estado}</span></td></tr>`).join('')}</tbody>
            </table>
        `;
    } catch (error) {
        Swal.fire('Error', error.message, 'error');
    }
}

async function confirmarCita(id) {
    const result = await Swal.fire({
        title: '¿Confirmar cita?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#16a34a',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Sí, confirmar'
    });
    if (!result.isConfirmed) return;

    try {
        const data = await apiRequest(`${API_BASE}/citas/${id}/confirmar`, { method: 'PUT' });
        Swal.fire('¡Confirmada!', data.message, 'success');
        loadCitas();
    } catch (error) {
        Swal.fire('Error', error.message, 'error');
    }
}

async function cancelarCita(id) {
    const result = await Swal.fire({
        title: '¿Cancelar cita?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#f59e0b',
        cancelButtonText: 'No',
        confirmButtonText: 'Sí, cancelar'
    });
    if (!result.isConfirmed) return;

    try {
        const data = await apiRequest(`${API_BASE}/citas/${id}/cancelar`, { method: 'PUT' });
        Swal.fire('Cancelada', data.message, 'success');
        loadCitas();
    } catch (error) {
        Swal.fire('Error', error.message, 'error');
    }
}

function reprogramarCita(id, fecha, hora) {
    document.getElementById('citaIdDisplay').textContent = id;
    document.getElementById('citaIdInput').value = id;
    document.getElementById('nuevaFecha').value = fecha;
    document.getElementById('nuevaHora').value = hora?.slice(0, 5) || '';
    new bootstrap.Modal(document.getElementById('reprogramarModal')).show();
}

document.getElementById('reprogramarForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('citaIdInput').value;
    const fecha = document.getElementById('nuevaFecha').value;
    const hora = document.getElementById('nuevaHora').value;

    try {
        const data = await apiRequest(`${API_BASE}/citas/${id}/reprogramar`, {
            method: 'PUT',
            body: JSON.stringify({ fecha, hora })
        });
        bootstrap.Modal.getInstance(document.getElementById('reprogramarModal')).hide();
        Swal.fire('¡Reprogramada!', data.message, 'success');
        loadCitas();
    } catch (error) {
        Swal.fire('Error', error.message, 'error');
    }
});

async function eliminarCita(id) {
    const result = await Swal.fire({
        title: '¿Eliminar cita?',
        text: 'Esta acción no se puede deshacer',
        icon: 'error',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Sí, eliminar'
    });
    if (!result.isConfirmed) return;

    try {
        const data = await apiRequest(`${API_BASE}/citas/${id}`, { method: 'DELETE' });
        Swal.fire('Eliminada', data.message, 'success');
        loadCitas();
    } catch (error) {
        Swal.fire('Error', error.message, 'error');
    }
}

// ==========================================
// HORARIOS Y PRECIOS
// ==========================================

async function loadTimeSlots() {
    try {
        const data = await apiRequest(`${API_BASE}/time-slots`);
        if (data.status !== 'success') throw new Error(data.message);

        const slots = data.data || [];
        const tbody = document.getElementById('timeSlotsTable');
        tbody.innerHTML = slots.length === 0 ? '<tr><td colspan="6" class="text-center text-muted">No hay horarios configurados</td></tr>' : '';

        slots.forEach(slot => {
            const row = `
                <tr>
                    <td>${slot.id}</td>
                    <td>${slot.time_value}</td>
                    <td>${slot.time_display}</td>
                    <td>Gs. ${parseFloat(slot.price).toFixed(3)}</td>
                    <td><span class="badge bg-${slot.is_active ? 'success' : 'secondary'}">${slot.is_active ? 'Activo' : 'Inactivo'}</span></td>
                    <td>
                        <button class="btn btn-sm btn-primary me-1" onclick="editTimeSlot(${slot.id}, '${slot.time_value}', '${slot.time_display}', ${slot.price}, ${slot.is_active})"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-sm btn-danger" onclick="deleteTimeSlot(${slot.id})"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    } catch (error) {
        Swal.fire('Error', error.message, 'error');
    }
}

function openAddTimeSlotModal() {
    document.getElementById('timeSlotForm').reset();
    document.getElementById('slot_id').value = '';
    document.querySelector('#timeSlotModal .modal-title').textContent = 'Agregar Horario';
    new bootstrap.Modal(document.getElementById('timeSlotModal')).show();
}

function editTimeSlot(id, time_value, time_display, price, is_active) {
    document.getElementById('slot_id').value = id;
    document.getElementById('slot_time_value').value = time_value;
    document.getElementById('slot_time_display').value = time_display;
    document.getElementById('slot_price').value = parseFloat(price);
    document.getElementById('slot_is_active').checked = is_active;
    document.querySelector('#timeSlotModal .modal-title').textContent = 'Editar Horario';
    new bootstrap.Modal(document.getElementById('timeSlotModal')).show();
}

document.getElementById('timeSlotForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('slot_id').value;
    const body = {
        time_value: document.getElementById('slot_time_value').value,
        time_display: document.getElementById('slot_time_display').value,
        price: parseFloat(document.getElementById('slot_price').value),
        is_active: document.getElementById('slot_is_active').checked
    };

    try {
        const url = id ? `${API_BASE}/time-slots/${id}` : `${API_BASE}/time-slots`;
        const method = id ? 'PUT' : 'POST';
        const data = await apiRequest(url, { method, body: JSON.stringify(body) });
        
        bootstrap.Modal.getInstance(document.getElementById('timeSlotModal')).hide();
        Swal.fire('¡Guardado!', data.message, 'success');
        loadTimeSlots();
    } catch (error) {
        Swal.fire('Error', error.message, 'error');
    }
});

async function deleteTimeSlot(id) {
    const result = await Swal.fire({
        title: '¿Eliminar horario?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        confirmButtonText: 'Sí, eliminar'
    });
    if (!result.isConfirmed) return;

    try {
        const data = await apiRequest(`${API_BASE}/time-slots/${id}`, { method: 'DELETE' });
        Swal.fire('Eliminado', data.message, 'success');
        loadTimeSlots();
    } catch (error) {
        Swal.fire('Error', error.message, 'error');
    }
}

// ==========================================
// FECHAS BLOQUEADAS
// ==========================================

async function loadBlockedDates() {
    try {
        const data = await apiRequest(`${API_BASE}/blocked-dates`);
        if (data.status !== 'success') throw new Error(data.message);

        const dates = data.data || [];
        const tbody = document.getElementById('blockedDatesTable');
        tbody.innerHTML = dates.length === 0 ? '<tr><td colspan="4" class="text-center text-muted">No hay fechas bloqueadas</td></tr>' : '';

        dates.forEach(date => {
            const row = `
                <tr>
                    <td>${date.id}</td>
                    <td>${date.date}</td>
                    <td>${date.reason || 'No especificado'}</td>
                    <td><button class="btn btn-sm btn-danger" onclick="deleteBlockedDate(${date.id})"><i class="fas fa-trash"></i></button></td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    } catch (error) {
        Swal.fire('Error', error.message, 'error');
    }
}

function openAddBlockedDateModal() {
    document.getElementById('blockedDateForm').reset();
    new bootstrap.Modal(document.getElementById('blockedDateModal')).show();
}

document.getElementById('blockedDateForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = {
        date: document.getElementById('blocked_date').value,
        reason: document.getElementById('blocked_reason').value
    };

    try {
        const data = await apiRequest(`${API_BASE}/blocked-dates`, {
            method: 'POST',
            body: JSON.stringify(body)
        });
        bootstrap.Modal.getInstance(document.getElementById('blockedDateModal')).hide();
        Swal.fire('¡Bloqueada!', data.message, 'success');
        loadBlockedDates();
    } catch (error) {
        Swal.fire('Error', error.message, 'error');
    }
});

async function deleteBlockedDate(id) {
    const result = await Swal.fire({
        title: '¿Desbloquear fecha?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, desbloquear'
    });
    if (!result.isConfirmed) return;

    try {
        const data = await apiRequest(`${API_BASE}/blocked-dates/${id}`, { method: 'DELETE' });
        Swal.fire('Desbloqueada', data.message, 'success');
        loadBlockedDates();
    } catch (error) {
        Swal.fire('Error', error.message, 'error');
    }
}

// ==========================================
// CONFIGURACIÓN
// ==========================================

async function loadConfig() {
    try {
        const data = await apiRequest(`${API_BASE}/settings`);
        if (data.status !== 'success') throw new Error(data.message);

        const config = data.data || {};
        document.getElementById('min_booking_days').value = config.min_booking_days || 0;
        document.getElementById('max_booking_days').value = config.max_booking_days || 30;
        document.getElementById('blocked_weekdays').value = config.blocked_weekdays || '0,6';
    } catch (error) {
        console.error('Error cargando configuración:', error);
    }
}

document.getElementById('configForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = {
        min_booking_days: document.getElementById('min_booking_days').value,
        max_booking_days: document.getElementById('max_booking_days').value,
        blocked_weekdays: document.getElementById('blocked_weekdays').value
    };

    try {
        const data = await apiRequest(`${API_BASE}/settings`, {
            method: 'PUT',
            body: JSON.stringify(body)
        });
        Swal.fire('¡Guardado!', data.message, 'success');
    } catch (error) {
        Swal.fire('Error', error.message, 'error');
    }
});

// ==========================================
// INICIALIZACIÓN
// ==========================================

loadCitas();
loadTimeSlots();
loadBlockedDates();
loadConfig();