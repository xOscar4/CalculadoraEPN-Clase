# Decisiones para HU-002 - Conocer mi resultado con la nota del segundo bimestre

1. Pregunta: ¿Cómo debe mostrarse el resultado final del semestre cuando el usuario ingresa la nota del segundo bimestre?
   Respuesta: La aplicación debe mostrar un mensaje claro con el estado del semestre, y en el caso de supletorio incluir la nota mínima necesaria para aprobar o la diferencia faltante.
   Motivo: Da una respuesta inmediata y útil al estudiante, sin obligarlo a inferir el cálculo de manera manual ni a buscar otra parte de la interfaz.

2. Pregunta: Cuando el usuario ya vio su resultado y luego corrige la nota del segundo bimestre, ¿qué debe pasar con el aviso?
   Respuesta: La aplicación debe recalcular automáticamente el estado y actualizar el resultado visible sin borrar la nota ingresada; si la nota queda inválida, debe mostrar el error y ocultar el resultado anterior.
   Motivo: Evita que el sistema muestre un resultado obsoleto y permite corregir la nota sin perder la información que ya estaba escrita.

3. Pregunta: ¿Qué casos límite deben definirse en la regla de resultado para evitar ambigüedad en los bordes?
   Respuesta: El resultado es aprobado cuando la suma es 28 o más; supletorio cuando está entre 18 y 27.99; y reprobado cuando es menor que 18. La nota necesaria para aprobar debe calcularse sobre el total de 28 y mostrarse con hasta dos decimales, sin dejar los bordes ambiguos.
   Motivo: Define explícitamente los umbrales del negocio y garantiza que la lógica no dependa de suposiciones sobre redondeo, decimales o comparación de valores límite.
