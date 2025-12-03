/* ARCHIVO DE FUNCIONES PRINCIPALES
   Aquí controlo el registro, el login y la lista de países.
   Uso localStorage para guardar cada dato por separado (sin JSON).
*/

// --- 1. DATOS DE LOS PAÍSES ---
// Uso una lista simple para poder cargar las banderas
var paises = [
    { codigo: "+591", iso: "bo" }, // Bolivia primero
    { codigo: "+54", iso: "ar" },
    { codigo: "+55", iso: "br" },
    { codigo: "+56", iso: "cl" },
    { codigo: "+57", iso: "co" },
    { codigo: "+51", iso: "pe" },
    { codigo: "+1", iso: "us" },
    { codigo: "+34", iso: "es" }
];

// --- 2. FUNCIONES DE VALIDACIÓN (REGEX) ---

// Valida que sea un correo normal (texto @ texto . com)
function esCorreoValido(correo) {
    var regla = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regla.test(correo);
}

// Valida solo letras y espacios para el nombre
function esNombreValido(nombre) {
    var regla = /^[A-Za-zÁÉÍÓÚÑáéíóúñ ]+$/;
    return regla.test(nombre);
}

// Valida contraseña fuerte (Mayúscula, minúscula, número, símbolo, 6 letras)
function esClaveFuerte(clave) {
    var regla = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
    return regla.test(clave);
}

// Valida celular general (7 a 12 números)
function esCelularGeneral(numero) {
    var regla = /^[0-9]{7,12}$/;
    return regla.test(numero);
}

// Valida celular SOLO para Bolivia (8 números exactos)
function esCelularBolivia(numero) {
    var regla = /^[0-9]{8}$/;
    return regla.test(numero);
}


// --- 3. FUNCIONES PARA MOSTRAR LA CONTRASEÑA ---
// Funciones simples para cambiar el tipo de input de 'password' a 'text'

function verClaveLogin() {
    var input = document.getElementById("login-pass");
    if (input.type === "password") {
        input.type = "text";
    } else {
        input.type = "password";
    }
}

function verClaveRegistro() {
    var input = document.getElementById("reg-pass");
    if (input.type === "password") {
        input.type = "text";
    } else {
        input.type = "password";
    }
}

function verClaveRecuperar() {
    var input = document.getElementById("rec-pass");
    if (input.type === "password") {
        input.type = "text";
    } else {
        input.type = "password";
    }
}

// Función para mostrar mensajes de error o éxito en pantalla
function mensajePantalla(texto, color) {
    var parrafo = document.getElementById("mensaje-sistema");
    parrafo.style.color = color;
    parrafo.innerText = texto;
}


// --- 4. LOGICA DE LA LISTA DE PAÍSES ---

// Esta función carga la lista cuando entramos al registro
function iniciarPaises() {
    var lista = document.getElementById("lista-items-pais");
    // Si no existe la lista (estamos en login), no hacemos nada
    if (lista === null) {
        return; 
    }

    // Recorremos la lista de países con un bucle simple
    for (var i = 0; i < paises.length; i++) {
        var p = paises[i];
        
        // Creamos el elemento de la lista (LI)
        var item = document.createElement("li");
        item.className = "item-pais";
        
        // Ponemos la imagen y el código adentro
        // Nota: uso una funcion extra para el click para que no se confunda el valor de 'p'
        item.innerHTML = '<img src="https://flagcdn.com/w40/' + p.iso + '.png" width="20"> ' + p.codigo;
        
        // Le asignamos el click manualmente
        item.setAttribute("onclick", "elegirPais('" + p.codigo + "', '" + p.iso + "')");
        
        lista.appendChild(item);
    }
}

// Función para mostrar u ocultar la lista
function abrirLista() {
    var menu = document.getElementById("lista-paises");
    if (menu.style.display === "block") {
        menu.style.display = "none";
    } else {
        menu.style.display = "block";
    }
}

// Función cuando el usuario hace click en un país de la lista
function elegirPais(codigo, iso) {
    // Cambiamos la imagen principal
    document.getElementById("img-bandera").src = "https://flagcdn.com/w40/" + iso + ".png";
    // Cambiamos el texto (+591)
    document.getElementById("texto-codigo").innerText = codigo;
    // Guardamos el valor en el input oculto
    document.getElementById("valor-pais-oculto").value = codigo;
    
    // Cerramos la lista
    document.getElementById("lista-paises").style.display = "none";
}

// Ejecutamos la carga de países al leer el archivo
iniciarPaises();


// --- 5. LOGICA DEL REGISTRO ---
var formRegistro = document.getElementById("form-registro");

