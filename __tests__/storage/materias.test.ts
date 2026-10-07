import AsyncStorage from '@react-native-async-storage/async-storage';

import { guardarMaterias, leerMaterias, STORAGE_KEY_MATERIAS } from '../../src/storage/materias';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

describe('persistencia de materias', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('guarda y recupera la colección completa en orden', async () => {
    const materias = [
      { id: 'algebra', nombre: 'Álgebra', nota: 8.5 },
      { id: 'biologia', nombre: 'Biología', nota: 10 },
    ];

    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(materias));

    await expect(leerMaterias()).resolves.toEqual(materias);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith(STORAGE_KEY_MATERIAS);

    await guardarMaterias(materias);

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(STORAGE_KEY_MATERIAS, JSON.stringify(materias));
  });

  it('devuelve una lista vacía si no hay datos guardados', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

    await expect(leerMaterias()).resolves.toEqual([]);
  });
});
