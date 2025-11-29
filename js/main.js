/* ARCHIVO PRINCIPAL DE JAVASCRIPT
    Aquí manejo el registro, el login y la recuperación.
    Uso localStorage para guardar los datos como si fuera una base de datos simple.
*/

// --- 1. Definición de Expresiones Regulares (Reglas de validación) ---

// Valida que el nombre solo tenga letras y espacios (incluye tildes).
var regexNombre = /^[A-Za-zÁÉÍÓÚÑáéíóúñ ]+$/;

// Valida formato de correo estándar (texto @ texto . extension).
var regexCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/;

// Valida celular: solo números, entre 7 y 12 dígitos.
var regexCelular = /^[0-9]{7,12}$/;

// Valida contraseña fuerte:
// - Al menos una minúscula (?=.*[a-z])
// - Al menos una mayúscula (?=.*[A-Z])
// - Al menos un número (?=.*\d)
// - Al menos un símbolo (?=.*[\W_])
// - Mínimo 6 caracteres total
var regexPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[\\W_]).{6,}$/;


// --- 2. Función Utilitaria: Mostrar / Ocultar Contraseña ---
// Esta función sirve para el checkbox del ojo.
function mostrarOcultarPass(idInput) {
    var input = document.getElementById(idInput);
    // Si es password lo cambio a texto, si es texto lo regreso a password
    if (input.type === "password") {
        input.type = "text";
    } else {
        input.type = "password";
    }
}

// Función pequeña para mostrar mensajes en pantalla (Error o Éxito)
function mostrarMensaje(texto, tipo) {
    var parrafo = document.getElementById("mensaje-sistema");
    parrafo.textContent = texto;
    // Quitamos clases viejas y ponemos la nueva (error o exito)
    parrafo.className = "mensaje " + tipo;
}


// --- 3. Lógica del REGISTRO (Se ejecuta solo si estamos en registro.html) ---
var formRegistro = document.getElementById("form-registro");

if (formRegistro) {
    formRegistro.addEventListener("submit", function(event) {
        event.preventDefault(); // Evito que se recargue la página

        // Obtengo los valores de los inputs
        var nombre = document.getElementById("reg-nombre").value;
        var correo = document.getElementById("reg-correo").value;
        var celular = document.getElementById("reg-celular").value;
        var password = document.getElementById("reg-pass").value;

        // Validamos Nombre
        if (!regexNombre.test(nombre)) {
            mostrarMensaje("El nombre no es válido (solo letras).", "error");
            return;
        }

        // Validamos Correo
        if (!regexCorreo.test(correo)) {
            mostrarMensaje("El correo no tiene un formato válido.", "error");
            return;
        }

        // Validamos Celular
        if (!regexCelular.test(celular)) {
            mostrarMensaje("El celular debe tener entre 7 y 12 números.", "error");
            return;
        }

        // Validamos Contraseña Segura
        if (!regexPass.test(password)) {
            mostrarMensaje("La contraseña es muy débil. Debe tener mayúscula, minúscula, número y símbolo.", "error");
            return;
        }

        // Si todo está bien, guardamos en el navegador (localStorage)
        // Guardamos un objeto con los datos del usuario
        var nuevoUsuario = {
            nombre: nombre,
            correo: correo,
            celular: celular,
            password: password,
            intentos: 0,      // Contador de fallos
            bloqueado: false  // Estado de la cuenta
        };

        // Convertimos el objeto a texto para guardarlo
        localStorage.setItem("usuarioRegistrado", JSON.stringify(nuevoUsuario));

        mostrarMensaje("¡Usuario registrado con éxito! Redirigiendo...", "exito");
        
        // Esperamos 2 segundos y lo mandamos al login
        setTimeout(function() {
            window.location.href = "../index.html";
        }, 2000);
    });
}


// --- 4. Lógica del LOGIN (Se ejecuta solo en index.html) ---
var formLogin = document.getElementById("form-login");

