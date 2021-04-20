import React, { useState } from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import { useDispatch } from 'react-redux';
import { Checkbox } from 'react-native-paper';
import { background, white } from '../styles/colors';
import ActionButton from './action-button.component';
import { RowCenter } from '../styles/shared-styles';
import { setSkipGuide } from '../redux/user-redux';

export const DONT_SHOW_KEY = 'DONT_SHOW_KEY';

function GuideScreen() {
  const [checked, setChecked] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/animations/scan-instructions.gif')}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.heading}>To Scan A Tag</Text>
      <Text style={styles.text}>
        Hold the top of your phone close to a BlueClerk tag and keep it there until you
        see the check mark
      </Text>
      <View style={{ flex: 1 }} />
      <ActionButton style={styles.button} destructive onPress={() => navigation.goBack()}>
        Cancel
      </ActionButton>
      <ActionButton
        style={styles.button}
        onPress={() => {
          if (checked) {
            dispatch(setSkipGuide());
            AsyncStorage.setItem('skipGuide', checked == true ? '1' : '0');
          }
          navigation.replace('ScanTagScreen');
        }}
      >
        Continue
      </ActionButton>
      <View style={styles.checkContainer}>
        <Checkbox.Android
          uncheckedColor={white}
          color={white}
          status={checked ? 'checked' : 'unchecked'}
          onPress={async () => {
            setChecked(!checked);
            AsyncStorage.setItem('skipGuide', checked == false ? '1' : '0');
            const db = await AsyncStorage.getItem('skipGuide');
          }}
        />
        <Text style={styles.checkBoxText}>Got it, don’t show this again</Text>
      </View>
      <Text style={styles.subText}>
        (You can always see these instructions again in the Help menu)
      </Text>
      <SafeAreaView />
    </View>
  );
}

export default GuideScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: background,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  image: {
    height: 200,
    marginTop: 50 + getStatusBarHeight(),
  },
  heading: {
    color: white,
    fontSize: 20,
  },
  text: {
    color: white,
    marginHorizontal: 50,
    marginTop: 10,
    textAlign: 'center',
  },
  button: {
    alignSelf: 'stretch',
    marginTop: 10,
  },
  checkContainer: {
    ...RowCenter,
    marginTop: 30,
  },
  checkBoxText: {
    color: white,
  },
  subText: {
    color: white,
    fontSize: 10,
    marginBottom: 10,
  },
});
