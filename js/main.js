/* ARCHIVO PRINCIPAL DE JAVASCRIPT
    Aquí manejo el registro, el login y la recuperación de cuenta.
    Uso localStorage para guardar los datos como si fuera una base de datos simple.
    También controlo el selector de países con imágenes reales.
*/

// --- 1. Datos para el selector de países ---
// Lista de objetos con código ISO para cargar las banderas desde internet.
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

// Valida formato de correo estándar (texto @ texto . extension).
// Nota: Solo uso una barra invertida para el punto, así JS lo entiende bien.
var regexCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Valida celular: solo números, entre 7 y 12 dígitos.
var regexCelularNum = /^[0-9]{7,12}$/;

// Valida contraseña fuerte:
// - Al menos una minúscula (?=.*[a-z])
// - Al menos una mayúscula (?=.*[A-Z])
// - Al menos un número (?=.*\d)
// - Al menos un símbolo (?=.*[\W_])
// - Mínimo 6 caracteres total
var regexPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;


// --- 3. Iconos SVG para el ojo (Abierto y Cerrado) ---
// Los guardo en variables para mantener el HTML limpio y ordenado.
const svgOjoAbierto = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
const svgOjoCerrado = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>';


// --- 4. Funciones Utilitarias y Lógica del Selector de Países ---

var ulLista = document.getElementById("lista-items-pais");
var listaDropdown = document.getElementById("lista-paises");

// Función simple para obtener la URL de la bandera según el código ISO
function obtenerUrlBandera(iso) {
    return "https://flagcdn.com/w40/" + iso + ".png";
}

// Esta función carga la lista de países en el dropdown
function cargarPaises(paises) {
    if (!ulLista) return; // Si no estamos en registro, no hacemos nada
    ulLista.innerHTML = ""; // Limpiamos la lista antes de llenarla
    
    for (var i = 0; i < paises.length; i++) {
        var p = paises[i];
        var li = document.createElement("li");
        li.className = "item-pais";
        
        // Truco: usamos una funcion dentro para que recuerde qué país es al hacer click
        li.onclick = (function(pais) {
            return function() { seleccionarPais(pais); };
        })(p);

        // Dibujamos cada item usando la etiqueta IMG para que se vea la bandera real
        li.innerHTML = `
            <img src="${obtenerUrlBandera(p.iso)}" class="flag-img" alt="${p.iso}">
            <span class="nombre">${p.nombre}</span>
            <span class="codigo">${p.codigo}</span>
        `;
        ulLista.appendChild(li);
    }
}

// Abre y cierra la lista de países
function toggleListaPaises() {
    if (listaDropdown.style.display === "block") {
        listaDropdown.style.display = "none";
    } else {
        listaDropdown.style.display = "block";
        document.getElementById("input-buscador").focus(); // Ponemos el cursor listo para buscar
    }
}

// Filtra la lista mientras escribes
function filtrarPaises() {
    var texto = document.getElementById("input-buscador").value.toLowerCase();
    
    // Filtramos el array original
    var filtrados = listaPaises.filter(function(pais) {
        return pais.nombre.toLowerCase().indexOf(texto) > -1;
    });
    cargarPaises(filtrados);
}

// Cuando eliges un país, actualizamos la vista y guardamos el dato
function seleccionarPais(pais) {
    // Actualizamos la imagen principal
    var imgHtml = '<img src="' + obtenerUrlBandera(pais.iso) + '" class="flag-img">';
    document.getElementById("flag-actual-container").innerHTML = imgHtml;
    
    document.getElementById("code-actual").textContent = pais.codigo;
    document.getElementById("valor-pais-oculto").value = pais.codigo;
    listaDropdown.style.display = "none";
}

// Si haces click fuera de la lista, la cerramos para que no estorbe
window.onclick = function(event) {
    if (!event.target.matches('.pais-seleccionado') && !event.target.matches('.pais-seleccionado *') && !event.target.matches('.buscador-pais')) {
        if (listaDropdown) listaDropdown.style.display = "none";
    }
}

// Inicializamos la lista si estamos en la página correcta
if (ulLista) {
    cargarPaises(listaPaises);
}

// Función del OJO: Muestra u oculta la contraseña y cambia el ícono
function mostrarOcultarPass(idInput) {
    var input = document.getElementById(idInput);
    var wrapper = input.parentElement;
    var iconoSpan = wrapper.querySelector('.icono-ojo');

    // Si es password lo cambio a texto, si es texto lo regreso a password
    if (input.type === "password") {
        input.type = "text";
        iconoSpan.innerHTML = svgOjoAbierto;
    } else {
        input.type = "password";
        iconoSpan.innerHTML = svgOjoCerrado;
    }
}

