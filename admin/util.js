function validarCampoDeTextoID(id, mensaje) {
    //validaciones de nombre
    if ($("#" + id + "").val().length <= 0) {
        mensaje_dialogo_info(mensaje);
        $("#" + id + "").focus();
        $("#" + id + "").parent().addClass("has-error");

        $("#" + id + "").keypress(function () {
            $("#" + id + "").parent().removeClass("has-error");
        });
        return false;
    }
    return true;
}

function validarListaDesplegableID(id, mensaje) {
    //validaciones de nombre
    if ($("#" + id + "").val() == 0) {
        alert(mensaje);
        $("#" + id + "").focus();
        $("#" + id + "").parent().addClass("has-error");

        $("#" + id + "").click(function () {
            $("#" + id + "").parent().removeClass("has-error");
        });
        return false;
    }
    return true;
}



/**
 * Funcion que devuelve un numero separando los separadores de miles
 * Puede recibir valores negativos y con decimales
 */
function formatearNumero(valor) {
    var numero = (String(valor).length === 0) ? "0" : String(valor).replace(/[^0-9]/g, '');
    var resultado = "";
    var nuevoNumero;

    // manejar negativo
    if (String(valor).charAt(0) === "-") {
        nuevoNumero = numero.replace(/\./g, '').substring(1);
    } else {
        nuevoNumero = numero.replace(/\./g, '');
    }

    // quitar ceros a la izquierda (p. ej. “02” → “2”)
    nuevoNumero = nuevoNumero.replace(/^0+(?=\d)/, '');

    // si hubiera decimales con coma (aunque el regex los elimina antes), se podrían reinsertar aquí
    if (numero.indexOf(",") >= 0) {
        nuevoNumero = nuevoNumero.substring(0, nuevoNumero.indexOf(","));
    }

    // separador de miles
    for (var j, i = nuevoNumero.length - 1, j = 0; i >= 0; i--, j++) {
        resultado = nuevoNumero.charAt(i) + ((j > 0 && j % 3 === 0) ? "." : "") + resultado;
    }

    if (numero.indexOf(",") >= 0) {
        resultado += numero.substring(numero.indexOf(","));
    }

    return (String(valor).charAt(0) === "-") ? "-" + resultado : resultado;
}



function formatearNumeroCampo(valor) {
    // Variable que contendra el resultado final
    var numero = $("#" + valor).val();
    var resultado = "";

    // Si el numero empieza por el valor "-" (numero negativo)
    if (numero[0] == "-")
    {
        // Cogemos el numero eliminando los posibles puntos que tenga, y sin
        // el signo negativo
        nuevoNumero = numero.replace(/\./g, '').substring(1);
    } else {
        // Cogemos el numero eliminando los posibles puntos que tenga
        nuevoNumero = numero.replace(/\./g, '');
    }

    // Si tiene decimales, se los quitamos al numero
    if (numero.indexOf(",") >= 0)
        nuevoNumero = nuevoNumero.substring(0, nuevoNumero.indexOf(","));

    // Ponemos un punto cada 3 caracteres
    for (var j, i = nuevoNumero.length - 1, j = 0; i >= 0; i--, j++)
        resultado = nuevoNumero.charAt(i) + ((j > 0) && (j % 3 == 0) ? "." : "") + resultado;

    // Si tiene decimales, se lo añadimos al numero una vez forateado con 
    // los separadores de miles
    if (numero.indexOf(",") >= 0)
        resultado += numero.substring(numero.indexOf(","));

    if (numero[0] == "-")
    {
        // Devolvemos el valor añadiendo al inicio el signo negativo
        $("#" + valor).val("-" + resultado);
    } else {
        $("#" + valor).val(resultado);
    }
}

function dameFechaActual(id_componente) {
    var fecha = new Date();
    var mes = fecha.getMonth() + 1;
    var dia = fecha.getDate();
    var actual = "";
    if (mes - 10 < 0) {
        actual = fecha.getFullYear() + "-0" + mes + "-";

    } else {

        actual = fecha.getFullYear() + "-" + mes + "-";

    }

    if (dia - 10 < 0) {
        actual += "0" + dia;
    } else {
        actual += dia;
    }
    $("#" + id_componente).val(actual);

}


