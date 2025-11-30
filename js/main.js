/* ARCHIVO PRINCIPAL DE JAVASCRIPT
    Aquí manejo toda la lógica del sistema: Registro, Login y Recuperación.
    Uso localStorage para guardar los datos en el navegador del usuario.
    También controlo el selector de países y las validaciones especiales.
*/

// --- 1. Datos para el selector de países ---
// Tengo esta lista de objetos para poder cargar las banderas desde internet usando su código ISO.
var listaPaises = [
    { codigo: "+93", nombre: "Afghanistan", iso: "af" },
    { codigo: "+54", nombre: "Argentina", iso: "ar" },
    { codigo: "+591", nombre: "Bolivia", iso: "bo" },
    { codigo: "+55", nombre: "Brazil", iso: "br" },
    { codigo: "+1", nombre: "Canada", iso: "ca" },
    { codigo: "+56", nombre: "Chile", iso: "cl" },
    { codigo: "+86", nombre: "China", iso: "cn" },
    { codigo: "+57", nombre: "Colombia", iso: "co" },
    { codigo: "+593", nombre: "Ecuador", iso: "ec" },
    { codigo: "+34", nombre: "Spain", iso: "es" },
    { codigo: "+1", nombre: "United States", iso: "us" },
    { codigo: "+52", nombre: "Mexico", iso: "mx" },
    { codigo: "+51", nombre: "Peru", iso: "pe" },
    { codigo: "+598", nombre: "Uruguay", iso: "uy" },
    { codigo: "+58", nombre: "Venezuela", iso: "ve" }
];


// --- 2. Definición de Expresiones Regulares (Reglas de validación) ---

// Valida que el nombre solo tenga letras y espacios (incluye tildes).
var regexNombre = /^[A-Za-zÁÉÍÓÚÑáéíóúñ ]+$/;

// Valida formato de correo estándar. Uso una sola barra invertida para que JS no se queje.
var regexCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Regla GENERAL para celulares del mundo (entre 7 y 12 números).
var regexCelularGeneral = /^[0-9]{7,12}$/;

// Regla ESPECIAL solo para Bolivia: Exactamente 8 dígitos, ni más ni menos.
var regexCelularBolivia = /^[0-9]{8}$/;

// Valida contraseña fuerte: Mayúscula, minúscula, número, símbolo y mínimo 6 caracteres.
var regexPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;


// --- 3. Iconos SVG para el ojo ---
// Los guardo en variables para no ensuciar el HTML con código repetido.
const svgOjoAbierto = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
const svgOjoCerrado = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>';


// --- 4. Funciones Utilitarias y Lógica del Selector de Países ---

var ulLista = document.getElementById("lista-items-pais");
var listaDropdown = document.getElementById("lista-paises");

// Construyo la URL de la bandera usando el código ISO (ej: 'bo' -> bandera de Bolivia)
function obtenerUrlBandera(iso) {
    return "https://flagcdn.com/w40/" + iso + ".png";
}

// Esta función llena la lista desplegable con los países y sus banderas
function cargarPaises(paises) {
    if (!ulLista) return; // Si no estamos en registro, no hago nada.
    ulLista.innerHTML = ""; 
    
    for (var i = 0; i < paises.length; i++) {
        var p = paises[i];
        var li = document.createElement("li");
        li.className = "item-pais";
        
        // Uso un cierre (closure) para recordar qué país se clickeó
        li.onclick = (function(pais) {
            return function() { seleccionarPais(pais); };
        })(p);

        li.innerHTML = `
            <img src="${obtenerUrlBandera(p.iso)}" class="flag-img" alt="${p.iso}">
            <span class="nombre">${p.nombre}</span>
            <span class="codigo">${p.codigo}</span>
        `;
        ulLista.appendChild(li);
    }
}

// Muestra u oculta el menú desplegable
function toggleListaPaises() {
    if (listaDropdown.style.display === "block") {
        listaDropdown.style.display = "none";
    } else {
        listaDropdown.style.display = "block";
        document.getElementById("input-buscador").focus(); // Pongo el foco para buscar rápido
    }
}

// Filtro la lista de países según lo que escriba el usuario
function filtrarPaises() {
    var texto = document.getElementById("input-buscador").value.toLowerCase();
    var filtrados = listaPaises.filter(function(pais) {
        return pais.nombre.toLowerCase().indexOf(texto) > -1;
    });
    cargarPaises(filtrados);
}

