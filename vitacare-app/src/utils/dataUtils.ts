import AsyncStorage from '@react-native-async-storage/async-storage';

export const armazenarDataAtual = async () => {
  const dataAtual = new Date().toISOString();
  await AsyncStorage.setItem('dataAtual', dataAtual);
};

export const obterDataAtual = async (): Promise<string | null> => {
  return await AsyncStorage.getItem('dataAtual');
};