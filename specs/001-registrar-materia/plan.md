# Plan 001 - Registrar una materia con la nota del primer bimestre

## Alcance y trazabilidad

La implementación cubre los RF aprobados sin cambiar la spec. La aceptación de guardado, presentación de la lista y persistencia también se traza a los escenarios 1 y 4 y a las definiciones de éxito, porque la spec no les asigna RF propios.

| Parte | RF / criterio cubierto |
| --- | --- |
| Validación del nombre requerido | RF-1, escenario 2 |
| Validación de nota | RF-2, escenario 2; decisiones 1, 2 y 7 |
| Normalización y rechazo de duplicados | RF-3, escenario 3; decisiones 3 y 8 |
| Guardado y presentación de materia creada | RF-1, RF-2, escenario 1, definición de éxito |
| Conservación de lo escrito ante errores | RF-1, RF-2, RF-3, definición de éxito; decisión 4 |
| Orden de la lista y nota visible | RF-3, escenario 1, definición de éxito; decisión 5 |
| Persistencia local entre sesiones | Escenario 4, objetivo y alcance aprobados |

## Archivos y responsabilidades

- `src/domain/materias.ts` (crear): tipos de materia y funciones puras para limpiar y normalizar nombres, validar y convertir notas, detectar duplicados, crear una materia válida y ordenar la lista. No importa React ni almacenamiento. Cubre RF-1, RF-2 y RF-3.
- `src/storage/materias.ts` (crear): lectura y escritura de la colección en AsyncStorage, aislando la API de persistencia de la lógica y la pantalla. Cubre el escenario 4.
- `src/app/index.tsx` (modificar): sustituir la pantalla de inicio de ejemplo por el formulario y la lista; cargar los datos al abrir, invocar las funciones de dominio y persistir los registros aceptados. Cubre RF-1, RF-2, RF-3 y escenarios 1, 2 y 4.
- `__tests__/domain/materias.test.ts` (crear): pruebas Jest de las funciones puras y sus casos límite. Cubre RF-1, RF-2 y RF-3.
- `__tests__/storage/materias.test.ts` (crear): pruebas Jest de serialización, lectura y escritura, con AsyncStorage aislado mediante mock. Cubre el escenario 4.

No se requieren dependencias nuevas: el proyecto ya declara `@react-native-async-storage/async-storage` y Jest. No se planifican edición, eliminación, segundo bimestre ni sincronización, que están fuera de alcance.

## Funciones puras

- `limpiarNombre(nombre)`: recorta extremos y reduce secuencias internas de espacios a uno, conservando mayúsculas y acentos para una presentación legible. RF-1 y RF-3; decisiones 3 y 6.
- `normalizarNombre(nombre)`: parte del nombre limpio, normaliza Unicode, elimina marcas diacríticas y compara sin distinguir mayúsculas. Se usa como identidad lógica de una materia. RF-3; decisión 3.
- `validarNombre(nombre, materias)`: devuelve el mensaje especificado para nombre vacío o duplicado, o éxito. Mensajes y campo de presentación según RF-1 y RF-3; decisiones 6 y 8.
- `parsearNota(entrada)`: recorta espacios externos, rechaza coma y formatos no numéricos o con más de dos decimales, y valida el intervalo inclusivo 0-20. Devuelve un número solo si es válida; en cualquier error de RF-2 devuelve el texto aprobado. Decisiones 1, 2 y 7.
- `crearMateria(nombre, nota, materias)`: compone las validaciones; ante error devuelve el resultado de validación sin mutar datos, y ante éxito devuelve un registro con nombre limpio, nota numérica e identidad estable basada en el nombre normalizado. RF-1, RF-2 y RF-3; decisiones 3 y 4.
- `ordenarMaterias(materias)`: devuelve una copia ordenada alfabéticamente en español por el nombre visible, sin mutar la entrada. Escenario 1 y decisión 5.

## Persistencia

Guardar un arreglo JSON de `{ id, nombre, nota }` bajo una clave propia de la feature en AsyncStorage; `id` usa el nombre normalizado, que es único bajo la regla de duplicados y estable para `FlatList`. La nota se guarda como número. Al iniciar, leer y decodificar el arreglo; al crear un registro válido, escribir la colección actualizada. La estrategia usa una dependencia ya instalada para cumplir el almacenamiento local sin añadir complejidad ni una dependencia, conforme al principio 1 de la constitución. La especificación no define un texto ni flujo visible para fallos de almacenamiento: no inventar mensajes durante la implementación.