// Actualizo la vista cuando el usuario elige un país
function seleccionarPais(pais) {
    var imgHtml = '<img src="' + obtenerUrlBandera(pais.iso) + '" class="flag-img">';
    document.getElementById("flag-actual-container").innerHTML = imgHtml;
    
    document.getElementById("code-actual").textContent = pais.codigo;
    // Guardo el código en un input oculto para usarlo luego
    document.getElementById("valor-pais-oculto").value = pais.codigo;
    
    listaDropdown.style.display = "none";
}

// Cierro la lista si el usuario hace click afuera
window.onclick = function(event) {
    if (!event.target.matches('.pais-seleccionado') && !event.target.matches('.pais-seleccionado *') && !event.target.matches('.buscador-pais')) {
        if (listaDropdown) listaDropdown.style.display = "none";
    }
}

// Inicializo la lista al cargar
if (ulLista) {
    cargarPaises(listaPaises);
}

// Alterno entre ver contraseña y ocultarla, cambiando también el ícono
function mostrarOcultarPass(idInput) {
    var input = document.getElementById(idInput);
    var wrapper = input.parentElement;
    var iconoSpan = wrapper.querySelector('.icono-ojo');

    if (input.type === "password") {
        input.type = "text";
        iconoSpan.innerHTML = svgOjoAbierto;
    } else {
        input.type = "password";
        iconoSpan.innerHTML = svgOjoCerrado;
    }
}

// Función auxiliar para mostrar alertas de error o éxito
function mostrarMensaje(texto, tipo) {
    var parrafo = document.getElementById("mensaje-sistema");
    parrafo.textContent = texto;
    parrafo.className = "mensaje " + tipo;
}


// --- 5. Lógica del REGISTRO (Se ejecuta solo en registro.html) ---
var formRegistro = document.getElementById("form-registro");

if (formRegistro) {
    formRegistro.addEventListener("submit", function(event) {
        event.preventDefault(); // Evito que la página se recargue

        // Recojo los datos del formulario
        var nombre = document.getElementById("reg-nombre").value;
        var correo = document.getElementById("reg-correo").value;
        var password = document.getElementById("reg-pass").value;
        var codigoPais = document.getElementById("valor-pais-oculto").value;
        var numeroTelf = document.getElementById("reg-celular").value;
        
        // Construyo el número completo (Ej: +591 12345678)
        var celularCompleto = codigoPais + " " + numeroTelf;

        // Validamos el Nombre
        if (!regexNombre.test(nombre)) {
            mostrarMensaje("El nombre no es válido (solo letras).", "error");
            return;
        }

        // Validamos el Correo
        if (!regexCorreo.test(correo)) {
            mostrarMensaje("El correo no tiene un formato válido.", "error");
            return;
        }

        // --- VALIDACIÓN ESPECIAL DE CELULAR ---
        // Si el país es Bolivia (+591), soy estricto: deben ser 8 dígitos exactos.
        if (codigoPais === "+591") {
            if (!regexCelularBolivia.test(numeroTelf)) {
                mostrarMensaje("Para Bolivia, el celular debe tener exactamente 8 dígitos.", "error");
                return;
            }
        } else {
            if (!regexCelularGeneral.test(numeroTelf)) {
                mostrarMensaje("El celular debe tener entre 7 y 12 dígitos.", "error");
                return;
            }
        }

        // Validamos la fuerza de la Contraseña
        if (!regexPass.test(password)) {
            mostrarMensaje("La contraseña es débil. Use mayúsculas, números y símbolos.", "error");
            return;
        }

        // Si todo está correcto, creo el objeto del usuario
        var nuevoUsuario = {
            nombre: nombre,
            correo: correo,
            celular: celularCompleto,
            password: password,
            intentos: 0,      // Empieza con 0 errores
            bloqueado: false  // Empieza desbloqueado
        };

        // Guardo el usuario en el navegador (localStorage)
        localStorage.setItem("usuarioRegistrado", JSON.stringify(nuevoUsuario));

        mostrarMensaje("¡Usuario registrado con éxito! Redirigiendo...", "exito");
        
        // Espero un poco para que lea el mensaje y lo mando al login
        setTimeout(function() {
            window.location.href = "../index.html";
        }, 2000);
    });
}


