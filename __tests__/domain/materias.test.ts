import {
    calcularNotaNecesariaParaAprobar,
    calcularTotalSemestre,
    crearMateria,
    evaluarNotaSegundoBimestre,
    evaluarResultadoSemestre,
    limpiarNombre,
    normalizarNombre,
    ordenarMaterias,
    parsearNota,
    procesarNotaSegundoBimestre,
    validarNombre,
} from "../../src/domain/materias";

describe("limpiarNombre", () => {
  it("rechaza un nombre vacío y recorta espacios alrededor", () => {
    expect(limpiarNombre("   ")).toBe("");
    expect(limpiarNombre("  Álgebra  ")).toBe("Álgebra");
  });

  it("reduce espacios internos a uno y conserva texto legible", () => {
    expect(limpiarNombre("  Física   Básica  ")).toBe("Física Básica");
  });
});

describe("normalizarNombre", () => {
  it("ignora mayúsculas, acentos y espacios para comparar materias", () => {
    expect(normalizarNombre("  Matemáticas  ")).toBe("matematicas");
    expect(normalizarNombre("MATEMATICAS")).toBe("matematicas");
    expect(normalizarNombre("Mate maticas")).toBe("mate maticas");
  });
});

describe("validarNombre", () => {
  const materias = [{ id: "matematicas", nombre: "Matemáticas" }];

  it("muestra error cuando falta el nombre", () => {
    expect(validarNombre("", materias)).toBe(
      "Escribe el nombre de la materia.",
    );
  });

  it("rechaza un nombre duplicado con diferencias de formato", () => {
    expect(validarNombre("  matematicas  ", materias)).toBe(
      "Ya tienes una materia con ese nombre.",
    );
    expect(validarNombre("MATEMÁTICAS", materias)).toBe(
      "Ya tienes una materia con ese nombre.",
    );
  });

  it("acepta un nombre válido", () => {
    expect(validarNombre("  Física  ", materias)).toBe("");
  });
});

describe("parsearNota", () => {
  it("acepta valores válidos con espacios y decimales permitidos", () => {
    expect(parsearNota(" 0 ")).toBe(0);
    expect(parsearNota("20")).toBe(20);
    expect(parsearNota(" 8.5 ")).toBe(8.5);
  });

  it("rechaza valores vacíos, con coma, fuera de rango o con más de dos decimales", () => {
    expect(parsearNota("")).toBe(
      "Escribe una nota entre 0 y 20 con hasta dos decimales.",
    );
    expect(parsearNota("8,5")).toBe(
      "Escribe una nota entre 0 y 20 con hasta dos decimales.",
    );
    expect(parsearNota("-1")).toBe(
      "Escribe una nota entre 0 y 20 con hasta dos decimales.",
    );
    expect(parsearNota("21")).toBe(
      "Escribe una nota entre 0 y 20 con hasta dos decimales.",
    );
    expect(parsearNota("8.555")).toBe(
      "Escribe una nota entre 0 y 20 con hasta dos decimales.",
    );
  });
});

