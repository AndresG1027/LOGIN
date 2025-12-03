# Sistema de Registro y Login (Proyecto Web 1)

Este es un sistema básico de autenticación creado con HTML, CSS y JavaScript. Permite registrarse, iniciar sesión y recuperar la contraseña si se olvida.

## 🔗 Enlaces del Proyecto
* **GitHub:** https://github.com/AndresG1027/LOGIN.git
* **Page:** https://andresg1027.github.io/LOGIN/

## 📘 ¿Cómo funciona?

### 1. Validaciones (Regex)
Uso expresiones regulares simples para revisar que los datos estén bien escritos:
* **Nombre:** Solo permite letras y espacios.
* **Correo:** Revisa que tenga arroba (@) y punto (.).
* **Celular:** Si el país es Bolivia, exige 8 números. Si es otro, acepta entre 7 y 12.
* **Contraseña:** Pide mayúscula, minúscula, número y símbolo.

### 2. Guardado de Datos
No uso bases de datos complejas ni JSON. Guardo los datos directamente en el navegador (`localStorage`) variable por variable:
* `usr_nombre`
* `usr_correo`
* `usr_clave`

### 3. Bloqueo de Cuenta
Uso una variable `usr_intentos`. Cada vez que fallas la clave, le sumo 1. Si llega a 3, cambio la variable `usr_bloqueado` a "si" y ya no dejo entrar hasta que se recupere la cuenta.

### 4. Recuperación
Si pones el correo correcto y una clave nueva válida, el sistema sobrescribe la clave vieja en `localStorage` y pone el bloqueo en "no".