// Función pequeña para mostrar mensajes en pantalla (Error o Éxito)
function mostrarMensaje(texto, tipo) {
    var parrafo = document.getElementById("mensaje-sistema");
    parrafo.textContent = texto;
    // Quitamos clases viejas y ponemos la nueva (error o exito)
    parrafo.className = "mensaje " + tipo;
}


// --- 5. Lógica del REGISTRO (Se ejecuta solo si estamos en registro.html) ---
var formRegistro = document.getElementById("form-registro");

if (formRegistro) {
    formRegistro.addEventListener("submit", function(event) {
        event.preventDefault(); // Evito que se recargue la página

        // Obtengo los valores de los inputs
        var nombre = document.getElementById("reg-nombre").value;
        var correo = document.getElementById("reg-correo").value;
        var password = document.getElementById("reg-pass").value;
        var codigoPais = document.getElementById("valor-pais-oculto").value;
        var numeroTelf = document.getElementById("reg-celular").value;
        var celularCompleto = codigoPais + " " + numeroTelf;

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

        // Validamos Celular (Solo la parte numérica)
        if (!regexCelularNum.test(numeroTelf)) {
            mostrarMensaje("El celular debe tener entre 7 y 12 números.", "error");
            return;
        }

        // Validamos Contraseña Segura
        if (!regexPass.test(password)) {
            mostrarMensaje("La contraseña es débil. Debe tener mayúscula, minúscula, número y símbolo.", "error");
            return;
        }

        // Si todo está bien, guardamos en el navegador (localStorage)
        // Guardamos un objeto con los datos del usuario
        var nuevoUsuario = {
            nombre: nombre,
            correo: correo,
            celular: celularCompleto,
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


// --- 6. Lógica del LOGIN (Se ejecuta solo en index.html) ---
var formLogin = document.getElementById("form-login");

if (formLogin) {
    formLogin.addEventListener("submit", function(event) {
        event.preventDefault();

        var correoIngresado = document.getElementById("login-usuario").value;
        var passIngresado = document.getElementById("login-pass").value;

        // Recuperamos al usuario guardado
        var usuarioGuardado = localStorage.getItem("usuarioRegistrado");
        
        // Primero pregunto: ¿Existe algún usuario guardado?
        if (!usuarioGuardado) {
            mostrarMensaje("Esta cuenta no existe. Por favor, regístrese primero.", "error");
            return;
        }

        // Si existe, convierto el texto a objeto para poder usarlo
        var usuarioObj = JSON.parse(usuarioGuardado);

        // Aquí está la clave: Verifico si el correo coincide ANTES de mirar la contraseña.
        // Si el correo está mal, no debo sumar intentos fallidos.
        if (usuarioObj.correo !== correoIngresado) {
            mostrarMensaje("El correo ingresado no pertenece a ninguna cuenta registrada.", "error");
            return;
        }

        // Si el correo es correcto, reviso si la cuenta ya está bloqueada por errores previos
        if (usuarioObj.bloqueado === true) {
            mostrarMensaje("Cuenta bloqueada por intentos fallidos.", "error");
            document.getElementById("enlace-recuperar").style.display = "block";
            return;
        }

        // Ahora sí, si el correo está bien y no está bloqueado, valido la contraseña
        if (usuarioObj.password === passIngresado) {
            // LOGIN EXITOSO
            mostrarMensaje("Bienvenido al sistema, " + usuarioObj.nombre, "exito");
            
            // Reiniciamos los intentos a 0 porque entró correctamente
            usuarioObj.intentos = 0;
            localStorage.setItem("usuarioRegistrado", JSON.stringify(usuarioObj));

        } else {
            // LOGIN FALLIDO (Contraseña incorrecta)
            usuarioObj.intentos = usuarioObj.intentos + 1; // Aquí sí sumamos el error

            if (usuarioObj.intentos >= 3) {
                // Si llega a 3 errores, bloqueamos la cuenta
                usuarioObj.bloqueado = true;
                mostrarMensaje("Cuenta bloqueada por intentos fallidos.", "error");
                document.getElementById("enlace-recuperar").style.display = "block";
            } else {
                // Si aun no llega a 3, solo avisamos
                mostrarMensaje("Contraseña incorrecta. Intento " + usuarioObj.intentos + " de 3.", "error");
            }

            // Guardamos el contador actualizado en localStorage
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
        usuarioObj.password = nuevaPass; // Cambiamos la clave por la nueva
        usuarioObj.bloqueado = false;    // Desbloqueamos la cuenta
        usuarioObj.intentos = 0;         // Reiniciamos los intentos a cero

        // Guardamos los cambios en el navegador
        localStorage.setItem("usuarioRegistrado", JSON.stringify(usuarioObj));

        mostrarMensaje("Contraseña actualizada. Ahora puede iniciar sesión.", "exito");

        // Redirigimos al login después de un ratito
        setTimeout(function() {
            window.location.href = "../index.html";
        }, 2000);
    });
}