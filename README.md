# Sistema de Autenticación Web

Este proyecto es un desafío de programación web que incluye registro, inicio de sesión, bloqueo de seguridad y recuperación de contraseña.

## Tecnologías usadas
- HTML5
- CSS3
- JavaScript (Vanilla)
- LocalStorage (para persistencia de datos)

## Funcionalidades Explicadas

### 1. Registro y Expresiones Regulares
Para garantizar que los datos sean correctos, utilicé expresiones regulares (Regex):
- **Correo:** Valida que tenga formato de email real.
- **Contraseña:** Verifica que tenga mayúsculas, minúsculas, números y símbolos para seguridad fuerte.
- **Celular:** Solo acepta números entre 7 y 12 dígitos.

### 2. Manejo del Bloqueo
El sistema cuenta los intentos fallidos al iniciar sesión. 
- Cada vez que el usuario se equivoca, se suma +1 a una variable `intentos`.
- Si `intentos` llega a 3, se cambia el estado del usuario a `bloqueado: true`.
- Una vez bloqueado, el sistema impide el acceso y muestra el enlace de recuperación.

### 3. Recuperación de Contraseña
Este módulo permite al usuario definir una nueva clave. Al hacerlo exitosamente:
- Se actualiza la contraseña en el almacenamiento.
- Se reinicia el contador de intentos a 0.
- Se desbloquea la cuenta (`bloqueado: false`).

## Cómo probar el proyecto
1. Ingresar al enlace de GitHub Pages.
2. Ir a "Regístrate aquí" y crear una cuenta.
3. Intentar ingresar con la contraseña mal 3 veces para ver el bloqueo.
4. Usar "Recuperar contraseña" para cambiarla y desbloquear la cuenta.