if (formLogin) {
    formLogin.addEventListener("submit", function(event) {
        event.preventDefault();

        var correoIngresado = document.getElementById("login-usuario").value;
        var passIngresado = document.getElementById("login-pass").value;

        // Recuperamos al usuario guardado
        var usuarioGuardado = localStorage.getItem("usuarioRegistrado");
        
        // Verificamos si existe alguien registrado
        if (!usuarioGuardado) {
            mostrarMensaje("No hay usuarios registrados en el sistema.", "error");
            return;
        }

        // Convertimos el texto guardado otra vez a objeto JavaScript
        var usuarioObj = JSON.parse(usuarioGuardado);

        // Primero revisamos si la cuenta está bloqueada
        if (usuarioObj.bloqueado === true) {
            mostrarMensaje("Cuenta bloqueada por intentos fallidos.", "error");
            document.getElementById("enlace-recuperar").style.display = "block";
            return;
        }

        // Validamos credenciales (Correo y Contraseña)
        if (usuarioObj.correo === correoIngresado && usuarioObj.password === passIngresado) {
            // LOGIN EXITOSO
            mostrarMensaje("Bienvenido al sistema, " + usuarioObj.nombre, "exito");
            
            // Reiniciamos los intentos a 0 porque entró bien
            usuarioObj.intentos = 0;
            localStorage.setItem("usuarioRegistrado", JSON.stringify(usuarioObj));

        } else {
            // LOGIN FALLIDO
            usuarioObj.intentos = usuarioObj.intentos + 1; // Sumamos un intento fallido

            if (usuarioObj.intentos >= 3) {
                // Si llega a 3, bloqueamos
                usuarioObj.bloqueado = true;
                mostrarMensaje("Cuenta bloqueada por intentos fallidos.", "error");
                document.getElementById("enlace-recuperar").style.display = "block";
            } else {
                // Si aun no llega a 3, avisamos
                mostrarMensaje("Usuario o contraseña incorrectos. Intentos: " + usuarioObj.intentos, "error");
            }

            // Guardamos el contador actualizado en localStorage
            localStorage.setItem("usuarioRegistrado", JSON.stringify(usuarioObj));
        }
    });
}


// --- 5. Lógica de RECUPERACIÓN (Se ejecuta solo en recuperar.html) ---
var formRecuperar = document.getElementById("form-recuperar");

if (formRecuperar) {
    formRecuperar.addEventListener("submit", function(event) {
        event.preventDefault();

        var correoConfirmar = document.getElementById("rec-correo").value;
        var nuevaPass = document.getElementById("rec-pass").value;

        // Traemos datos guardados
        var usuarioGuardado = localStorage.getItem("usuarioRegistrado");

        if (!usuarioGuardado) {
            mostrarMensaje("No existe ese usuario.", "error");
            return;
        }

        var usuarioObj = JSON.parse(usuarioGuardado);

        // Verificamos que sea el mismo correo
        if (usuarioObj.correo !== correoConfirmar) {
            mostrarMensaje("El correo no coincide con el registrado.", "error");
            return;
        }

        // Validamos que la nueva contraseña sea segura
        if (!regexPass.test(nuevaPass)) {
            mostrarMensaje("La nueva contraseña no cumple los requisitos de seguridad.", "error");
            return;
        }

        // ACTUALIZAMOS LOS DATOS
        usuarioObj.password = nuevaPass; // Cambiamos la clave
        usuarioObj.bloqueado = false;    // Desbloqueamos la cuenta
        usuarioObj.intentos = 0;         // Reiniciamos intentos

        // Guardamos los cambios
        localStorage.setItem("usuarioRegistrado", JSON.stringify(usuarioObj));

        mostrarMensaje("Contraseña actualizada. Ahora puede iniciar sesión.", "exito");

        // Redirigimos al login después de un ratito
        setTimeout(function() {
            window.location.href = "../index.html";
        }, 2000);
    });
}