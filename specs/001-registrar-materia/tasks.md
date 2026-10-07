# Tareas 001 - Registrar una materia con la nota del primer bimestre

- [x] **T1. Implementar limpieza y normalización de nombres con pruebas Jest (20 min).** RF-1, RF-3; decisiones 3 y 6.
  - Hecho cuando: `npx jest __tests__/domain/materias.test.ts` pasa casos de nombre vacío, recorte y reducción de espacios, diferencias de mayúsculas y acentos.
- [x] **T2. Implementar parseo y validación pura de la nota con pruebas Jest (20 min).** RF-2; decisiones 1, 2 y 7.
  - Hecho cuando: `npx jest __tests__/domain/materias.test.ts` pasa nota vacía, límites 0 y 20, fuera de rango, coma, espacios externos y más de dos decimales.
- [x] **T3. Implementar registro, rechazo de duplicados y orden con pruebas Jest (25 min).** RF-1, RF-2, RF-3; decisiones 3, 4, 5 y 8.
  - Hecho cuando: `npx jest __tests__/domain/materias.test.ts` confirma que errores no mutan la colección, los duplicados se rechazan y la lista ordenada incluye el registro válido.
- [x] **T4. Crear el adaptador de persistencia local y sus pruebas Jest (25 min).** Escenario 4.
  - Hecho cuando: `npx jest __tests__/storage/materias.test.ts` verifica que una lista escrita se recupera íntegra en una lectura posterior usando AsyncStorage simulado.
- [x] **T5. Construir formulario accesible y carga inicial de materias (25 min).** RF-1, RF-2; escenarios 1, 2 y 4.
  - Hecho cuando: en Expo Go se ven ambos campos, botón y estados de carga/lista; se respetan safe area, el campo decimal y el teclado no oculta el contenido ni la acción.
- [x] **T6. Conectar validaciones, errores y conservación de entradas (20 min).** RF-1, RF-2, RF-3; escenarios 2 y 3; decisión 4.
  - Hecho cuando: en Expo Go se comprueban los textos exactos junto al campo indicado, no se crea registro inválido o duplicado y ambas entradas permanecen disponibles para corregirse.
- [x] **T7. Conectar persistencia y presentación ordenada tras guardar (25 min).** RF-1, RF-2, RF-3; escenarios 1 y 4; decisión 5.
  - Hecho cuando: en Expo Go un registro válido aparece con su nota en orden alfabético y sigue allí tras cerrar por completo y reabrir la app.
- [x] **T8. Ejecutar verificación final de la feature (25 min).** RF-1, RF-2, RF-3; escenarios 1-4.
  - Hecho cuando: `npx jest` termina en verde y la lista manual de `rn-conventions` queda comprobada en Expo Go, incluyendo giro, teclado, separador decimal, persistencia y textos legibles sin depender del color.
