import React, { useContext, useEffect } from 'react';
import {
  Image, Text, TouchableOpacity, View, StyleSheet,
} from 'react-native';
import { observer } from 'mobx-react';
import { HeaderBackButton, StackNavigationOptions } from '@react-navigation/stack';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-community/async-storage';
import { lightGrey, white } from '../../../styles/colors';
import HeaderCancel from '../../../common/header-cancel.component';
import Label from '../../../common/label';
import { Center } from '../../../styles/shared-styles';
import TextField from '../../../common/text-field';
import AddEquipmentStoreContext from '../contexts/add-equipment-store-context';
import Select from '../../../common/select.component';
import ActionButton from '../../../common/action-button.component';
import { Header } from '../../../common/common-header';

function AddEquipmentDetail({ navigation, route }: any) {
  const options: StackNavigationOptions = {
    title: 'Add Equipment',
    headerLeft: (props) => (
      <HeaderBackButton {...props} onPress={() => navigation.pop()} />
    ),
    headerBackTitle: ' ',
    headerRight: () => <HeaderCancel onPress={() => navigation.pop()} />,
  };

  const { store } = useContext(AddEquipmentStoreContext);
  // const [unitTitle, setUnitTitle] = useState('');
  // const [brandTitle, setbrandTitle] = useState('');

  useEffect(() => {
    store.fetchEquipmentData();
    // test if the scanned tag is successfully passed as route param and used to set the store
    // store.nfcTag = route?.params.nfcTag;
  }, []);

  return (
    <>
      <Header
        title="Add Equipment"
        leftIcon="goback"
        rightIcon="Cancel"
        _goBack={() => {
          navigation.goBack();
        }}
      />
      <View style={styles.container}>
        <KeyboardAwareScrollView>
          <Label style={styles.heading}>Scan Unit</Label>
          <TouchableOpacity style={styles.scanButton}>
            <Image source={require('../../../../assets/icons/barcode.png')} />
            <Text style={styles.btnText}>
              You can use the barcode scanner to autofill unit information.
            </Text>
          </TouchableOpacity>
          <Select
            title="Unit Type"
            placeholder="Type"
            newPlaceholder="Write a new unit type"
            addNew={async (txt) => {
              await store.fetchCreateEquipmentType(txt);
              await store.fetchEquipmentData();
              if (store.types.length > 0) {
                store.selectedType = store.types[store.types.length - 1];
              }
            }}
            style={styles.textField}
            containerStyle={styles.textFieldContainer}
            options={store.types.map((t) => t.title)}
            onSelect={(index) => {
              store.selectedType = store.types[index];
              AsyncStorage.setItem('selectedType', store.types[index]._id);
            }}
            value={store.selectedType?.title}
          />
          <Select
            title="Unit Brand"
            placeholder="Brand"
            newPlaceholder="Write a new brand"
            addNew={async (txt) => {
              await store.fetchCreateEquipmentBrand(txt);
              await store.fetchEquipmentData();
              if (store.brands.length > 0) {
                store.selectedBrand = store.brands[store.brands.length - 1];
              }
            }}
            style={styles.textField}
            containerStyle={styles.textFieldContainer}
            options={store.brands.map((t) => t.title)}
            onSelect={(index) => {
              store.selectedBrand = store.brands[index];
              AsyncStorage.setItem('selectedBrand', store.brands[index]._id);
            }}
            value={store.selectedBrand?.title}
          />
          <TextField
            title="Model Number"
            placeholder="Model"
            style={[styles.textField, styles.textFieldContainer]}
            onChangeText={(model) => {
              store.model = model;
              AsyncStorage.setItem('model', model);
            }}
            returnKeyType="done"
          />
          <TextField
            title="Serial Number"
            placeholder="Serial"
            style={[styles.textField, styles.textFieldContainer]}
            onChangeText={(serial) => {
              store.serialNumber = serial;
              AsyncStorage.setItem('serialNumber', serial);
            }}
            returnKeyType="done"
          />
        </KeyboardAwareScrollView>
        <ActionButton
          disabled={!store.isEquipmentDataValid}
          style={styles.button}
          onPress={() => {
            navigation.navigate('AddCustomerDetail');
          }}
        >
          Save and continue
        </ActionButton>
      </View>
    </>
  );
}

export default observer(AddEquipmentDetail);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white,
    paddingHorizontal: 10,
  },
  heading: {
    fontSize: 11,
    marginTop: 30,
    marginLeft: 12,
  },
  scanButton: {
    ...Center,
  },
  btnText: {
    textAlign: 'center',
    color: 'black',
    marginTop: 5,
  },
  textFieldContainer: {
    alignSelf: 'stretch',
    marginTop: 15,
  },
  textField: {
    backgroundColor: lightGrey,
  },
  button: {
    marginVertical: 15,
  },
});
