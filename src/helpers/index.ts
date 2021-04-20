import analytics from '@react-native-firebase/analytics';
import AsyncStorage from '@react-native-community/async-storage';

export const logEvent = async (name) => {
  await analytics().setCurrentScreen(name, 'blueclerk');
  await analytics().logEvent('blueclerk_view', { screen: name });
};

export const simulateNFC = () => ({
  ndefMessage: [
    {
      payload: [
        84,
        73,
        68,
        58,
        60,
        48,
        52,
        55,
        49,
        65,
        70,
        56,
        50,
        57,
        50,
        54,
        55,
        56,
        48,
        62,
      ],
      type: [
        97,
        112,
        112,
        108,
        105,
        99,
        97,
        116,
        105,
        111,
        110,
        47,
        99,
        111,
        109,
        46,
        104,
        114,
        46,
        110,
        102,
        99,
        116,
        97,
        103,
        105,
        100,
      ],
      id: '',
      tnf: 2,
    },
    {
      payload: [99, 111, 109, 46, 104, 114, 46, 110, 102, 99, 116, 97, 103, 105, 100],
      type: [97, 110, 100, 114, 111, 105, 100, 46, 99, 111, 109, 58, 112, 107, 103],
      id: '',
      tnf: 4,
    },
  ],
});

export const getStorageItem = (key) => AsyncStorage.getItem(key);

export const setStorageItem = (key, value) => AsyncStorage.setItem(key, value);
