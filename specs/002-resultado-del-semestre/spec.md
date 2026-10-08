# Spec 002 - Resultado del semestre

Estado: aprobada
HU de origen: docs/historias/HU-002.md

## Objetivo

Permitir calcular y mostrar el estado del semestre cuando el estudiante ingresa la nota del segundo bimestre, usando la nota del primer bimestre ya registrada, validando la entrada y comunicando claramente si aprobó, debe rendir supletorio o reprobó.

## Alcance

Incluye:

- ingreso de la nota del segundo bimestre
- uso de la nota del primer bimestre ya guardada
- cálculo del total acumulado del semestre
- validación del rango y número de decimales
- estado final del semestre: aprobado, supletorio o reprobado
- cálculo de la nota mínima necesaria para aprobar en caso de supletorio
- actualización automática del resultado al corregir la nota
- ocultar el resultado anterior cuando la nueva nota es inválida

No incluye:

- edición de la nota del primer bimestre
- cálculo de promedios por materia o por carrera
- sincronización con backend ni nube
- eliminación o edición del registro de la materia
- cálculo de otra nota distinta a la del segundo bimestre

## Reglas de negocio

### 1. Nota del segundo bimestre

- La nota es obligatoria para calcular el resultado del semestre.
- El valor permitido es numérico y puede incluir decimales.
- El rango válido es de 0 a 20 inclusive.
- Si la nota está vacía, fuera del rango, con más de dos decimales o con formato inválido, la aplicación no debe calcular el resultado.
- Si el usuario corrige una nota inválida, el sistema debe conservar el valor escrito para que pueda corregirse sin perderlo.

### 2. Cálculo del resultado

- La aplicación calcula la suma de la nota del primer bimestre y la nota del segundo bimestre.
- Si la suma es 28 o más, el estudiante está aprobado.
- Si la suma está entre 18 y 27.99 inclusive, el estudiante debe rendir supletorio.
- Si la suma es menor a 18, el estudiante reprobó y no puede rendir supletorio.
- En caso de supletorio, la aplicación debe indicar la nota mínima necesaria para aprobar, calculada sobre el total de 28.

### 3. Resultado visible

- La aplicación debe mostrar un mensaje claro con el estado final del semestre.
- En supletorio, el mensaje debe incluir la nota mínima necesaria para aprobar o la diferencia faltante.
- Cuando la nota ingresada cambia, el resultado visible debe recalcularse de inmediato.
- Si la nota nueva es inválida, el sistema debe mostrar el error y no conservar un resultado obsoleto.

### 4. Persistencia del dato base

- La nota del primer bimestre ya debe estar disponible desde la historia anterior y no debe modificarse en esta feature.
- La lógica de cálculo debe reutilizar la validación de notas ya aprobada para la historia 001.

## Criterios de aceptación

### Escenario 1: Ya aprobé

Dado que tengo registrada la nota del primer bimestre
Cuando ingreso la nota del segundo bimestre y la suma total es 28 o más
Entonces la aplicación me indica que aprobé

### Escenario 2: Debo rendir supletorio

Dado que tengo registrada la nota del primer bimestre
Cuando ingreso la nota del segundo bimestre y la suma total está entre 18 y 27.99
Entonces la aplicación me indica que debo rendir supletorio
Y me dice cuánto necesito sacar para aprobar

### Escenario 3: Reprobé

Dado que tengo registrada la nota del primer bimestre
Cuando ingreso la nota del segundo bimestre y la suma total es menor que 18
Entonces la aplicación me indica que reprobé y que no puede rendir supletorio

### Escenario 4: Nota inválida

Dado que estoy ingresando la nota del segundo bimestre
Cuando ingreso un valor fuera del rango permitido o con más de dos decimales
Entonces la aplicación me avisa y no calcula nada

### Escenario 5: Corregir la nota

Dado que ya vi mi resultado
Cuando cambio la nota del segundo bimestre
Entonces el resultado se actualiza con la nueva suma

## Definiciones de éxito

La historia está completa cuando:

- el usuario puede ingresar la nota del segundo bimestre
- la suma total se evalúa correctamente en los bordes del negocio
- la app informa de manera clara si el estudiante aprobó, debe rendir supletorio o reprobó
- la nota mínima necesaria para aprobar se muestra cuando corresponde
- los errores de validación impiden cálculos con valores inválidos
- al corregir la nota, el resultado visible se recalcula sin perder el valor ingresado

## Requisitos funcionales

- RF-1: CUANDO el usuario ingresa una nota del segundo bimestre fuera del rango de 0 a 20, vacía, con más de dos decimales o con formato inválido, EL SISTEMA muestra el mensaje "Escribe una nota entre 0 y 20 con hasta dos decimales." y no calcula un resultado. Origen: Escenario 4 y decisión sobre validación de notas.
- RF-2: CUANDO la suma de la nota del primer bimestre y la del segundo es 28 o más, EL SISTEMA muestra el estado "Aprobado". Origen: Escenario 1 y decisión sobre casos límite.
- RF-3: CUANDO la suma de la nota del primer bimestre y la del segundo está entre 18 y 27.99 inclusive, EL SISTEMA muestra el estado "Debes rendir supletorio" y la nota mínima necesaria para aprobar, calculada como 28 menos la suma actual. Origen: Escenario 2 y decisión sobre casos límite.
- RF-4: CUANDO la suma de la nota del primer bimestre y la del segundo es menor a 18, EL SISTEMA muestra el estado "Reprobado. No puedes rendir supletorio." Origen: Escenario 3 y decisión sobre casos límite.
- RF-5: CUANDO el usuario corrige la nota del segundo bimestre, EL SISTEMA recalcula y actualiza el resultado visible sin borrar la nota que ya está escrita. Origen: Escenario 5 y decisión sobre corrección.

## Observaciones de ingeniería

- La nota del primer bimestre ya se valida en la historia anterior; esta feature reutiliza ese comportamiento para evitar duplicar reglas de negocio.
- El resultado del semestre es un cálculo derivado y debe mantenerse centralizado en funciones puras, con el componente de vista solo coordinando la entrada y la presentación.
- La validación debe rechazar formatos ambiguos de entrada sin ocultar la nota que el estudiante está corrigiendo.