function dameFechaActualFormateada() {
    var fecha = new Date();
    var mes = fecha.getMonth() + 1;
    var dia = fecha.getDate();
    var actual = "";
    if (dia - 10 < 0) {
        actual = "0" + dia;
    } else {
        actual = dia;
    }
    if (mes - 10 < 0) {
        actual += "-0" + mes + "-" + fecha.getFullYear();

    } else {

        actual += "-" + mes + "-" + fecha.getFullYear();

    }

    return actual;

}
function dameFechaActualSQL() {
    var fecha = new Date();
    var mes = fecha.getMonth() + 1;
    var dia = fecha.getDate();
    var actual = "";
    if (mes - 10 < 0) {
        actual = fecha.getFullYear() + "-0" + mes + "-";

    } else {

        actual = fecha.getFullYear() + "-" + mes + "-";

    }

    if (dia - 10 < 0) {
        actual += "0" + dia;
    } else {
        actual += dia;
    }
    return  actual;

}

function dameFechaFormateadaSQL(fecha) {
    var fec = String(fecha).split("-");

    return  fec[2] + "-" + fec[1] + "-" + fec[0];
}
function dameFechaFormateada(fecha) {
    var mes = fecha.getMonth() + 1;
    var dia = fecha.getDate() + 1;
    var actual = "";
    if (dia - 10 < 0) {
        actual += "0" + dia;
    } else {
        actual += dia;
    }
    if (mes - 10 < 0) {
        actual += "-0" + mes + "-" + fecha.getFullYear();

    } else {

        actual += "-" + mes + "-" + fecha.getFullYear();

    }

    return  actual;

}

function formatearFecha(fecha) {

    var dia = fecha.getDate() + 1;
    var mes = fecha.getMonth() + 1;
    var anio = fecha.getFullYear();
    return  dia + "-" + mes + "-" + anio;
}

function dameFechaSQL() {
    var fecha = new Date();
    var dia = fecha.getDate() + 1;
    var mes = fecha.getMonth() + 1;
    var anio = fecha.getFullYear();
    return  anio + "-" + mes + "-" + dia;
}
function dameFechaSQL(fecha) {
    var fec = String(fecha).split("-");

    return  fec[0] + "-" + fec[2] + "-" + fec[1];
}

function dameFechaTimeFormateadaComponente(fecha) {
    var dat = fecha.split(" ")[0];
    var fecha_split = dat.split("-");
    var tim = fecha.split(" ")[1];
    var hora = tim.split(":");
    return fecha_split[0] + "-" + fecha_split[1] + "-" + fecha_split[2] + "T" + hora[0] + ":" + hora[1];

}
function dameFechaFormateadaSQL(fecha) {
    var fec = String(fecha).split("-");

    return  fec[2] + "-" + fec[1] + "-" + fec[0];
}


function quitarDecimalesConvertir(valor) {
    if (valor.length === 0)
        return 0;
    var num = String(valor);
    var numer = num.replace(/\./g, '');
    var nuevo_n = parseInt(numer);
    return nuevo_n;
}

function mensajeErrorUsuario(mensaje, titulo) {
    var modal = "<div class='modal fade' id='mensaje-usuario'>" +
            "<div class='modal-dialog'>" +
            "<div class='modal-content'>" +
            "<div class='modal-header' style='background: #990000;'> " +
            "<button class='close'" +
            " type='button'" +
            "data-dismiss='modal'" +
            "aria-label='Close'" +
            "><span aria-hidden='true'>&times;</span> </button>" +
            "<h4 class='modal-title' style='color: #fffc;'>" + titulo + "</h4>" +
            "</div>" +
            "<div class='modal-body' style='font-weight: bold;'>" +
            mensaje +
            "</div>" +
            "<div class='modal-footer'>" +
            "<button type='button'class='btn btn-default pull-left'" +
            " data-dismiss='modal'>Cerrar</button>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "</div>";
    $("body").append(modal);
    $("#mensaje-usuario").modal("show");
}


