import {
    crearMateria,
    limpiarNombre,
    normalizarNombre,
    ordenarMaterias,
    parsearNota,
    validarNombre,
} from '../../src/domain/materias';

describe('limpiarNombre', () => {
  it('rechaza un nombre vacío y recorta espacios alrededor', () => {
    expect(limpiarNombre('   ')).toBe('');
    expect(limpiarNombre('  Álgebra  ')).toBe('Álgebra');
  });

  it('reduce espacios internos a uno y conserva texto legible', () => {
    expect(limpiarNombre('  Física   Básica  ')).toBe('Física Básica');
  });
});

describe('normalizarNombre', () => {
  it('ignora mayúsculas, acentos y espacios para comparar materias', () => {
    expect(normalizarNombre('  Matemáticas  ')).toBe('matematicas');
    expect(normalizarNombre('MATEMATICAS')).toBe('matematicas');
    expect(normalizarNombre('Mate maticas')).toBe('mate maticas');
  });
});

describe('validarNombre', () => {
  const materias = [{ id: 'matematicas', nombre: 'Matemáticas' }];

  it('muestra error cuando falta el nombre', () => {
    expect(validarNombre('', materias)).toBe('Escribe el nombre de la materia.');
  });

  it('rechaza un nombre duplicado con diferencias de formato', () => {
    expect(validarNombre('  matematicas  ', materias)).toBe('Ya tienes una materia con ese nombre.');
    expect(validarNombre('MATEMÁTICAS', materias)).toBe('Ya tienes una materia con ese nombre.');
  });

  it('acepta un nombre válido', () => {
    expect(validarNombre('  Física  ', materias)).toBe('');
  });
});

describe('parsearNota', () => {
  it('acepta valores válidos con espacios y decimales permitidos', () => {
    expect(parsearNota(' 0 ')).toBe(0);
    expect(parsearNota('20')).toBe(20);
    expect(parsearNota(' 8.5 ')).toBe(8.5);
  });

  it('rechaza valores vacíos, con coma, fuera de rango o con más de dos decimales', () => {
    expect(parsearNota('')).toBe('Escribe una nota entre 0 y 20 con hasta dos decimales.');
    expect(parsearNota('8,5')).toBe('Escribe una nota entre 0 y 20 con hasta dos decimales.');
    expect(parsearNota('-1')).toBe('Escribe una nota entre 0 y 20 con hasta dos decimales.');
    expect(parsearNota('21')).toBe('Escribe una nota entre 0 y 20 con hasta dos decimales.');
    expect(parsearNota('8.555')).toBe('Escribe una nota entre 0 y 20 con hasta dos decimales.');
  });
});

describe('crearMateria', () => {
  it('crea una materia válida sin mutar la colección original', () => {
    const materias = [{ id: 'algebra', nombre: 'Álgebra', nota: 9 }];

    const resultado = crearMateria('  Física  ', '8.5', materias);

    expect(resultado.ok).toBe(true);
    expect(resultado.materia).toEqual({
      id: 'fisica',
      nombre: 'Física',
      nota: 8.5,
    });
    expect(materias).toHaveLength(1);
    expect(materias[0].nombre).toBe('Álgebra');
  });

  it('rechaza duplicados y no agrega registros inválidos', () => {
    const materias = [{ id: 'matematicas', nombre: 'Matemáticas', nota: 10 }];

    const duplicada = crearMateria('  matematicas  ', '9', materias);
    const invalida = crearMateria('Historia', '21', materias);

    expect(duplicada.ok).toBe(false);
    expect(duplicada.error).toBe('Ya tienes una materia con ese nombre.');
    expect(invalida.ok).toBe(false);
    expect(invalida.error).toBe('Escribe una nota entre 0 y 20 con hasta dos decimales.');
    expect(materias).toEqual([{ id: 'matematicas', nombre: 'Matemáticas', nota: 10 }]);
  });
});

describe('ordenarMaterias', () => {
  it('ordena alfabéticamente sin mutar la colección', () => {
    const materias = [
      { id: 'zoologia', nombre: 'Zoología', nota: 9 },
      { id: 'algebra', nombre: 'Álgebra', nota: 8 },
      { id: 'biologia', nombre: 'Biología', nota: 7 },
    ];

    const ordenadas = ordenarMaterias(materias);

    expect(ordenadas.map((materia) => materia.nombre)).toEqual(['Álgebra', 'Biología', 'Zoología']);
    expect(materias.map((materia) => materia.nombre)).toEqual(['Zoología', 'Álgebra', 'Biología']);
  });
});
