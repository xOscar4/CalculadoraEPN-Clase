import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { crearMateria, ordenarMaterias, type Materia } from '@/domain/materias';
import { guardarMaterias, leerMaterias } from '@/storage/materias';

export default function HomeScreen() {
  const [nombre, setNombre] = useState('');
  const [nota, setNota] = useState('');
  const [nombreError, setNombreError] = useState('');
  const [notaError, setNotaError] = useState('');
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    const cargarMaterias = async () => {
      const datos = await leerMaterias();
      if (isActive) {
        setMaterias(ordenarMaterias(datos));
        setIsLoading(false);
      }
    };

    void cargarMaterias();

    return () => {
      isActive = false;
    };
  }, []);

  const handleGuardar = async () => {
    const resultado = crearMateria(nombre, nota, materias);

    if (!resultado.ok) {
      setNombreError(resultado.error === 'Escribe el nombre de la materia.' || resultado.error === 'Ya tienes una materia con ese nombre.' ? resultado.error : '');
      setNotaError(resultado.error === 'Escribe una nota entre 0 y 20 con hasta dos decimales.' ? resultado.error : '');
      return;
    }

    const materasActualizadas = ordenarMaterias([...materias, resultado.materia]);
    setMaterias(materasActualizadas);
    setNombre('');
    setNota('');
    setNombreError('');
    setNotaError('');
    await guardarMaterias(materasActualizadas);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Materias</Text>
            <Text style={styles.subtitle}>Registra la nota del primer bimestre.</Text>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.label}>Nombre de la materia</Text>
            <TextInput
              value={nombre}
              onChangeText={(value) => {
                setNombre(value);
                if (nombreError) {
                  setNombreError('');
                }
              }}
              placeholder="Ej: Álgebra"
              placeholderTextColor="#7a7d84"
              autoCapitalize="words"
              autoCorrect={false}
              style={[styles.input, nombreError ? styles.inputError : null]}
              accessibilityLabel="Nombre de la materia"
            />
            {nombreError ? <Text style={styles.errorText}>{nombreError}</Text> : null}

            <Text style={styles.label}>Nota del primer bimestre</Text>
            <TextInput
              value={nota}
              onChangeText={(value) => {
                setNota(value);
                if (notaError) {
                  setNotaError('');
                }
              }}
              placeholder="Ej: 9.5"
              placeholderTextColor="#7a7d84"
              keyboardType="decimal-pad"
              style={[styles.input, notaError ? styles.inputError : null]}
              accessibilityLabel="Nota del primer bimestre"
            />
            {notaError ? <Text style={styles.errorText}>{notaError}</Text> : null}

            <Pressable
              onPress={handleGuardar}
              style={styles.button}
              accessibilityRole="button"
              accessibilityLabel="Guardar materia"
            >
              <Text style={styles.buttonText}>Guardar materia</Text>
            </Pressable>
          </View>

          <View style={styles.listCard}>
            <Text style={styles.listTitle}>Lista</Text>

            {isLoading ? (
              <Text style={styles.emptyState}>Cargando materias...</Text>
            ) : materias.length === 0 ? (
              <Text style={styles.emptyState}>Aún no hay materias registradas.</Text>
            ) : (
              materias.map((materia) => (
                <View key={materia.id} style={styles.listRow}>
                  <Text style={styles.itemName}>{materia.nombre}</Text>
                  <Text style={styles.itemNota}>{materia.nota}</Text>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#e2e4e9',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
  },
  header: {
    backgroundColor: '#001F3F',
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 18,
  },
  title: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    color: '#dfe8f5',
    fontSize: 14,
    marginTop: 6,
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 20,
    marginBottom: 18,
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  label: {
    color: '#111111',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dce0e8',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111111',
    marginBottom: 16,
  },
  inputError: {
    borderColor: '#b42318',
  },
  errorText: {
    color: '#b42318',
    fontSize: 13,
    marginTop: -10,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#357ca5',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
  listCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 20,
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  listTitle: {
    color: '#111111',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  emptyState: {
    color: '#5f6368',
    fontSize: 14,
    paddingVertical: 8,
  },
  listRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#edf0f4',
  },
  itemName: {
    color: '#111111',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 12,
  },
  itemNota: {
    color: '#001F3F',
    fontWeight: '700',
    fontSize: 15,
  },
});
