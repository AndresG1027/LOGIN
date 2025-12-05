/* ARCHIVO DE FUNCIONES PRINCIPALES (NIVEL BÁSICO)
   Aquí controlo el registro, el login y la recuperación de contraseña.
   Uso localStorage para guardar cada dato por separado.
*/

// --- 1. FUNCIONES DE VALIDACIÓN (REGEX SIMPLES) ---

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

// Valida celular simple: Solo números, entre 7 y 12 dígitos
function esCelularValido(numero) {
    var regla = /^[0-9]{7,12}$/;
    return regla.test(numero);
}


// --- 2. FUNCIONES PARA MOSTRAR LA CONTRASEÑA ---
// Son funciones simples que cambian el tipo de input de 'password' a 'text'

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

// Función auxiliar para mostrar mensajes en pantalla (rojo o verde)
function mensajePantalla(texto, color) {
    var parrafo = document.getElementById("mensaje-sistema");
    parrafo.style.color = color;
    parrafo.innerText = texto;
}


// --- 3. LOGICA DEL REGISTRO ---
var formRegistro = document.getElementById("form-registro");

if (formRegistro) {
    formRegistro.onsubmit = function(evento) {
        evento.preventDefault(); // Evito que se recargue la página

        // 1. Obtener valores de los campos
        var nombre = document.getElementById("reg-nombre").value;
        var correo = document.getElementById("reg-correo").value;
        var clave = document.getElementById("reg-pass").value;
        var celular = document.getElementById("reg-celular").value;

        // 2. Validaciones una por una con IF simples
        if (esNombreValido(nombre) === false) {
            mensajePantalla("El nombre solo debe tener letras.", "#ff3333");
            return;
        }

        if (esCorreoValido(correo) === false) {
            mensajePantalla("El correo no es válido.", "#ff3333");
            return;
        }

        // Validación simple de celular (7 a 12 dígitos)
        if (esCelularValido(celular) === false) {
            mensajePantalla("El celular debe tener entre 7 y 12 dígitos.", "#ff3333");
            return;
        }

        if (esClaveFuerte(clave) === false) {
            mensajePantalla("La clave es débil. Use Mayús, Minús, números y símbolos.", "#ff3333");
            return;
        }

        // 3. Guardar en localStorage (Dato por dato, sin JSON)
        localStorage.setItem("usr_nombre", nombre);
        localStorage.setItem("usr_correo", correo);
        localStorage.setItem("usr_clave", clave);
        localStorage.setItem("usr_celular", celular);
        
        // Iniciamos las variables de control
        localStorage.setItem("usr_intentos", "0");
        localStorage.setItem("usr_bloqueado", "no");

        mensajePantalla("¡Cuenta creada! Redirigiendo...", "#00ff00");

        // Espero 2 segundos y mando al login
        setTimeout(function() {
            window.location.href = "../index.html";
        }, 2000);
    };
}


// --- 4. LOGICA DEL LOGIN ---
var formLogin = document.getElementById("form-login");

if (formLogin) {
    formLogin.onsubmit = function(evento) {
        evento.preventDefault();

        var correoIngresado = document.getElementById("login-usuario").value;
        var claveIngresada = document.getElementById("login-pass").value;

        // 1. Recuperar los datos guardados
        var correoGuardado = localStorage.getItem("usr_correo");
        var claveGuardada = localStorage.getItem("usr_clave");
        var nombreGuardado = localStorage.getItem("usr_nombre");
        
        // Convertimos los intentos a número
        var intentos = parseInt(localStorage.getItem("usr_intentos"));
        var estaBloqueado = localStorage.getItem("usr_bloqueado");

        // 2. Verificar si existe usuario guardado
        if (correoGuardado === null) {
            mensajePantalla("No existe ninguna cuenta. Regístrese.", "#ff3333");
            return;
        }

        // 3. Verificar si el correo coincide primero (para no contar error si el correo está mal)
        if (correoIngresado !== correoGuardado) {
            mensajePantalla("El correo no es correcto.", "#ff3333");
            return;
        }

        // 4. Verificar si la cuenta está bloqueada
        if (estaBloqueado === "si") {
            mensajePantalla("CUENTA BLOQUEADA.", "#ff3333");
            document.getElementById("enlace-recuperar").style.display = "block";
            return;
        }

        // 5. Verificar contraseña
        if (claveIngresada === claveGuardada) {
            // Éxito
            mensajePantalla("Bienvenido " + nombreGuardado, "#00ff00");
            localStorage.setItem("usr_intentos", "0"); // Reseteo intentos
        } else {
            // Error de clave
            intentos = intentos + 1;
            localStorage.setItem("usr_intentos", intentos);

            if (intentos >= 3) {
                // Bloqueo la cuenta
                localStorage.setItem("usr_bloqueado", "si");
                mensajePantalla("Cuenta bloqueada por 3 intentos fallidos.", "#ff3333");
                document.getElementById("enlace-recuperar").style.display = "block";
            } else {
                mensajePantalla("Clave incorrecta. Intento " + intentos + " de 3.", "#ff3333");
            }
        }
    };
}


// --- 5. LOGICA DE RECUPERACIÓN ---
var formRecuperar = document.getElementById("form-recuperar");

if (formRecuperar) {
    formRecuperar.onsubmit = function(evento) {
        evento.preventDefault();

        var correoIngresado = document.getElementById("rec-correo").value;
        var claveNueva = document.getElementById("rec-pass").value;

        // Recuperar dato
        var correoGuardado = localStorage.getItem("usr_correo");

        if (correoGuardado === null) {
            mensajePantalla("No existe usuario.", "#ff3333");
            return;
        }

        // Verificar correo
        if (correoIngresado !== correoGuardado) {
            mensajePantalla("El correo es incorrecto.", "#ff3333");
            return;
        }

        // Validar que la nueva clave sea segura
        if (esClaveFuerte(claveNueva) === false) {
            mensajePantalla("La clave nueva es muy débil.", "#ff3333");
            return;
        }

        // Sobrescribir clave vieja y desbloquear
        localStorage.setItem("usr_clave", claveNueva);
        localStorage.setItem("usr_bloqueado", "no");
        localStorage.setItem("usr_intentos", "0");

        mensajePantalla("Clave cambiada. Puedes entrar.", "#00ff00");

        setTimeout(function() {
            window.location.href = "../index.html";
        }, 2000);
    };
}