function ejecutarAjax(url, data) {

    var resultado = "";
    $.ajax({
        type: "POST",
        async: false,
        cache: false,
        url: url,
        data: data,
        success: function (datos) {
//                console.log(datos);

            resultado = datos;

        }
    });

    return resultado;
}


async function ejecutarAjaxCargando(url, data) {

    var resultado = "";
    $.ajax({
        type: "POST",
        async: false,
        cache: false,
        url: url,
        data: data,
        success: function (datos) {
//                console.log(datos);

            resultado = datos;

        }, beforeSend: function (xhr) {

        }
    });

    return resultado;
}
function ejecutarAjaxAsync(url, data) {

    return new Promise((resolve, reject) => {
        $.ajax({
            type: "POST",
            async: true,
            cache: false,
            url: url,
            data: data,
            success: function (datos) {
                resolve(datos); // Devuelve los datos cuando la solicitud es exitosa
            },
            error: function (xhr, status, error) {
                reject(error); // Maneja errores de la solicitud AJAX
            }
        });
    });
}

function ejecutarAjaxHTML(url, data) {

    var resultado = "";
    $.ajax({
        type: "POST",
        async: false,
        cache: false,
        dataType: 'html',
        url: url,
        data: data,
        success: function (datos) {
//                console.log(datos);
            resultado = datos;

        }
    });

    return resultado;
}


function ejecutarAjaxERROR(url, data, mensaje_error, mensaje_correcto) {

    var resultado = "";
    $.ajax({
        type: "POST",
        async: false,
        cache: false,
        url: url,
        data: data,
        success: function (datos) {

            resultado = datos;
            mensaje_dialogo_info(mensaje_correcto, "CORRECTO");

        }, error: function (jqXHR, textStatus, errorThrown) {
            mensaje_dialogo_info_ERROR(mensaje_error + " " + textStatus, "ERROR");
        }, beforeSend: function (xhr) {
            //logo de cargando
        }
    });

    return resultado;
}

var modalConfirm;
function mensaje_confirmacion(mensaje, titulo) {
    Swal.fire(
            mensaje,
            titulo,
            'success'
            );
}


function mensaje_dialogo_info(mensaje, titulo) {
    Swal.fire(
            titulo,
            mensaje,
            'info'
            );

}
function mensaje_dialogo_correcto(mensaje, titulo) {
    Swal.fire(
            titulo,
            mensaje,
            'success'
            );

}



function mensaje_dialogo_info_ERROR(mensaje, titulo) {

    Swal.fire(
            titulo,
            mensaje,
            'error'
            );

}


function dameContenido(dir) {
    var contenido = "";

    $.ajax({
        type: "POST",
        async: false,
        cache: false,
        url: dir,
        success: function (datos) {
            contenido += datos;
        }
    });

    return contenido;
}
function dameContenidoAsyntrue(dir) {
    var contenido = "";

    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        url: dir,
        success: function (datos) {
            contenido += datos;
        }
    });

    return contenido;
}
function dameContenidoAsync(url) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "GET",
            url: url,
            dataType: "html",
            success: function (data) {
                resolve(data);
            },
            error: function (error) {
                reject(error);
            }
        });
    });
}


$(document).on("click", ".remover-item", function (evt) {
    var tr = $(this).closest("tr");
    Swal.fire({
        title: "Atencion",
        text: "Desea remover el registro?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "No",
        confirmButtonText: "Si"
    }).then((result) => {
        if (result.isConfirmed) {
            $(tr).remove();
        }
    });

});

function dameTimeStapActualSQL() {
    var fecha = new Date();
    return fecha.getFullYear() + "-" + (fecha.getMonth() + 1) + "-" + fecha.getDate() + " " +
            fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds();
}
function imprimir() {
    window.print();
}


function format(input)
{
    var num = input.value.replace(/\./g, '');
    if (!isNaN(num)) {
        num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g, '$1.');
        num = num.split('').reverse().join('').replace(/^[\.]/, '');
        input.value = num;
    } else {
        alert('Solo se permiten numeros');
        input.value = input.value.replace(/[^\d\.]*/g, '');
    }
}

