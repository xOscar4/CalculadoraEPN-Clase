# Decisiones para HU-001 - Registrar una materia

1. Pregunta: ¿Cuál es el rango válido para la nota del primer bimestre?
   Respuesta: La nota debe estar entre 0 y 20.
   Motivo: Define el límite de validación y cambia directamente cuándo la aplicación acepta o rechaza la nota que el usuario ingresa.

2. Pregunta: ¿La nota puede incluir decimales o solo enteros?
   Respuesta: La nota puede incluir decimales.
   Motivo: Permite registrar valores reales del primer bimestre sin bloquear notas intermedias que afectan la forma en que el usuario guarda la materia.

3. Pregunta: Si una materia se repite con diferencias mínimas, como "Matemática" y "matemática" o con espacios extra, ¿debe considerarse la misma materia?
   Respuesta: Sí. La aplicación debe normalizar espacios y comparar sin distinguir mayúsculas y minúsculas.
   Motivo: Evita duplicados por variaciones superficiales y define el comportamiento visible al intentar guardar la misma materia otra vez.

4. Pregunta: Cuando ocurre un error de validación, ¿la app conserva lo que el usuario ya escribió para corregirlo o limpia el formulario completo?
   Respuesta: La aplicación debe conservar los valores ingresados y mostrar el error para que el usuario corrija solo lo necesario.
   Motivo: Cambia la experiencia del usuario porque no pierde información ya escrita y facilita la corrección del problema.

5. Pregunta: ¿Cómo debería mostrarse la lista de materias cuando ya hay varias registradas?
   Respuesta: La lista debe ordenarse alfabéticamente por nombre.
   Motivo: Define el orden visible de los datos guardados y hace más fácil encontrar y comparar materias en la interfaz.

6. Pregunta: ¿Qué texto debe mostrarse cuando el nombre de la materia está vacío?
   Respuesta: Debe mostrarse "Escribe el nombre de la materia.".
   Motivo: El sistema debe indicar de forma explícita que el campo es obligatorio y evitar que el usuario avance con datos incompletos.

7. Pregunta: ¿Qué texto debe mostrarse cuando la nota está vacía o inválida y cómo se debe tratar el formato?
   Respuesta: Debe mostrarse "Escribe una nota entre 0 y 20 con hasta dos decimales."; los espacios al inicio y al final se ignoran antes de validar; la coma se rechaza con ese mismo mensaje.
   Motivo: Define el criterio de validación visible para el usuario y evita aceptar formatos ambiguos o inconsistentes.

8. Pregunta: ¿Qué mensaje debe mostrarse cuando la materia ya existe y dónde debe aparecer el aviso?
   Respuesta: Debe mostrarse "Ya tienes una materia con ese nombre." junto al campo del nombre, igual que el aviso de nombre vacío.
   Motivo: La validación de duplicados debe ser visible en el mismo punto de entrada y seguir el mismo patrón de retroalimentación del formulario.