if (formRegistro) {
    formRegistro.onsubmit = function(evento) {
        evento.preventDefault(); // Evita que se recargue la página

        // 1. Obtener valores
        var nombre = document.getElementById("reg-nombre").value;
        var correo = document.getElementById("reg-correo").value;
        var clave = document.getElementById("reg-pass").value;
        var celular = document.getElementById("reg-celular").value;
        var codigoPais = document.getElementById("valor-pais-oculto").value;

        // 2. Validaciones simples
        if (esNombreValido(nombre) === false) {
            mensajePantalla("El nombre solo debe tener letras.", "red");
            return;
        }

        if (esCorreoValido(correo) === false) {
            mensajePantalla("El correo no es válido.", "red");
            return;
        }

        // Validación especial: Si es Bolivia (+591), exigimos 8 dígitos
        if (codigoPais === "+591") {
            if (esCelularBolivia(celular) === false) {
                mensajePantalla("En Bolivia el celular debe tener 8 dígitos.", "red");
                return;
            }
        } else {
            // Para otros países
            if (esCelularGeneral(celular) === false) {
                mensajePantalla("El celular debe tener entre 7 y 12 dígitos.", "red");
                return;
            }
        }

        if (esClaveFuerte(clave) === false) {
            mensajePantalla("La clave es débil. Use Mayús, Minús, números y símbolos.", "red");
            return;
        }

        // 3. Guardar en localStorage (Sin JSON, dato por dato)
        // Guardamos todo con prefijo 'usr_' para orden
        localStorage.setItem("usr_nombre", nombre);
        localStorage.setItem("usr_correo", correo);
        localStorage.setItem("usr_clave", clave);
        localStorage.setItem("usr_celular", codigoPais + celular);
        
        // Iniciamos los contadores en 0
        localStorage.setItem("usr_intentos", "0");
        localStorage.setItem("usr_bloqueado", "no");

        mensajePantalla("¡Cuenta creada! Redirigiendo...", "#00ff00");

        // Esperamos 2 segundos
        setTimeout(function() {
            window.location.href = "../index.html";
        }, 2000);
    };
}


// --- 6. LOGICA DEL LOGIN ---
var formLogin = document.getElementById("form-login");

if (formLogin) {
    formLogin.onsubmit = function(evento) {
        evento.preventDefault();

        var correoIngresado = document.getElementById("login-usuario").value;
        var claveIngresada = document.getElementById("login-pass").value;

        // 1. Recuperar los datos guardados dato por dato
        var correoGuardado = localStorage.getItem("usr_correo");
        var claveGuardada = localStorage.getItem("usr_clave");
        var nombreGuardado = localStorage.getItem("usr_nombre");
        
        // Convertimos los intentos a número entero
        var intentos = parseInt(localStorage.getItem("usr_intentos"));
        var estaBloqueado = localStorage.getItem("usr_bloqueado");

        // 2. Verificar si existe usuario
        if (correoGuardado === null) {
            mensajePantalla("No hay cuentas registradas.", "red");
            return;
        }

        // 3. Verificar si el correo es correcto primero
        if (correoIngresado !== correoGuardado) {
            mensajePantalla("El correo no coincide con el registrado.", "red");
            return;
        }

        // 4. Verificar si está bloqueado
        if (estaBloqueado === "si") {
            mensajePantalla("CUENTA BLOQUEADA.", "red");
            document.getElementById("enlace-recuperar").style.display = "block";
            return;
        }

        // 5. Verificar contraseña
        if (claveIngresada === claveGuardada) {
            // Éxito
            mensajePantalla("Bienvenido " + nombreGuardado, "#00ff00");
            // Reseteamos intentos a 0
            localStorage.setItem("usr_intentos", "0");
        } else {
            // Error
            intentos = intentos + 1;
            localStorage.setItem("usr_intentos", intentos); // Guardamos el nuevo numero

            if (intentos >= 3) {
                // Bloqueamos
                localStorage.setItem("usr_bloqueado", "si");
                mensajePantalla("Cuenta bloqueada por 3 intentos.", "red");
                document.getElementById("enlace-recuperar").style.display = "block";
            } else {
                mensajePantalla("Clave incorrecta. Intento " + intentos + " de 3.", "red");
            }
        }
    };
}


// --- 7. LOGICA DE RECUPERACIÓN ---
var formRecuperar = document.getElementById("form-recuperar");

if (formRecuperar) {
    formRecuperar.onsubmit = function(evento) {
        evento.preventDefault();

        var correoIngresado = document.getElementById("rec-correo").value;
        var claveNueva = document.getElementById("rec-pass").value;

        // Recuperar datos
        var correoGuardado = localStorage.getItem("usr_correo");

        if (correoGuardado === null) {
            mensajePantalla("No existe usuario.", "red");
            return;
        }

        // Verificar correo
        if (correoIngresado !== correoGuardado) {
            mensajePantalla("El correo es incorrecto.", "red");
            return;
        }

        // Validar nueva clave
        if (esClaveFuerte(claveNueva) === false) {
            mensajePantalla("La clave nueva es muy débil.", "red");
            return;
        }

        // Guardar la nueva clave y desbloquear
        localStorage.setItem("usr_clave", claveNueva);
        localStorage.setItem("usr_bloqueado", "no");
        localStorage.setItem("usr_intentos", "0");

        mensajePantalla("Clave cambiada. Puedes entrar.", "#00ff00");

        setTimeout(function() {
            window.location.href = "../index.html";
        }, 2000);
    };
}
