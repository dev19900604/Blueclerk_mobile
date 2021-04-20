import AsyncStorage from '@react-native-community/async-storage';

export const retrieveData = async (name: string) => {
  const value = await AsyncStorage.getItem(name);
  if (value !== null) {
    return JSON.parse(value);
  }
  return value;
};