function validarNumerico(valor) {
    // Obtener el valor actual del input


    // Verificar si el valor es un número positivo
    if (/^\d*\.?\d+$/.test(valor) && parseFloat(valor) >= 0) {
        // El valor es un número positivo
        // Puedes realizar acciones adicionales si es necesario
        return true;
    } else {
        // El valor no es un número positivo, restablecer el valor del input
        return false;
    }
}

function ceroAlaIzquierda(number, length) {
    // Convertir el número a cadena
    let str = String(number);

    // Mientras la longitud de la cadena sea menor que la especificada, agregar ceros a la izquierda
    while (str.length < length) {
        str = '0' + str;
    }

    return str;
}

function nombreDelMes(monthNumber) {
    const months = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    // Restamos 1 a monthNumber porque los arrays en JavaScript empiezan en 0
    return months[monthNumber - 1] || "Mes inválido";
}
function inicializarHora() {
    // Obtenemos la fecha y hora actual
    const ahora = new Date();

    // Extraemos las horas y minutos
    let horas = ahora.getHours();
    let minutos = ahora.getMinutes();

    // Añadimos ceros a la izquierda si es necesario
    horas = horas < 10 ? '0' + horas : horas;
    minutos = minutos < 10 ? '0' + minutos : minutos;

    // Formato hh:mm
    return horas + ':' + minutos;
}
//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
function calcularDiferenciaMinutos(horaInicio, horaFin) {
    // Dividir las horas y minutos
    const [inicioHoras, inicioMinutos] = horaInicio.split(':').map(Number);
    const [finHoras, finMinutos] = horaFin.split(':').map(Number);

    // Convertir todo a minutos
    const inicioTotalMinutos = (inicioHoras * 60) + inicioMinutos;
    const finTotalMinutos = (finHoras * 60) + finMinutos;

    // Calcular la diferencia
    let diferenciaMinutos = finTotalMinutos - inicioTotalMinutos;

    // Si la diferencia es negativa, significa que la hora de fin es el día siguiente
    if (diferenciaMinutos < 0) {
        diferenciaMinutos += 24 * 60; // Agregar 24 horas en minutos
    }

    return diferenciaMinutos;
}
function numeroALetras(num) {
    const unidades = ["", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve"];
    const decenas = ["", "diez", "veinte", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa"];
    const especiales = ["diez", "once", "doce", "trece", "catorce", "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve"];
    const centenas = ["", "cien", "doscientos", "trescientos", "cuatrocientos", "quinientos", "seiscientos", "setecientos", "ochocientos", "novecientos"];

    if (num === 0)
        return "cero";

    let letras = '';

    function convertirCentenas(num) {
        if (num === 100)
            return "cien";
        return centenas[Math.floor(num / 100)] + (num % 100 > 0 ? " " + convertirDecenas(num % 100) : "");
    }

    function convertirDecenas(num) {
        if (num < 10)
            return unidades[num];
        else if (num >= 10 && num < 20)
            return especiales[num - 10];
        else {
            return decenas[Math.floor(num / 10)] + (num % 10 > 0 ? " y " + unidades[num % 10] : "");
        }
    }

    function convertirMiles(num) {
        if (num >= 1000) {
            let miles = Math.floor(num / 1000);
            let resto = num % 1000;
            if (miles === 1)
                return "mil " + (resto > 0 ? convertirCentenas(resto) : "");
            return convertirCentenas(miles) + " mil " + (resto > 0 ? convertirCentenas(resto) : "");
        }
        return convertirCentenas(num);
    }

    function convertirMillones(num) {
        if (num >= 1000000) {
            let millones = Math.floor(num / 1000000);
            let resto = num % 1000000;
            if (millones === 1)
                return "un millón " + (resto > 0 ? convertirMiles(resto) : "");
            return convertirMiles(millones) + " millones " + (resto > 0 ? convertirMiles(resto) : "");
        }
        return convertirMiles(num);
    }

    function convertirMilMillones(num) {
        if (num >= 1000000000) {
            let milMillones = Math.floor(num / 1000000000);
            let resto = num % 1000000000;
            if (milMillones === 1)
                return "mil millones " + (resto > 0 ? convertirMillones(resto) : "");
            return convertirMiles(milMillones) + " mil millones " + (resto > 0 ? convertirMillones(resto) : "");
        }
        return convertirMillones(num);
    }

    function convertirBillones(num) {
        if (num >= 1000000000000) {
            let billones = Math.floor(num / 1000000000000);
            let resto = num % 1000000000000;
            if (billones === 1)
                return "un billón " + (resto > 0 ? convertirMilMillones(resto) : "");
            return convertirMiles(billones) + " billones " + (resto > 0 ? convertirMilMillones(resto) : "");
        }
        return convertirMilMillones(num);
    }

    letras = convertirBillones(num).trim();

    return letras;
}

//---------------------------------------------------------------------
//---------------------------------------------------------------------
//---------------------------------------------------------------------
function cerrarSesion() {
    window.location.href = 'controladores/cerrarSesion.php';
}
//---------------------------------------------------------------------
//---------------------------------------------------------------------
//---------------------------------------------------------------------
function recargarPagina() {
    window.location.href = 'index.php';
}

function validarFormulario(campos) {
    let errores = [];

    for (let campo in campos) {
        const valor = campos[campo];

        // Si el campo es una lista (termina en "_lst") o es "epoca_historica"
        if (campo.endsWith("_lst") && valor === "0") {
            errores.push(`Debe seleccionar un valor para ${campo.replace(/_/g, " ").replaceAll("lst", "").replace("nh", "ñ")}`);
            break;
        } else if (!valor || valor.trim() === "") {
            errores.push(`El campo ${campo.replace(/_/g, " ").replace("nh", "ñ")} no puede estar vacío`);
            break;
        }
    }

    if (errores.length > 0) {
        mensaje_dialogo_info_ERROR(errores.join("\n"), "Atención");
        return false;
    }

    return true;
}

function limpiarFormulario(selectorContenedor = "body") {
    // Limpiar inputs de texto
    $(`${selectorContenedor} input[type="text"], 
       ${selectorContenedor} input[type="number"], 
       ${selectorContenedor} input[type="file"], 
       ${selectorContenedor} textarea`).val("");

    // Reiniciar selects a "0"
    $(`${selectorContenedor} select`).val("0").trigger("change");
}

//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
function cargarDataTable(componente, lista) {
    console.log($.fn.DataTable.isDataTable(componente));
    if ($.fn.DataTable.isDataTable(componente)) {
        console.log("creado");
        var tabla = $(componente).DataTable();
        tabla.clear().draw();
        tabla.rows.add(lista).draw();
    } else {
        console.log("no creado");
        $(componente).dataTable().fnDestroy();
        $(componente).DataTable({
            columnDefs: [
                {
                    targets: 0, // Índice de la primera columna
                    width: '100px', // Ancho fijo
                    className: 'dt-body-left' // opcional: alineación u otra clase
                }
            ],
            lengthChange: false,
            responsive: "true",
            data: lista,
            dom: "Bfrtilp",
            buttons: [
                {
                    extend: "excelHtml5",
                    text: "Excel",
                    titleAttr: "Exportar a Excel",
                    className: "btn btn-success",
                },
                {
                    extend: "pdfHtml5",
                    text: "PDF",
                    titleAttr: "Exportar a PDF",
                    className: "btn btn-danger",
                },
                {
                    extend: "print",
                    text: "Imprimir",
                    titleAttr: "Imprimir",
                    className: "btn btn-secondary",
                },
            ],
            iDisplayLength: 10,
            language: {
                sSearch: "Buscar: ",
                sInfo:
                        "Mostrando resultados del _START_ al _END_ de un total de _TOTAL_ registros",
                sInfoFiltered: "(filtrado de entre _MAX_ registros)",
                sZeroRecords: "No hay resultados",
                sInfoEmpty: "No hay resultados",
                oPaginate: {
                    sNext: "Siguiente",
                    sPrevious: "Anterior",
                },
            },
        });
    }
}
;