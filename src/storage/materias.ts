import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Materia } from '../domain/materias';

export const STORAGE_KEY_MATERIAS = 'materias';

export async function leerMaterias(): Promise<Materia[]> {
  try {
    const contenido = await AsyncStorage.getItem(STORAGE_KEY_MATERIAS);

    if (!contenido) {
      return [];
    }

    const parsed = JSON.parse(contenido) as Materia[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

export async function guardarMaterias(materias: Materia[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY_MATERIAS, JSON.stringify(materias));
}