describe("cálculo del resultado del semestre", () => {
  it("clasifica los bordes del negocio según la spec", () => {
    expect(calcularTotalSemestre(10, 18)).toBe(28);
    expect(evaluarResultadoSemestre(10, 18)).toEqual({ estado: "Aprobado" });

    expect(calcularTotalSemestre(10, 8.5)).toBe(18.5);
    expect(evaluarResultadoSemestre(10, 8.5)).toEqual({
      estado: "Debes rendir supletorio",
      notaMinima: 9.5,
    });

    expect(evaluarResultadoSemestre(10, 17.99)).toEqual({
      estado: "Debes rendir supletorio",
      notaMinima: 0.01,
    });

    expect(evaluarResultadoSemestre(10, 8.49)).toEqual({
      estado: "Debes rendir supletorio",
      notaMinima: 9.51,
    });

    expect(calcularTotalSemestre(10, 7.99)).toBe(17.99);
    expect(evaluarResultadoSemestre(10, 7.99)).toEqual({
      estado: "Reprobado. No puedes rendir supletorio.",
    });

    expect(calcularNotaNecesariaParaAprobar(18.5)).toBe(9.5);
    expect(calcularNotaNecesariaParaAprobar(27.99)).toBeCloseTo(0.01);
    expect(calcularNotaNecesariaParaAprobar(20)).toBe(8);
  });

  it("mantiene el mensaje exacto de error para entrada vacía o fuera de rango", () => {
    const mensaje = "Escribe una nota entre 0 y 20 con hasta dos decimales.";

    expect(parsearNota("")).toBe(mensaje);
    expect(parsearNota("20.01")).toBe(mensaje);
    expect(parsearNota("8,5")).toBe(mensaje);
    expect(parsearNota("8.555")).toBe(mensaje);
  });

  it("integra la validación con la evaluación del resultado para la nota del segundo bimestre", () => {
    expect(evaluarNotaSegundoBimestre(10, "18")).toEqual({
      ok: true,
      resultado: { estado: "Aprobado" },
    });

    expect(evaluarNotaSegundoBimestre(10, "8.5")).toEqual({
      ok: true,
      resultado: {
        estado: "Debes rendir supletorio",
        notaMinima: 9.5,
      },
    });

    expect(evaluarNotaSegundoBimestre(10, "21")).toEqual({
      ok: false,
      error: "Escribe una nota entre 0 y 20 con hasta dos decimales.",
    });
  });

  it("limpia el resultado anterior cuando la nota corregida queda inválida", () => {
    expect(
      procesarNotaSegundoBimestre(10, "18", { estado: "Aprobado" }),
    ).toEqual({ estado: "Aprobado" });

    expect(
      procesarNotaSegundoBimestre(10, "21", { estado: "Aprobado" }),
    ).toEqual({
      error: "Escribe una nota entre 0 y 20 con hasta dos decimales.",
    });
  });
});

describe("crearMateria", () => {
  it("crea una materia válida sin mutar la colección original", () => {
    const materias = [{ id: "algebra", nombre: "Álgebra", nota: 9 }];

    const resultado = crearMateria("  Física  ", "8.5", materias);

    if (!resultado.ok) {
      throw new Error("La materia válida no debería fallar.");
    }

    expect(resultado.materia).toEqual({
      id: "fisica",
      nombre: "Física",
      nota: 8.5,
    });
    expect(materias).toHaveLength(1);
    expect(materias[0].nombre).toBe("Álgebra");
  });

  it("rechaza duplicados y no agrega registros inválidos", () => {
    const materias = [{ id: "matematicas", nombre: "Matemáticas", nota: 10 }];

    const duplicada = crearMateria("  matematicas  ", "9", materias);
    const invalida = crearMateria("Historia", "21", materias);

    expect(duplicada.ok).toBe(false);
    if (duplicada.ok) {
      throw new Error("La materia duplicada no debería ser válida.");
    }
    expect(duplicada.error).toBe("Ya tienes una materia con ese nombre.");
    expect(invalida.ok).toBe(false);
    if (invalida.ok) {
      throw new Error("La materia inválida no debería ser válida.");
    }
    expect(invalida.error).toBe(
      "Escribe una nota entre 0 y 20 con hasta dos decimales.",
    );
    expect(materias).toEqual([
      { id: "matematicas", nombre: "Matemáticas", nota: 10 },
    ]);
  });
});

describe("ordenarMaterias", () => {
  it("ordena alfabéticamente sin mutar la colección", () => {
    const materias = [
      { id: "zoologia", nombre: "Zoología", nota: 9 },
      { id: "algebra", nombre: "Álgebra", nota: 8 },
      { id: "biologia", nombre: "Biología", nota: 7 },
    ];

    const ordenadas = ordenarMaterias(materias);

    expect(ordenadas.map((materia) => materia.nombre)).toEqual([
      "Álgebra",
      "Biología",
      "Zoología",
    ]);
    expect(materias.map((materia) => materia.nombre)).toEqual([
      "Zoología",
      "Álgebra",
      "Biología",
    ]);
  });
});
