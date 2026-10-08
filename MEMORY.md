# MEMORY.md - Calculadora de Supletorio

Estado del trabajo entre sesiones. Maximo ~50 líneas.

## Estado actual

- Las T1 a T6 de la spec 002 quedaron implementadas y validadas con pruebas de dominio y la integración de la vista: la lógica reutiliza `parsearNota`, clasifica los bordes 18, 27.99 y 28 según la spec, calcula la nota mínima necesaria para aprobar, presenta el error exacto para entrada inválida y limpia el resultado anterior al corregir la nota del segundo bimestre.
- La suite de dominio en `__tests__/domain/materias.test.ts` pasó con 15/15 casos y cubre aprobado, supletorio, reprobado, validación de entrada, integración de validación y resultado y la corrección sin perder el texto escrito.
- La T7 queda pendiente de verificación manual en Expo Go; la lógica ya está validada, pero la evidencia final de la interfaz aún requiere la prueba del flujo real en dispositivo.

## Proximos pasos.

- Revisar manualmente la historia 002 en Expo Go siguiendo la lista de la convención de interfaz y confirmar la validación antes de cerrar la T7.
