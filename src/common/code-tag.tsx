import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Keyboard,
  ScrollView,
  Alert,
  TextInput as Input,
  Platform,
  StyleSheet,
  PermissionsAndroid,
} from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import NfcManager, { Ndef } from 'react-native-nfc-manager';
import { Icon } from 'native-base';
import ImagePicker from '@fancydevpro/react-native-image-picker';
import ActionSheetCustom from 'react-native-actionsheet';
import { TextField } from 'react-native-material-textfield';
import { Dropdown } from 'react-native-material-dropdown-v2';
import { DrawerNavigationOptions } from '@react-navigation/drawer';
import { DrawerActions } from '@react-navigation/compat';
import Loader from './loader';
import { logEvent } from '../helpers';
import { Header } from './common-header';
import { Service } from '../config/services';

const RtdType = {
  URL: 0,
  TEXT: 1,
};

function buildUrlPayload(valueToWrite: any) {
  return Ndef.encodeMessage([Ndef.uriRecord(valueToWrite)]);
}
function buildTextPayload(valueToWrite: any) {
  return Ndef.encodeMessage([Ndef.textRecord(valueToWrite)]);
}
const DismissKeyboard = ({ children }: any) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

export default function CodeTag({ navigation }: any) {
  const options: DrawerNavigationOptions = {
    drawerIcon: ({ color }: any) => <Icon name="code" style={{ fontSize: 24, color }} />,
  };

  const optionss = {
    title: 'Select Avatar',
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };

  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [supported, setSupported] = useState(false);
  const [data, setData] = useState([]);
  const [enabled, setEnabled] = useState(false);
  const [isWriting, setIsWritting] = useState(false);
  const [urlToWrite, setUrlToWrite] = useState('https://www.google.com');
  const [rtdType, setRtdType] = useState(RtdType.URL);
  const [parsedText, setParsedText] = useState(null);
  const [tag, setTag] = useState({});
  const [imageURL, setImgurl] = useState('https://app.blueclerk.com/assets/img/logo.jpg');
  const [customersIds, setCustomerIds] = useState([]);
  const [_stateChangedSubscription, set_stateChangedSubscription] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [customer, setCustomer] = useState('');
  const [types, setTypes] = useState([]);
  const [type, setType] = useState('');
  const [brands, setBrands] = useState([]);
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [serial, setSerial] = useState('');
  const [search, setSearch] = useState('');
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [customer_id, setCutomer_ID] = useState('');
  const [Location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const ActionSheet = useRef();

  const getPermissionAsync = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ]);

      Object.entries(granted).map(([key, value]) => {
        Alert.alert(key, value);
      });

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert('Camera roll permissions to make this work is granted!');
      } else {
        Alert.alert('Sorry, we need camera roll permissions to make this work!');
      }
    } catch (err) {
      Alert.alert(String(err));
    }
  };

  const getEquipmentTypes = async () => {
    const response = await Service.getEquipmentTypes();
    const { status, types } = response.data;

    if (status == 1) {
      const count = Object.keys(types).length;
      const drop_down_data = [];
      for (let i = 0; i < count; i++) {
        drop_down_data.push({
          value: types[i].title,
          id: types[i]._id,
        });
      }

      if (drop_down_data.length > 0) {
        setType(types[0].title);
      }
      setTypes(drop_down_data);
      setData(drop_down_data);
    } else {
      setVisible(true);
      setMessage('Error while getting Equipment Brands, please try again later.');
    }
  };

  const getEquipmentBrands = async () => {
    const response = await Service.getEquipmentBrands();
    const { status, brands } = response.data;
    if (status == 1) {
      const count = Object.keys(brands).length;
      const drop_down_data = [];
      for (let i = 0; i < count; i++) {
        drop_down_data.push({
          value: brands[i].title,
          id: brands[i]._id,
        });
      }

      if (drop_down_data.length > 0) {
        setBrand(brands[0].title);
      }
      setBrands(drop_down_data);
    } else {
      setVisible(true);
      setMessage('Error while getting Equipment Brands, please try again later.');
    }
  };

  const onMountCall = async () => {
    NfcManager.isSupported()
      .then((supported) => {
        setSupported(supported);
        if (supported) {
          this._startNfc();
        }
      })
      .catch(() => {
        Alert.alert(
          'Please verify that NFC (Near Field Communication) is enabled or supported in your device!'
        );
      });
    getPermissionAsync();
    getEquipmentTypes();
    getEquipmentBrands();
  };

  useEffect(() => {
    logEvent('code_customer_tag_screen');
    onMountCall();
  }, []);

  const _startScanning = () => {
    if (Platform.OS == 'android' && enabled == false) {
      _showAlert();
      return;
    }

    if (Platform.OS == 'android') {
      _startDetection();
      _stopDetection();
      _startDetection();
    } else {
      _startDetection();
    }
  };

  const _showAlert = () => {
    Alert.alert('Enable NFC', 'Please enable the NFC Feature by going into settings', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      { text: 'Go To Settings', onPress: () => _goToNfcSetting() },
    ]);
  };

  const _requestFormat = () => {
    if (isWriting) {
      return;
    }
    setIsWritting(true);
    NfcManager.requestNdefWrite(null, { format: true }).then(() => setIsWritting(false));
  };

  const _requestNdefWrite = () => {
    if (isWriting) {
      return;
    }
    let bytes;
    if (rtdType === RtdType.URL) {
      bytes = buildUrlPayload(urlToWrite);
    } else if (rtdType === RtdType.TEXT) {
      bytes = buildTextPayload(urlToWrite);
    }
    setIsWritting(true);
    NfcManager.requestNdefWrite(bytes).then(() => setIsWritting(false));
  };

  const _cancelNdefWrite = () => {
    setIsWritting(false);
    NfcManager.cancelNdefWrite().then(() => console.log('write cancelled'));
  };

  const _requestAndroidBeam = () => {
    if (isWriting) {
      return;
    }

    let bytes;
    if (rtdType === RtdType.URL) {
      bytes = buildUrlPayload(urlToWrite);
    } else if (rtdType === RtdType.TEXT) {
      bytes = buildTextPayload(urlToWrite);
    }

    this.setState({ isWriting: true });
    NfcManager.setNdefPushMessage(bytes);
  };

  const _cancelAndroidBeam = () => {
    this.setState({ isWriting: false });
    NfcManager.setNdefPushMessage(null)
      .then(() => console.log('beam cancelled'))
      .catch((err) => console.warn(err));
  };

  const _startNfc = () => {
    NfcManager.start({
      onSessionClosedIOS: () => {
        console.log('ios session closed');
      },
    })
      .then((result) => {
        console.log('start OK', result);
      })
      .catch((error) => {
        console.warn('start fail', error);
        setSupported(false);
      });

    if (Platform.OS === 'android') {
      NfcManager.getLaunchTagEvent()
        .then((tag) => {
          if (tag) {
            setTag(tag);
          }
        })
        .catch((err) => {
          console.log(err);
        });

      NfcManager.isEnabled()
        .then((enabled) => {
          setEnabled(enabled);
        })
        .catch((err) => {
          console.log(err);
        });

      NfcManager.onStateChanged((event) => {
        if (event.state === 'on') {
          setEnabled(true);
        } else if (event.state === 'off') {
          setEnabled(false);
        }
      })
        .then((sub) => {
          set_stateChangedSubscription(sub);
        })
        .catch((err) => {
          console.warn(err);
        });
    }
  };

  const _openMenu = () => {
    Keyboard.dismiss();
    navigation.dispatch(DrawerActions.toggleDrawer());
  };

  const _onTagDiscovered = (tag) => {
    console.log('Tag Discovered', tag);
    setParsedText(JSON.stringify(tag.ndefMessage));
    _stopDetection();
    setVisible(true);
    setMessage('Tag detected and Scanned successfully');
    createCustEquipment();
  };

  const getIndex = (array, value) => array.findIndex((obj) => obj.value === value);

  const createCustEquipment = async () => {
    setIsLoading(true);
    const type_id = types[getIndex(types, type)].id;
    const brand_id = brands[getIndex(brands, brand)].id;
    const body = JSON.stringify({
      model,
      serialNumber: serial,
      nfcTag: parsedText,
      imageUrl: imageURL,
      equipmentTypeId: type_id,
      equipmentBrandId: brand_id,
      customerId: customer_id,
      location: Location,
    });

    const response = await Service.createCustomerEquipment(body);
    const { status, message } = response.data;

    if (status == 1) {
      setMessage(message);
      setVisible(true);
      setBrand('');
      setModel('');
      setSerial('');
      setLocation('');
      setCustomer('');
      setIsLoading(false);
      setType('');
      Alert.alert('Success', 'Tag coded successfully');
    } else {
      setMessage(message);
      setVisible(true);
      setBrand('');
      setModel('');
      setSerial('');
      setLocation('');
      setCustomer('');
      setIsLoading(false);
      setType('');
    }
  };

  const validate = () => {
    if (customer == '') {
      Alert.alert('Warning', 'Please select Customer', [
        {
          text: 'Ok',
          onPress: () => {},
          style: 'cancel',
        },
      ]);
      return true;
    }
    if (type == '' || brand == '') {
      Alert.alert('Warning', 'Add Type and Brand', [
        {
          text: 'Ok',
          onPress: () => {},
          style: 'cancel',
        },
      ]);
      return true;
    }
    if (serial == '') {
      Alert.alert('Warning', "Serial number missing. If unknown please type 'unknown'", [
        {
          text: 'Ok',
          onPress: () => {},
          style: 'cancel',
        },
      ]);
      return true;
    }
    return false;
  };

  const _startDetection = () => {
    if (validate()) {
    } else {
      NfcManager.registerTagEvent(_onTagDiscovered)
        .then((result) => {
          console.log('registerTagEvent OK', result);
        })
        .catch((error) => {
          console.warn('registerTagEvent fail', error);
        });
    }
  };

  const _stopDetection = () => {
    NfcManager.unregisterTagEvent().then((result) => {
      console.log('unregisterTagEvent OK', result);
    });
  };

  const _clearMessages = () => {
    setTag(null);
  };

  const _goToNfcSetting = () => {
    if (Platform.OS === 'android') {
      NfcManager.goToNfcSetting()
        .then((result) => {
          console.log('goToNfcSetting OK', result);
        })
        .catch((error) => {
          console.warn('goToNfcSetting fail', error);
        });
    }
  };

  const _parseUri = (tag) => {
    try {
      if (Ndef.isType(tag.ndefMessage[0], Ndef.TNF_WELL_KNOWN, Ndef.RTD_URI)) {
        return Ndef.uri.decodePayload(tag.ndefMessage[0].payload);
      }
    } catch (e) {
      console.log(e);
    }
    return null;
  };

  const _parseText = (tag) => {
    try {
      if (Ndef.isType(tag.ndefMessage[0], Ndef.TNF_WELL_KNOWN, Ndef.RTD_TEXT)) {
        return Ndef.text.decodePayload(tag.ndefMessage[0].payload);
      }
    } catch (e) {
      console.log(e);
    }
    return null;
  };

  const _openCamera = async () => {
    ImagePicker.launchCamera(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = response.uri;
        setImgurl(source);
      }
    });
  };

  const _pickImage = async () => {
    ImagePicker.launchImageLibrary(this.options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = response.uri;
        setImgurl(source);
      }
    });
  };

  const chooseOption = (index) => {
    if (index == 0) {
      _pickImage();
    } else if (index == 1) {
      _openCamera();
    }
  };

  const getCustomers = async () => {
    const dummy_customers = await Service.getCustomers();
    if (dummy_customers && dummy_customers.length != 0) {
      const count = Object.keys(dummy_customers).length;
      const drop_down_data = [];
      for (let i = 0; i < count; i++) {
        console.log(dummy_customers[i].title); // I need to add
        drop_down_data.push({
          name: dummy_customers[i].info.name,
          id: dummy_customers[i]._id,
        }); // Create your array of data
      }
      setCustomers(drop_down_data);
      setCustomerIds(drop_down_data);
    } else {
      setVisible(true);
      setMessage('Error while getting customers, please try again later.');
    }
  };

  const updateSearch = (event = {}) => {
    const value = event;
    if (event) {
      getCustomers();
      setSearch(value.substr(0, 20));
      setCustomer(value.substr(0, 20));
      if (value.substr(0, 20) == '') {
        setCustomers([]);
      }
    } else {
      setCustomer(customer.name);
      setCustomers([]);
    }
  };

  const selectCustomer = (customer) => {
    setCustomer(customer.name);
    setCustomers([]);
    setCutomer_ID(customer_id);
  };

  const showActionSheet = () => {
    ActionSheet.current.show();
  };

  const filteredCustomers = customers.filter(
    (customer) => customer.name.toLowerCase().indexOf(search.toLowerCase()) !== -1
  );

  return (
    <DismissKeyboard>
      <View style={styles.container}>
        <Header title="Program Tag" leftIcon="menu" _openMenu={() => _openMenu()} />
        <ScrollView>
          <Loader loading={isLoading} />
          <View>
            <ActionSheetCustom
              ref={ActionSheet}
              title="Select Picture"
              tintColor="#00bfff"
              options={['Choose Picture', 'Take Picture', 'Cancel']}
              cancelButtonIndex={2}
              onPress={(index) => chooseOption(index)}
            />
          </View>
          <View style={styles.viewContainer}>
            <TextField
              lineWidth={0}
              placeholder="Type in customer name"
              style={styles.input}
              mode="outlined"
              dense
              activeLineWidth={0}
              value={customer}
              onChangeText={(event) => updateSearch(event)}
              inputContainerStyle={{ alignItems: 'center' }}
              labelTextStyle={styles.custName}
            />
            <ScrollView style={styles.listView} keyboardShouldPersistTaps="always">
              {filteredCustomers.map((customer) => (
                <TouchableOpacity
                  style={styles.customerItem}
                  keyboardShouldPersistTaps="always"
                  customer={customer}
                  key={customer.key}
                  onPress={() => selectCustomer(customer)}
                >
                  <Text key={(customer) => customer.id} style={styles.customerName}>
                    {customer.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={styles.LocationWrapper}>
              <Input
                value={Location}
                onChangeText={(value) => setLocation(value)}
                style={styles.locationInput}
                placeholder="Location of Unit"
              />
            </View>
            <View style={styles.containerButton}>
              <Button style={styles.actbtn} mode="contained" onPress={showActionSheet}>
                Take Picture
              </Button>
            </View>
            <View style={styles.textcontainer}>
              <View style={styles.containerButton}>
                <Text style={styles.txtSize}>Type : </Text>
                <Dropdown
                  dropdownOffset={{ top: 5 }}
                  containerStyle={styles.typeDropDown}
                  itemTextStyle={{ fontFamily: 'SlateForOnePlus-Regular' }}
                  rippleCentered
                  inputContainerStyle={{ borderBottomColor: 'transparent' }}
                  data={types}
                  value={type}
                  onChangeText={(type) => setType(type)}
                />
              </View>
              <View style={styles.containerButton}>
                <Text style={styles.txtSize}>Brand : </Text>
                <Dropdown
                  dropdownOffset={{ top: 5 }}
                  containerStyle={styles.brandDropdown}
                  itemTextStyle={{ fontFamily: 'SlateForOnePlus-Regular' }}
                  rippleCentered
                  inputContainerStyle={{ borderBottomColor: 'transparent' }}
                  data={brands}
                  value={brand}
                  onChangeText={(brand) => setBrand(brand)}
                />
              </View>
              <View style={styles.containerButton}>
                <Text style={styles.txtSize}>Model : </Text>
                <TextInput
                  style={styles.txtinput}
                  mode="outlined"
                  dense
                  value={model}
                  onChangeText={(model) => setModel(model)}
                />
              </View>
              <View style={styles.containerButton}>
                <Text style={styles.txtSize}>Serial : </Text>
                <TextInput
                  style={styles.txtinput}
                  mode="outlined"
                  dense
                  value={serial}
                  onChangeText={(serial) => setSerial(serial)}
                />
              </View>
            </View>

            <View style={styles.approachTag}>
              <Text style={styles.txtSizeSecondTitle}>Approach a BlueTag to code</Text>
              <Button
                style={styles.actbtn3}
                mode="contained"
                fontSize="10"
                onPress={_startScanning}
              >
                Approach
              </Button>
            </View>
          </View>
        </ScrollView>
      </View>
    </DismissKeyboard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'visible',
  },
  fontSize: {
    fontSize: 34,
  },
  input: {
    borderColor: '#000',
    borderWidth: 1,
    textAlign: 'center',
    height: 40,
    marginTop: -15,
    marginHorizontal: 15,
    borderRadius: 5,
    fontFamily: 'SlateForOnePlus-Regular',
  },
  containerButton: {
    textAlign: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textcontainer: {
    margin: 20,
    textAlign: 'left',
    marginTop: 10,
  },
  actbtn: {
    margin: 5,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: '#1fb2e2',
  },
  txtinput: {
    fontSize: 16,
    width: 200,
    height: 50,
    paddingLeft: 6,
    backgroundColor: 'white',
    minHeight: 0,
    paddingVertical: 0,
  },
  txtSize: {
    marginTop: 20,
    fontSize: 16,
    paddingLeft: 6,
    width: 80,
    flex: 1,
    justifyContent: 'flex-start',
  },
  txtSizeSecondTitle: {
    fontSize: 20,
    textAlign: 'center',
  },
  actbtn3: {
    margin: 15,
    width: 150,
    textAlign: 'center',
    alignSelf: 'center',
    backgroundColor: '#1fb2e2',
  },
  imageBlueClerk: {
    marginLeft: 20,
    width: 150,
    height: 200,
  },

  listView: {
    zIndex: 1,
    position: 'absolute',
    width: 400,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 65,
    backgroundColor: 'white',
    minHeight: 0,
    paddingVertical: 0,
    textAlign: 'center',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  customerName: {
    marginLeft: 15,
    marginRight: 15,
    fontSize: 16,
    paddingVertical: 10,
    textAlign: 'center',
    alignSelf: 'center',
    borderBottomColor: '#eee',
    width: 400,
    borderBottomWidth: 1,
  },
  customerItem: {
    borderColor: 'grey',
    borderBottomWidth: 1,
    marginHorizontal: 15,
  },
  LocationWrapper: {
    marginHorizontal: 16,
    marginVertical: 10,
    borderWidth: 1,
    padding: 12,
    borderColor: 'black',
    borderRadius: 4,
  },
  locationInput: {
    fontSize: 16,
    fontFamily: 'SlateForOnePlus-Regular',
  },
  approachTag: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  custName: {
    marginTop: -5,
    backgroundColor: '#fff',
    zIndex: 9,
    paddingHorizontal: 3,
  },
  typeDropDown: {
    marginVertical: 5,
    fontSize: 16,
    minHeight: 0,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#000',
    width: 200,
    paddingLeft: 15,
    paddingVertical: 0,
  },
  brandDropdown: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#000',
    width: 200,
    paddingLeft: 15,
    paddingVertical: 0,
  },
  viewContainer: {
    flex: 1,
  },
});
