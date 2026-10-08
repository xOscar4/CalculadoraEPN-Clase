# Tareas 002 - Resultado del semestre

- [x] **T1. Reutilizar la validación de notas y definir los límites del resultado.** RF-1, RF-2, RF-3, RF-4
  - Hecho cuando: la lógica de dominio acepta y rechaza exactamente los valores de la spec y clasifica los bordes 18, 27.99 y 28 según el negocio.

- [x] **T2. Cubrir con pruebas de dominio los casos límite del cálculo.** RF-1, RF-2, RF-3, RF-4
  - Hecho cuando: en Jest existen pruebas para aprobado, supletorio, reprobado, entrada vacía y valores fuera de rango con los mensajes esperados.

- [x] **T3. Implementar el cálculo de la nota mínima para supletorio.** RF-3
  - Hecho cuando: la función devuelve la diferencia exacta para llegar a 28 y la misma lógica se usa para el mensaje visible del estudiante.

- [x] **T4. Centralizar la evaluación del resultado final en una función pura.** RF-2, RF-3, RF-4
  - Hecho cuando: la función devuelve un único estado y un valor opcional de nota mínima, sin leer almacenamiento ni manipular la UI.

- [x] **T5. Integrar la validación y el resultado en la vista de la materia.** RF-1, RF-2, RF-3, RF-4
  - Hecho cuando: la pantalla muestra el error exacto para un valor inválido y, con un valor válido, presenta el estado correcto del semestre.

- [x] **T6. Gestionar la corrección de la nota y la limpieza del resultado obsoleto.** RF-1, RF-5
  - Hecho cuando: al cambiar una nota inválida se conserva el texto escrito, se muestra el error y se oculta el resultado anterior; al corregirla, la vista se recalcula sin borrar lo escrito.

- [ ] **T7. Revisar el flujo manual en Expo y dejar evidencia del comportamiento de la historia.** RF-1, RF-2, RF-3, RF-4, RF-5
  - Hecho cuando: se verifica en la app que el resultado visible cambia en tiempo real al editar la nota del segundo bimestre y que los mensajes coinciden con la spec.
