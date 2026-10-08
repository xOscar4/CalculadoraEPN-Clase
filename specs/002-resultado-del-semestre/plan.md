# Plan 002 - Resultado del semestre

## 1. Archivos que se crean o modifican y responsabilidad

- src/domain/materias.ts: se reutiliza la validación de notas ya aprobada para la historia 001 y se extiende con la lógica pura del semestre. Aquí viven las funciones que reciben la nota del primer bimestre, la nota del segundo bimestre y devuelven el estado del semestre y el mensaje asociado. RF-1, RF-2, RF-3, RF-4.
- src/app/index.tsx (o la pantalla equivalente de la materia): se coordina el valor del input del segundo bimestre, se muestra el error cuando la entrada es inválida y se recalcula el resultado visible cada vez que el usuario corrije la nota. RF-1, RF-5.
- **tests**/domain/materias.test.ts: se agregan pruebas de dominio para los bordes del negocio, la validación de entrada y la evolución del resultado al corregir valores. RF-1, RF-2, RF-3, RF-4, RF-5.

## 2. Funciones puras de lógica

- parsearNota(entrada: string): número o error, ya existente y reutilizable. Se usa para validar la nota del segundo bimestre sin duplicar reglas ni introducir una segunda implementación. RF-1.
- calcularTotalSemestre(primerBimestre: number, segundoBimestre: number): number. Produces la suma exacta del acumulado del semestre sin depender del componente de React. RF-2, RF-3, RF-4.
- evaluarResultadoSemestre(primerBimestre: number, segundoBimestre: number): { estado: string; notaMinima?: number; error?: string }. Centraliza la clasificación: aprobado si la suma es 28 o más; supletorio si está entre 18 y 27.99; reprobado si es menor a 18. RF-2, RF-3, RF-4.
- calcularNotaNecesariaParaAprobar(totalActual: number): number. Devuelve 28 menos el total actual y se usa únicamente cuando el estado es supletorio. RF-3.

Estas funciones permanecen puras: no leen almacenamiento, no usan React y no mutan el estado del input. La vista solo llama a la lógica y presenta la respuesta.

## 3. Persistencia

- La nota del primer bimestre ya se obtiene y conserva en el almacenamiento previo de la historia 001; esta feature no debe editarlos ni regenerarlos.
- El cálculo del resultado usa la nota del primer bimestre disponible en memoria o en el modelo ya persistido, pero no se crea una nueva capa de almacenamiento para esta historia.
- La corrección del segundo bimestre se mantiene en el estado local del componente y no se almacena en AsyncStorage como dato final de la feature, porque la spec no lo exige y la constitución prioriza simplicidad.

## 4. Algoritmo en pseudocódigo

```text
entrada = valorActualDelInput
si entrada es vacía, tiene coma, no es numérica, tiene más de dos decimales o sale de 0 a 20:
    mostrarError('Escribe una nota entre 0 y 20 con hasta dos decimales.')
    ocultar resultado anterior
    conservar valor escrito
    terminar

segundo = Number(entrada)
primer = notaDelPrimerBimestreGuardada
suma = primer + segundo

si suma >= 28:
    estado = 'Aprobado'
    notaMinima = null
si 18 <= suma < 28:
    estado = 'Debes rendir supletorio'
    notaMinima = 28 - suma
si suma < 18:
    estado = 'Reprobado. No puedes rendir supletorio.'
    notaMinima = null

mostrar estado y, si aplica, notaMinima
```

## 5. Cómo se pinta en la interfaz

- La pantalla de la materia mantiene un TextInput para la nota del segundo bimestre junto al dato del primer bimestre ya registrado.
- Mientras el usuario escribe, el valor visible se conserva aunque sea inválido; el mensaje de error aparece de forma inmediata y el resultado anterior se oculta para evitar confusión.
- Cuando la nota es válida, el resultado se recalcula automáticamente y se muestra bajo el formulario:
  - Aprobado: estado visible con el texto exacto “Aprobado”.
  - Supletorio: “Debes rendir supletorio” y la nota mínima necesaria, expresada como la diferencia faltante para llegar a 28.
  - Reprobado: “Reprobado. No puedes rendir supletorio.”
- El patrón de interfaz sigue el estilo actual del proyecto: entradas con borde rojo cuando hay error, mensajes de validación y una sección de resultado visible sin perder el texto escrito.

## 6. Decisiones técnicas justificadas y alternativa descartada

- Decisión 1: mostrar el resultado final como un estado visible y un mensaje útil en la misma pantalla. Se basa en la decisión 1 de decisiones.md. Alternativa descartada: ocultar el resultado y forzar al usuario a calcular manualmente la diferencia; se rechaza porque la historia exige claridad inmediata y utilidad para el estudiante.
- Decisión 2: no borrar el valor escrito al detectar un error y recalcular al corregirlo. Se basa en la decisión 2 de decisiones.md. Alternativa descartada: limpiar el input al producir un error; se rechaza porque contradice la necesidad de corregir sin perder información.
- Decisión 3: definir los bordes con comparaciones estrictas y exactas para 18, 27.99 y 28. Se basa en la decisión 3 de decisiones.md. Alternativa descartada: redondear la suma antes de clasificar; se rechaza porque introduce ambigüedad y puede mover un valor de un lado a otro de los casos límite.

## 7. Estrategia de pruebas con Jest

- Pruebas de dominio en **tests**/domain/materias.test.ts para validar la regla de entrada (vacío, coma, rango, decimales, formato) y la clasificación de resultados en los límites del negocio.
- Casos mínimos obligatorios:
  - 20 + 8 = 28 → Aprobado.
  - 10 + 8.5 = 18.5 → Debes rendir supletorio y nota mínima 9.5.
  - 10 + 7.99 = 17.99 → Reprobado. No puedes rendir supletorio.
  - 8.555 o 21 o '' o '8,5' → error exacto.
  - corregir un valor inválido a uno válido debe actualizar el resultado sin borrar la nota escrita.
- Se prioriza la prueba del dominio porque la lógica de negocio es pura y cumple la constitución: las reglas de notas viven en funciones puras y la capa de interfaz solo coordina la entrada y la salida.

## 8. Cobertura de RF

- RF-1: validación en el dominio y ocultación del resultado anterior en la vista cuando la entrada es inválida.
- RF-2: clasificación de aprobado cuando la suma es 28 o más.
- RF-3: cálculo del supletorio con nota mínima necesaria cuando la suma está entre 18 y 27.99.
- RF-4: clasificación de reprobado cuando la suma es menor a 18.
- RF-5: recálculo al corregir la nota sin perder el valor ingresado.