## Algoritmo

```text
al iniciar pantalla:
  leer materias desde AsyncStorage
  mostrar ordenarMaterias(materias)

al enviar formulario:
  nombreLimpio = limpiarNombre(nombreIngresado)
  resultado = crearMateria(nombreLimpio, notaIngresada, materiasActuales)
  si resultado contiene error:
    mostrar el mensaje junto al campo correspondiente
    conservar nombreIngresado y notaIngresada
    terminar
  actualizadas = ordenarMaterias(materiasActuales + resultado.materia)
  guardar actualizadas en AsyncStorage
  actualizar estado y lista con actualizadas
```

La escritura debe completarse antes de presentar la operación como guardada; una validación fallida no altera ni el estado de materias ni el almacenamiento. La lógica anterior vive en funciones puras salvo las operaciones de carga/escritura, que quedan en storage y en la coordinación de pantalla. Cubre RF-1, RF-2, RF-3 y escenarios 1, 2 y 4.

## Interfaz

En `src/app/index.tsx`, sustituir el scaffold por una pantalla en español con campos de nombre y nota, botón de registro, errores asociados a sus campos y una `FlatList` ordenada con nombre y nota juntos. El campo de nota usa `keyboardType="decimal-pad"`; se admiten los formatos que define RF-2, incluida la política de rechazo de coma. Mantener los valores escritos ante cualquier error. Usar `SafeAreaView`, contenido desplazable cuando aparezca el teclado, controles táctiles de al menos 44 puntos, claves estables y mensajes comprensibles sin depender solo del color, según `rn-conventions`.

Aplicar en la pantalla la paleta de `epn-brand`: fondo `#e2e4e9`, campos y superficie de lista blancos, texto `#111111`, encabezado `#001F3F` con texto blanco y botón primario `#357ca5` con texto blanco. No crear colores nuevos ni cambiar globalmente el tema fuera de esta pantalla. No incluir controles de edición o eliminación. Esta vista cubre RF-1, RF-2, RF-3 y los escenarios 1-4.

## Decisiones técnicas

- **Representación:** arreglo de objetos `{ id, nombre, nota }` serializado como JSON, porque solo se gestiona una colección local sencilla; alternativa descartada: una base de datos tabular, innecesaria para el alcance y que agregaría complejidad o dependencias. La identidad usa `normalizarNombre` para aprovechar la unicidad ya exigida por RF-3 y mantener claves estables; alternativa descartada: índice de lista, que no es estable al ordenar. Relacionado con la decisión 3.
- **Almacenamiento:** AsyncStorage ya presente en `package.json`, suficiente para conservar una colección local entre sesiones y sin instalación adicional; alternativa descartada: almacenamiento remoto, explícitamente fuera de alcance, o incorporar otra biblioteca. El archivo `decisiones.md` no contiene un número de decisión sobre tecnología de almacenamiento; esta elección implementa el requisito local del escenario 4 sin alterar comportamiento visible.
- **Validación:** mantener las reglas en funciones puras para que Jest compruebe bordes sin React ni I/O, conforme al principio 3 de la constitución; alternativa descartada: validar solo en el componente, que dificultaría aislar las reglas.

## Estrategia de pruebas

- Ejecutar `npx jest __tests__/domain/materias.test.ts` para validar nombre vacío, espacios, mayúsculas, acentos, duplicados, nota vacía, coma, límites 0 y 20, más de dos decimales y orden alfabético. Cada caso enlaza a RF-1, RF-2 o RF-3 y a las decisiones 1-8 pertinentes.
- Ejecutar `npx jest __tests__/storage/materias.test.ts` con AsyncStorage simulado para verificar escritura y lectura de nombre y nota entre inicializaciones. Cubre el escenario 4.
- Ejecutar `npx jest` para la suite completa al terminar las tareas de lógica.
- Verificar en Expo Go los escenarios de interfaz con la lista manual de `rn-conventions`: orientación vertical y giro, teclado sin tapar campos ni botón, separador decimal ofrecido por el teclado y rechazo/aceptación tal como define la spec, persistencia tras cerrar por completo, y textos de estado legibles sin depender del color. Añadir comprobación manual de que los errores aparecen junto al campo correcto, conservan ambas entradas y que la lista muestra materias en orden con su nota. Cubre RF-1, RF-2, RF-3 y escenarios 1-4.
