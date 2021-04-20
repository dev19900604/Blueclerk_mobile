import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import ReactNativePickerModule from 'react-native-picker-module';
import { StackNavigationOptions } from '@react-navigation/stack';
import { logEvent } from '../helpers';
import { Header } from './common-header';

export default function AddEquipment({ route, navigation }) {
  const options: StackNavigationOptions = {
    headerTitle: 'Add Equipment',
  };

  const [selectedValue, setSelectedValue] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [data1, setData1] = useState([
    'AC',
    'AHU',
    'Chiller',
    'Pen drive',
    'RTU',
    'TEST',
    'Test Type 1',
  ]);
  const pickerRef = useRef();
  const [data2, setData2] = useState([
    'Brand 1',
    'Brand 2',
    'Brand 3',
    'Brand 4',
    'Brand 5',
    'Brand 6',
    'test brand',
    'test brand_april 2019',
  ]);

  useEffect(() => {
    logEvent('add_equipment_screen');
  }, []);

  return (
    <View style={styles.container}>
      <Header title="Add Equipment" leftIcon="menu" />
      <Button mode="contained" style={styles.SelectImageButton} uppercase={false}>
        Select Equipment Image
      </Button>
      <Text style={styles.selectText}>Select Equipment Type Below:</Text>
      <Text
        style={styles.selectEquiText}
        onPress={() => {
          pickerRef.current.show();
        }}
      >
        Select equipment type below
      </Text>
      <ReactNativePickerModule
        pickerRef={pickerRef}
        title="Select equipment type below"
        items={data1}
        onValueChange={(value, index) => {
          setSelectedValue(value);
          setSelectedIndex(index);
        }}
      />
      <Text style={styles.selectBrandText}>Brand:</Text>
      <Text
        style={styles.selectBrandPicker}
        onPress={() => {
          pickerRef.current.show();
        }}
      >
        Select brand
      </Text>
      <ReactNativePickerModule
        pickerRef={pickerRef}
        title="Select brand  below"
        items={data2}
        onValueChange={(value, index) => {
          setSelectedValue(value);
          setSelectedIndex(index);
        }}
      />
      <TextInput style={styles.modelTextInput} label="Model" />
      <Button mode="contained" style={styles.btnAdd} uppercase={false}>
        Add
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  SelectImageButton: {
    marginTop: 22,
    padding: 2,
    marginHorizontal: 30,
    textAlign: 'center',
    backgroundColor: '#1fb2e2',
  },
  selectText: {
    textAlign: 'center',
    marginTop: 15,
    fontSize: 18,
  },

  selectEquiText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
  selectBrandText: {
    textAlign: 'center',
    fontSize: 19,
    marginTop: 20,
  },
  selectBrandPicker: {
    textAlign: 'center',
    fontSize: 18,
    marginTop: 20,
  },
  modelTextInput: {
    backgroundColor: 'white',
    marginHorizontal: 30,
    padding: 2,
    textAlign: 'center',
    marginTop: 20,
  },
  btnAdd: {
    marginHorizontal: 20,
    padding: 5,
    marginTop: 20,
    backgroundColor: '#1fb2e2',
  },
});
