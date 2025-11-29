# Desafío de Programación Web: Sistema de Autenticación

Este proyecto consiste en un sistema completo de registro, inicio de sesión y recuperación de contraseña, desarrollado con **HTML, CSS y JavaScript (Vanilla)**. El sistema utiliza `localStorage` para simular una base de datos y mantener la persistencia de los datos del usuario en el navegador.

## 🔗 Enlaces del Proyecto (Obligatorio)

* **Repositorio en GitHub:** https://github.com/AndresG1027/LOGIN.git
* **Proyecto publicado (GitHub Pages):** https://andresg1027.github.io/LOGIN/

---

## 📘 Documentación Técnica

A continuación se detalla la lógica implementada para cumplir con los requerimientos de seguridad y validación.

### 1. Explicación de las Expresiones Regulares (Regex)

Para garantizar que los datos ingresados sean correctos y seguros, se definieron las siguientes reglas en el archivo `main.js`:

* **Nombre:** `/^[A-Za-zÁÉÍÓÚÑáéíóúñ ]+$/`
  * Permite letras mayúsculas, minúsculas, vocales con tilde y la letra Ñ. No permite números ni símbolos especiales.
* **Correo Electrónico:** `/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/`
  * Valida el formato estándar de un email (usuario + @ + dominio + extensión).
* **Celular:** `/^[0-9]{7,12}$/`
  * Estrictamente numérico. Se asegura de que el número tenga una longitud lógica (entre 7 y 12 dígitos).
* **Contraseña Segura:** `/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/`
  * Esta es la validación más estricta. Obliga a que la contraseña tenga al menos: una minúscula, una mayúscula, un número, un símbolo especial y un mínimo de 6 caracteres.

### 2. Manejo del Bloqueo de Cuenta

El sistema protege contra intentos de fuerza bruta mediante un contador interno:

1. Cada vez que el usuario intenta iniciar sesión con la contraseña incorrecta, se incrementa la propiedad `intentos` en el objeto del usuario guardado en `localStorage`.
2. Si `intentos` llega a **3**, se cambia la propiedad `bloqueado` a `true`.
3. Una vez bloqueado, el sistema impide cualquier acceso futuro (incluso si la contraseña es correcta) y muestra un mensaje rojo junto con el enlace para recuperar la contraseña.

### 3. Cómo se Valida la Contraseña

La validación ocurre en dos momentos:

* **En el Registro:** Antes de guardar al usuario, utilizamos el método `.test()` de la expresión regular contra el valor del input. Si devuelve `false`, se detiene el proceso y se alerta al usuario.
* **En el Login:** Se compara la contraseña ingresada estrictamente contra la contraseña almacenada en el objeto `usuarioRegistrado` (recuperado mediante `JSON.parse`).

### 4. Cómo se Actualiza la Contraseña Olvidada

El módulo de recuperación (`recuperar.html`) sigue este flujo lógico:

1. Verifica que el correo ingresado coincida con el almacenado.
2. Solicita una nueva contraseña y la valida nuevamente con la expresión regular de seguridad.
3. Si todo es correcto, el sistema realiza tres acciones en el objeto del usuario:
    * Sobrescribe la contraseña anterior con la nueva.
    * Reinicia el contador de `intentos` a **0**.
    * Cambia el estado de `bloqueado` a **false**.
4. Finalmente, guarda el objeto actualizado en `localStorage`, permitiendo al usuario iniciar sesión nuevamente.

---

## 📂 Estructura del Proyecto

* `html/`: Contiene las vistas de registro y recuperación.
* `css/`: Hoja de estilos con diseño responsivo y tema profesional.
* `js/`: Lógica principal del sistema.
* `index.html`: Pantalla principal de inicio de sesión.


