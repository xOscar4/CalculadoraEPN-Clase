# Spec 001 - Registrar una materia con la nota del primer bimestre

Estado : aprobada
HU de origen: docs/historias/HU-001.md

## Objetivo
Permitir registrar una nueva materia con la nota del primer bimestre, validando datos esenciales, evitando duplicados y conservando la información en el almacenamiento local del dispositivo.

## Alcance
Incluye:
- ingreso del nombre de la materia
- ingreso de la nota del primer bimestre
- validación de campos obligatorios y rango permitido
- prevención de materias duplicadas
- orden alfabético de la lista
- persistencia de los datos entre sesiones

No incluye:
- edición de materias ya guardadas
- registro del segundo bimestre
- cálculo automático del promedio final
- sincronización con backend ni nube

## Reglas de negocio

### 1. Nombre de la materia
- El nombre es obligatorio.
- Se debe aceptar texto con espacios y mayúsculas/minúsculas.
- Se debe normalizar para evitar duplicados por diferencias superficiales:
  - espacios extras al inicio, final o entre palabras
  - mayúsculas y minúsculas
  - acentos y tildes deben tratarse de forma equivalente para comparación
- El nombre guardado se presenta con formato limpio y legible.

### 2. Nota del primer bimestre
- La nota es obligatoria.
- El valor permitido es numérico y puede incluir decimales.
- El rango válido es de 0 a 20 inclusive.
- Si el valor se ingresa con coma, debe tratarse como equivalente a decimal con punto.
- Si la nota está vacía o fuera del rango, la materia no debe guardarse.

### 3. Duplicados
- Si ya existe una materia con el mismo nombre, ignorando mayúsculas, espacios y acentos, la aplicación debe rechazar la creación duplicada.
- El usuario debe recibir un mensaje claro indicando que la materia ya está registrada.

### 4. Persistencia
- La materia registrada debe conservarse tras cerrar y volver a abrir la app.
- Los datos deben guardarse localmente en almacenamiento persistente del dispositivo.

### 5. Presentación de la lista
- La lista de materias debe mostrarse ordenada alfabéticamente por nombre.
- La nota se visualiza junto a cada materia.

## Criterios de aceptación

### Escenario 1: Guardar una materia
Dado que quiero registrar una materia nueva
Cuando ingreso su nombre y la nota del primer bimestre
Entonces la materia queda guardada y se muestra en la lista

### Escenario 2: Datos incompletos o inválidos
Dado que estoy registrando una materia
Cuando dejo el nombre o la nota vacíos, o ingreso una nota fuera del rango permitido
Entonces la aplicación muestra el error correspondiente y no guarda la materia

### Escenario 3: Materia repetida
Dado que ya tengo una materia con ese nombre
Cuando intento registrarla otra vez
Entonces la aplicación advierte que ya existe y no la duplica

### Escenario 4: Conservar mis datos
Dado que registré una materia
Cuando cierro y vuelvo a abrir la aplicación
Entonces la materia sigue guardada con su nota

## Definiciones de éxito
La historia está completa cuando:
- el usuario puede guardar una materia válida
- los errores se muestran sin perder la información ya escrita
- no se crean duplicados con el mismo nombre, aunque varíe el formato
- los datos persisten al reiniciar la app
- la lista se presenta en orden alfabético

## Requisitos funcionales
- RF-1: CUANDO el usuario deja vacío el nombre de la materia, EL SISTEMA muestra el mensaje "Escribe el nombre de la materia." junto al campo del nombre y no guarda la materia. Origen: Escenario 2 y decisión sobre texto de validación.
- RF-2: CUANDO el usuario ingresa una nota vacía, fuera del rango de 0 a 20, con más de dos decimales, con coma o con espacios alrededor del valor, EL SISTEMA ignora los espacios al inicio y al final, rechaza la coma con el mismo mensaje y muestra "Escribe una nota entre 0 y 20 con hasta dos decimales." sin guardar la materia. Origen: Escenario 2 y decisión sobre validación de la nota.
- RF-3: CUANDO el usuario intenta registrar una materia cuyo nombre ya existe ignorando mayúsculas, espacios y acentos, EL SISTEMA muestra "Ya tienes una materia con ese nombre." junto al campo del nombre y no crea un duplicado. Origen: Escenario 3 y decisión sobre duplicados.

