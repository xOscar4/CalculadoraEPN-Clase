export type Materia = {
  id: string;
  nombre: string;
  nota: number;
};

export function limpiarNombre(nombre: string): string {
  if (typeof nombre !== "string") {
    return "";
  }

  return nombre.trim().replace(/\s+/g, " ");
}

export function normalizarNombre(nombre: string): string {
  const limpio = limpiarNombre(nombre);

  return limpio
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

export function validarNombre(
  nombre: string,
  materias: Array<Pick<Materia, "nombre">> = [],
): string {
  const limpio = limpiarNombre(nombre);

  if (!limpio) {
    return "Escribe el nombre de la materia.";
  }

  const nombreNormalizado = normalizarNombre(limpio);
  const yaExiste = materias.some(
    (materia) => normalizarNombre(materia.nombre) === nombreNormalizado,
  );

  if (yaExiste) {
    return "Ya tienes una materia con ese nombre.";
  }

  return "";
}

export function parsearNota(entrada: string): number | string {
  const texto = typeof entrada === "string" ? entrada.trim() : "";
  const error = "Escribe una nota entre 0 y 20 con hasta dos decimales.";

  if (!texto) {
    return error;
  }

  if (texto.includes(",")) {
    return error;
  }

  const numero = Number(texto);
  if (!Number.isFinite(numero)) {
    return error;
  }

  const regex = /^(\d+)(\.\d{1,2})?$/;
  if (!regex.test(texto)) {
    return error;
  }

  if (numero < 0 || numero > 20) {
    return error;
  }

  return numero;
}

export function calcularTotalSemestre(
  primerBimestre: number,
  segundoBimestre: number,
): number {
  return Number((primerBimestre + segundoBimestre).toFixed(2));
}

export function calcularNotaNecesariaParaAprobar(totalActual: number): number {
  return Number((28 - totalActual).toFixed(2));
}

export function evaluarResultadoSemestre(
  primerBimestre: number,
  segundoBimestre: number,
): { estado: string; notaMinima?: number } {
  const totalActual = calcularTotalSemestre(primerBimestre, segundoBimestre);

  if (totalActual >= 28) {
    return { estado: "Aprobado" };
  }

  if (totalActual >= 18) {
    return {
      estado: "Debes rendir supletorio",
      notaMinima: calcularNotaNecesariaParaAprobar(totalActual),
    };
  }

  return { estado: "Reprobado. No puedes rendir supletorio." };
}

export function procesarNotaSegundoBimestre(
  primerBimestre: number,
  segundoBimestre: string | number | null | undefined,
  _resultadoAnterior?: { estado?: string; notaMinima?: number },
): { error: string } | { estado: string; notaMinima?: number } {
  const notaConvertida =
    typeof segundoBimestre === "string"
      ? parsearNota(segundoBimestre)
      : segundoBimestre;

  if (typeof notaConvertida === "string") {
    return { error: notaConvertida };
  }

  if (typeof notaConvertida !== "number" || !Number.isFinite(notaConvertida)) {
    return {
      error: "Escribe una nota entre 0 y 20 con hasta dos decimales.",
    };
  }

  return evaluarResultadoSemestre(primerBimestre, notaConvertida);
}

export function evaluarNotaSegundoBimestre(
  primerBimestre: number,
  segundoBimestre: string | number | null | undefined,
):
  | { ok: true; resultado: { estado: string; notaMinima?: number } }
  | { ok: false; error: string } {
  const resultado = procesarNotaSegundoBimestre(
    primerBimestre,
    segundoBimestre,
  );

  if ("error" in resultado) {
    return { ok: false, error: resultado.error };
  }

  return {
    ok: true,
    resultado,
  };
}

export function ordenarMaterias<T extends { nombre: string }>(
  materias: T[],
): T[] {
  return [...materias].sort((a, b) =>
    a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" }),
  );
}

export function crearMateria(
  nombre: string,
  nota: string | number,
  materias: Array<Pick<Materia, "id" | "nombre" | "nota">> = [],
): { ok: true; materia: Materia } | { ok: false; error: string } {
  const nombreLimpio = limpiarNombre(nombre);
  const errorNombre = validarNombre(nombreLimpio, materias);
  if (errorNombre) {
    return { ok: false, error: errorNombre };
  }

  const notaConvertida = parsearNota(String(nota));
  if (typeof notaConvertida === "string") {
    return { ok: false, error: notaConvertida };
  }

  const nombreNormalizado = normalizarNombre(nombreLimpio);
  const materia: Materia = {
    id: nombreNormalizado,
    nombre: nombreLimpio,
    nota: notaConvertida,
  };

  return { ok: true, materia };
}
