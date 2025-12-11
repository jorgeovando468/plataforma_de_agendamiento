// Script principal para el formulario de agendamiento de citas
document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos DOM
    const appointmentForm = document.getElementById('appointment-form');
    const formContainer = document.getElementById('appointment-form-container');
    const loadingState = document.getElementById('loading-state');
    const appointmentSummary = document.getElementById('appointment-summary');
    const priceContainer = document.getElementById('price-container');
    const priceDisplay = document.getElementById('price-display');
    const dateInput = document.getElementById('date');
    const timeSelect = document.getElementById('time');
    const emailInput = document.getElementById('email');
    const ageInput = document.getElementById('age');
    const reasonInput = document.getElementById('reason');
    const emailError = document.getElementById('email-error');
    const ageError = document.getElementById('age-error');
    const newAppointmentBtn = document.getElementById('new-appointment');
    const nombreCompletoInput = document.getElementById('nombre_completo');
    const telefonoInput = document.getElementById('telefono');

    // Resumen de la cita
    const summaryEmail = document.getElementById('summary-email');
    const summaryAge = document.getElementById('summary-age');
    const summaryReason = document.getElementById('summary-reason');
    const summaryDate = document.getElementById('summary-date');
    const summaryTime = document.getElementById('summary-time');
    const summaryPrice = document.getElementById('summary-price');
    const summaryNombreCompleto = document.getElementById('summary-nombre_completo');
    const summaryTelefono = document.getElementById('summary-telefono');

    const api = window.apiService;

    // Variables de configuración dinámica
    let blockedWeekdays = [0, 6]; // Por defecto: Domingos y Sábados
    let blockedDates = [];
    let datePicker;

    // Cargar configuración dinámica desde el backend
    async function loadPublicConfig() {
        try {
            const config = await api.getPublicConfig();
            blockedWeekdays = config.blocked_weekdays?.split(',').map(d => parseInt(d.trim())) || [0, 6];

            const dates = await api.getAvailableDates();
            blockedDates = dates || [];
        } catch (error) {
            console.error('⚠️  Error cargando configuración:', error);
            // Usar valores por defecto en caso de error
        }
    }

    // Inicializar Flatpickr después de cargar configuración
    async function initializeDatePicker() {
        await loadPublicConfig();

        const fpConfig = {
            enableTime: false,
            dateFormat: "Y-m-d",
            minDate: "today",
            locale: "es",
            disableMobile: true,
            disable: [
                function(date) {
                    // Deshabilitar días de la semana configurados
                    if (blockedWeekdays.includes(date.getDay())) return true;
                    
                    // Deshabilitar fechas específicas bloqueadas
                    const dateStr = date.toISOString().split('T')[0];
                    return blockedDates.includes(dateStr);
                }
            ],
            onChange: function(selectedDates, dateStr) {
                if (dateStr) {
                    fetchAvailableTimes(dateStr);
                }
            }
        };
        
        datePicker = flatpickr(dateInput, fpConfig);
    }

    // Inicializar el selector de fecha
    initializeDatePicker();

    // Restaurar estado desde LocalStorage
    restoreFormState();

    // Función para obtener horarios disponibles dinámicamente
    async function fetchAvailableTimes(date) {
        return new Promise(async (resolve) => {
            timeSelect.disabled = true;
            timeSelect.innerHTML = '<option value="">Cargando horarios disponibles...</option>';

            try {
                const times = await api.getAvailableTimes(date);
                timeSelect.innerHTML = '<option value="">Selecciona una hora disponible</option>';
                times.forEach(time => {
                    const option = document.createElement('option');
                    option.value = time.value;
                    option.textContent = time.text || `${time.label} - $${time.price}`;
                    option.dataset.price = time.price;
                    timeSelect.appendChild(option);
                });
            } catch (error) {
                console.error('❌ Error cargando horarios:', error);
                timeSelect.innerHTML = '<option value="">No hay horarios disponibles</option>';
            }

            timeSelect.disabled = false;
            resolve();
        });
    }

    // Event listeners
    timeSelect.addEventListener('change', function() {
        if (this.value) {
            const selectedOption = this.options[this.selectedIndex];
            const priceText = Number(selectedOption.dataset.price || 0).toLocaleString('es-PY');
            priceDisplay.textContent = '$' + priceText;
            priceContainer.classList.remove('hidden');
        } else {
            priceContainer.classList.add('hidden');
        }
        saveFormState();
    });

    emailInput.addEventListener('input', function() {
        validateEmail();
        saveFormState();
    });

    ageInput.addEventListener('input', function() {
        validateAge();
        saveFormState();
    });

    reasonInput.addEventListener('input', saveFormState);
    dateInput.addEventListener('change', saveFormState);
    nombreCompletoInput.addEventListener('input', saveFormState);
    telefonoInput.addEventListener('input', saveFormState);

    appointmentForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        formContainer.classList.add('hidden');
        loadingState.classList.remove('hidden');

        try {
            document.getElementById('loading-message').textContent = 'Guardando tu cita...';
            
            const response = await fetch('http://localhost:3000/api/appointments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: emailInput.value,
                    nombre_completo: nombreCompletoInput.value,
                    telefono: telefonoInput.value,
                    age: parseInt(ageInput.value),
                    reason: reasonInput.value,
                    date: dateInput.value,
                    time: timeSelect.value,
                    price: '$' + timeSelect.options[timeSelect.selectedIndex].dataset.price
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Error al agendar la cita');
            }

            const data = await response.json();
            console.log('✅ Cita guardada:', data);

            // Preparar resumen
            summaryEmail.textContent = emailInput.value;
            summaryAge.textContent = `${ageInput.value} años`;
            summaryReason.textContent = reasonInput.value;
            summaryNombreCompleto.textContent = nombreCompletoInput.value;
            summaryTelefono.textContent = telefonoInput.value;

            const formattedDate = new Date(dateInput.value + 'T00:00:00');
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            summaryDate.textContent = formattedDate.toLocaleDateString('es-ES', options);

            const timeText = timeSelect.options[timeSelect.selectedIndex].text;
            summaryTime.textContent = timeText.split('-')[0].trim();

            const selectedPrice = Number(timeSelect.options[timeSelect.selectedIndex].dataset.price || 0).toLocaleString('es-PY');
            summaryPrice.textContent = '$' + selectedPrice;

            loadingState.classList.add('hidden');
            appointmentSummary.classList.remove('hidden');
            appointmentSummary.classList.add('fade-in');

            localStorage.removeItem('appointmentFormData');
        } catch (error) {
            console.error('❌ Error en el proceso de agendamiento:', error);
            alert('Hubo un error al procesar tu cita: ' + error.message);
            formContainer.classList.remove('hidden');
            loadingState.classList.add('hidden');
        }
    });

    newAppointmentBtn.addEventListener('click', function() {
        appointmentForm.reset();
        priceContainer.classList.add('hidden');
        timeSelect.disabled = true;
        timeSelect.innerHTML = '<option value="">Selecciona primero una fecha</option>';
        if (datePicker) datePicker.clear();
        appointmentSummary.classList.add('hidden');
        formContainer.classList.remove('hidden');
        emailError.classList.add('hidden');
        ageError.classList.add('hidden');
    });

    // Funciones de validación
    function validateEmail() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(emailInput.value);
        if (!isValid) {
            emailError.classList.remove('hidden');
            emailInput.classList.add('is-invalid');
        } else {
            emailError.classList.add('hidden');
            emailInput.classList.remove('is-invalid');
        }
        return isValid;
    }

    function validateAge() {
        const age = parseInt(ageInput.value);
        const isValid = age >= 18;
        if (!isValid) {
            ageError.classList.remove('hidden');
            ageInput.classList.add('is-invalid');
        } else {
            ageError.classList.add('hidden');
            ageInput.classList.remove('is-invalid');
        }
        return isValid;
    }

    function validateForm() {
        const isEmailValid = validateEmail();
        const isAgeValid = validateAge();
        
        nombreCompletoInput.classList.toggle('is-invalid', nombreCompletoInput.value.trim().length === 0);
        telefonoInput.classList.toggle('is-invalid', !/^(\+595|0)?\s?9\d{2}\s?\d{3}\s?\d{3}$/.test(telefonoInput.value));
        dateInput.classList.toggle('is-invalid', !dateInput.value);
        timeSelect.classList.toggle('is-invalid', !timeSelect.value);
        reasonInput.classList.toggle('is-invalid', reasonInput.value.trim().length === 0);

        const isNombreValid = nombreCompletoInput.value.trim().length > 0;
        const telefonoRegex = /^(\+595|0)?\s?9\d{2}\s?\d{3}\s?\d{3}$/;
        const isTelefonoValid = telefonoRegex.test(telefonoInput.value);
        
        if (!isNombreValid) alert('Nombre completo es obligatorio.');
        if (!isTelefonoValid) alert('Teléfono inválido (ejemplo: +595 981 123 456 o 0981 123 456).');
        
        return isEmailValid && isAgeValid && isNombreValid && isTelefonoValid && dateInput.value && timeSelect.value && reasonInput.value;
    }

    // Funciones de LocalStorage
    function saveFormState() {
        const formData = {
            email: emailInput.value,
            nombre_completo: nombreCompletoInput.value,
            telefono: telefonoInput.value,
            age: ageInput.value,
            reason: reasonInput.value,
            date: dateInput.value,
            time: timeSelect.value
        };
        localStorage.setItem('appointmentFormData', JSON.stringify(formData));
    }

    async function restoreFormState() {
        const savedData = localStorage.getItem('appointmentFormData');
        if (savedData) {
            const formData = JSON.parse(savedData);
            emailInput.value = formData.email || '';
            nombreCompletoInput.value = formData.nombre_completo || '';
            telefonoInput.value = formData.telefono || '';
            ageInput.value = formData.age || '';
            reasonInput.value = formData.reason || '';
            if (formData.date && datePicker) {
                datePicker.setDate(formData.date);
                await fetchAvailableTimes(formData.date);
                if (formData.time && timeSelect.options.length > 0) {
                    timeSelect.value = formData.time;
                    const selectedOption = timeSelect.options[timeSelect.selectedIndex];
                    if (selectedOption && selectedOption.dataset.price) {
                        priceDisplay.textContent = '$' + Number(selectedOption.dataset.price).toLocaleString('es-PY');
                        priceContainer.classList.remove('hidden');
                    }
                }
            }
        }
    }
});