// --- 6. Lógica del LOGIN (Se ejecuta solo en index.html) ---
var formLogin = document.getElementById("form-login");

if (formLogin) {
    formLogin.addEventListener("submit", function(event) {
        event.preventDefault();

        var correoIngresado = document.getElementById("login-usuario").value;
        var passIngresado = document.getElementById("login-pass").value;

        // Intento recuperar los datos del usuario guardado
        var usuarioGuardado = localStorage.getItem("usuarioRegistrado");
        
        // Primera verificación: ¿Existe el usuario?
        if (!usuarioGuardado) {
            mostrarMensaje("Esta cuenta no existe. Por favor, regístrese primero.", "error");
            return;
        }

        var usuarioObj = JSON.parse(usuarioGuardado);

        // Segunda verificación (IMPORTANTE):
        // Reviso si el correo coincide ANTES de verificar la contraseña.
        // Así evito bloquear la cuenta si alguien escribe mal el correo.
        if (usuarioObj.correo !== correoIngresado) {
            mostrarMensaje("El correo ingresado no pertenece a ninguna cuenta registrada.", "error");
            return;
        }

        // Si el correo es correcto, verifico si la cuenta está bloqueada
        if (usuarioObj.bloqueado === true) {
            mostrarMensaje("Cuenta bloqueada por intentos fallidos.", "error");
            document.getElementById("enlace-recuperar").style.display = "block";
            return;
        }

        // Si todo está bien, verifico la contraseña
        if (usuarioObj.password === passIngresado) {
            // ¡Login Exitoso!
            mostrarMensaje("Bienvenido al sistema, " + usuarioObj.nombre, "exito");
            
            // Reinicio los intentos fallidos a 0
            usuarioObj.intentos = 0;
            localStorage.setItem("usuarioRegistrado", JSON.stringify(usuarioObj));

        } else {
            // Contraseña Incorrecta -> Sumo un intento fallido
            usuarioObj.intentos = usuarioObj.intentos + 1;

            if (usuarioObj.intentos >= 3) {
                // Si llegó a 3 errores, bloqueo la cuenta
                usuarioObj.bloqueado = true;
                mostrarMensaje("Cuenta bloqueada por intentos fallidos.", "error");
                document.getElementById("enlace-recuperar").style.display = "block";
            } else {
                // Si no, solo le aviso cuántos intentos lleva
                mostrarMensaje("Contraseña incorrecta. Intento " + usuarioObj.intentos + " de 3.", "error");
            }

            // Guardo el estado actualizado (intentos o bloqueo)
            localStorage.setItem("usuarioRegistrado", JSON.stringify(usuarioObj));
        }
    });
}


// --- 7. Lógica de RECUPERACIÓN (Se ejecuta solo en recuperar.html) ---
var formRecuperar = document.getElementById("form-recuperar");

if (formRecuperar) {
    formRecuperar.addEventListener("submit", function(event) {
        event.preventDefault();

        var correoConfirmar = document.getElementById("rec-correo").value;
        var nuevaPass = document.getElementById("rec-pass").value;

        // Recupero datos
        var usuarioGuardado = localStorage.getItem("usuarioRegistrado");

        if (!usuarioGuardado) {
            mostrarMensaje("No existe ese usuario.", "error");
            return;
        }

        var usuarioObj = JSON.parse(usuarioGuardado);

        // Verifico que el correo sea el correcto
        if (usuarioObj.correo !== correoConfirmar) {
            mostrarMensaje("El correo no coincide con el registrado.", "error");
            return;
        }

        // Valido que la nueva contraseña sea segura
        if (!regexPass.test(nuevaPass)) {
            mostrarMensaje("La nueva contraseña no cumple los requisitos de seguridad.", "error");
            return;
        }

        // ACTUALIZO LOS DATOS DEL USUARIO
        usuarioObj.password = nuevaPass; // Guardo la nueva clave
        usuarioObj.bloqueado = false;    // Desbloqueo la cuenta
        usuarioObj.intentos = 0;         // Reseteo el contador de errores

        // Guardo los cambios en localStorage
        localStorage.setItem("usuarioRegistrado", JSON.stringify(usuarioObj));

        mostrarMensaje("Contraseña actualizada. Ahora puede iniciar sesión.", "exito");

        // Lo mando al login automáticamente
        setTimeout(function() {
            window.location.href = "../index.html";
        }, 2000);
    });
}
