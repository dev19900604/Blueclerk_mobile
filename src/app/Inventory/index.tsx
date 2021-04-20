import React, { Component } from 'react';
import { Button, Snackbar } from 'react-native-paper';
import { View, Platform, Image, Keyboard, Alert } from 'react-native';
import NfcManager, { Ndef } from 'react-native-nfc-manager';
import ActionSheet from 'react-native-actionsheet';
import AsyncStorage from '@react-native-community/async-storage';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import styles from './styles';
import Loader from '../../common/loader';
import Header from '../../common/common-header';
import { URL } from '../../config/apis';

type RtdType = {
  URL: 0;
  TEXT: 1;
};

type InventotyPropsType = {
  supported: boolean;
  enabled: boolean;
  isWriting: boolean;
  urlToWrite: string;
  rtdType: RtdType['URL'];
  parsedText: string;
  qrCode: string;
  tag: any;
  visible: boolean;
  message: string;
  isLoading: boolean;
  action: string;
  inventory: boolean;
  checkIn: boolean;
};

type Props = {
  navigation: DrawerNavigationProp<any>;
};

function buildUrlPayload(valueToWrite: any) {
  return Ndef.encodeMessage([Ndef.uriRecord(valueToWrite)]);
}
function buildTextPayload(valueToWrite: any) {
  return Ndef.encodeMessage([Ndef.textRecord(valueToWrite)]);
}
export default class Inventory extends Component<Props, InventotyPropsType> {
  static navigationOptions = {
    drawerIcon: ({ tintColor }) => (
      <Image
        source={require('../../../assets/icons/inventory.png')}
        style={[styles.icon, { tintColor }]}
      />
    ),
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      supported: true,
      enabled: false,
      isWriting: false,
      urlToWrite: 'https://www.google.com',
      rtdType: RtdType.URL,
      parsedText: '',
      qrCode: '',
      tag: {},
      visible: false,
      message: '',
      isLoading: false,
      action: '',
      inventory: false,
      checkIn: false,
    };
  }

  componentDidMount() {
    NfcManager.isSupported().then((supported) => {
      this.setState({ supported });
      if (supported) {
        this._startNfc();
      }
    });
  }

  _openMenu = () => {
    Keyboard.dismiss();
    this.props.navigation.toggleLeftDrawer();
  };

  chooseOption = (index: number) => {
    this.setState({ inventory: true });
    if (index == 0) {
      this._startScanning();
    } else if (index == 1) {
      this.props.navigation.navigate('QRCodeScannerScreen');
    }
  };

  _startScanning = () => {
    if (Platform.OS == 'android' && this.state.enabled == false) {
      this._showAlert();
      return;
    }

    if (Platform.OS == 'android') {
      this._startDetection();
      this._stopDetection();
      this._startDetection();
    } else {
      this._startDetection();
    }
  };

  _showAlert = () => {
    Alert.alert('Enable NFC', 'Please enable the NFC Feature by going into settings', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      { text: 'Go To Settings', onPress: () => this._goToNfcSetting() },
    ]);
  };

  _showCheck = () => {
    this.checkInSheet.show();
  };

  chooseCheck = (index: any) => {
    this.setState({ checkIn: true });
    if (index == 0) {
      this.setState({ action: 0, visible: true }, () => {
        this._startScanning();
      });
    } else if (index == 1) {
      this.setState({ action: 1, visible: true }, () => {
        this._startScanning();
      });
    }
  };

  _checkInOut = () => {
    this.setState({ isLoading: true });

    this.retrieveData('token').then((token) => {
      body = {
        action: this.state.action,
        dateTime: new Date().getTime().toString(),
        nfcTag: this.state.parsedText,
        qrCode: this.state.qrCode,
      };

      const param = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify(body),
      };

      fetch(`${URL}/equipmentCheckInOut`, param)
        .then((res) => res.json())
        .then((data) => {
          if (data.status == 1) {
            this.setState(
              {
                message: data.message,
                parsedText: '',
                qrCode: '',
                isLoading: false,
              },
              () => {
                const msg = this.state.action
                  ? 'This item has been checked out successfully'
                  : 'This item has been checked in successfully';
                Alert.alert('Success', msg);
              }
            );
          } else {
            this.setState(
              {
                message: data.message,
                parsedText: '',
                qrCode: '',
                isLoading: false,
              },
              () => {
                Alert.alert('Error', data.message);
              }
            );
          }
        })
        .catch((err) => {
          this.setState({ isLoading: false });
          Alert.alert('Error', 'Something is went wrong');
        });
    });
  };

  _requestFormat = () => {
    const { isWriting } = this.state;
    if (isWriting) {
      return;
    }
    this.setState({ isWriting: true });
    NfcManager.requestNdefWrite(null, { format: true })
      .then(() => console.log('format completed'))
      .catch((err) => console.warn(err))
      .then(() => this.setState({ isWriting: false }));
  };

  _requestNdefWrite = () => {
    const { isWriting, urlToWrite, rtdType } = this.state;
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
    NfcManager.requestNdefWrite(bytes)
      .then(() => console.log('write completed'))
      .catch((err) => console.warn(err))
      .then(() => this.setState({ isWriting: false }));
  };

  _cancelNdefWrite = () => {
    this.setState({ isWriting: false });
    NfcManager.cancelNdefWrite()
      .then(() => console.log('write cancelled'))
      .catch((err) => console.warn(err));
  };

  _requestAndroidBeam = () => {
    const { isWriting, urlToWrite, rtdType } = this.state;
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
    NfcManager.setNdefPushMessage(bytes)
      .then(() => console.log('beam request completed'))
      .catch((err) => console.warn(err));
  };

  _cancelAndroidBeam = () => {
    this.setState({ isWriting: false });
    NfcManager.setNdefPushMessage(null)
      .then(() => console.log('beam cancelled'))
      .catch((err) => console.warn(err));
  };

  retrieveData = async (name) => {
    try {
      const value = await AsyncStorage.getItem(name);
      if (value !== null) {
        return JSON.parse(value);
      }
    } catch (error) {}
  };

  takeInventory = () => {
    this.setState({ isLoading: true });
    this.retrieveData('token').then((token) => {
      body = {
        dateTime: new Date().getTime().toString(),
        nfcTags: this.state.parsedText,
        qrCodes: this.state.qrCode,
      };

      const param = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify(body),
      };

      fetch(`${URL}/takeInventory`, param)
        .then((res) => res.json())
        .then((data) => {
          if (data.status == 1) {
            this.setState(
              {
                message: data.message,
                parsedText: '',
                qrCode: '',
                isLoading: false,
              },
              () => {
                Alert.alert('Success', 'Tag scanned successfully');
              },
            );
          } else {
            this.setState(
              {
                message: data.message,
                parsedText: '',
                qrCode: '',
                isLoading: false,
              },
              () => {
                Alert.alert('Error', data.message);
              },
            );
          }
        })
        .catch(() => {
          this.setState({ isLoading: false });
          Alert.alert('Error', 'Something is went wrong');
        });
    });
  };

  _onTagDiscovered = (tag) => {
    this.setState({ parsedText: JSON.stringify(tag.ndefMessage) });
    this._stopDetection();

    this.state.inventory ? this.takeInventory() : this._checkInOut();
  };

  _startDetection = () => {
    NfcManager.registerTagEvent(this._onTagDiscovered);
  };

  _stopDetection = () => {
    NfcManager.unregisterTagEvent();
  };

  _clearMessages = () => {
    this.setState({ tag: null });
  };

  _goToNfcSetting = () => {
    if (Platform.OS === 'android') {
      NfcManager.goToNfcSetting();
    }
  };

  _parseUri = (tag: any) => {
    if (Ndef.isType(tag.ndefMessage[0], Ndef.TNF_WELL_KNOWN, Ndef.RTD_URI)) {
      return Ndef.uri.decodePayload(tag.ndefMessage[0].payload);
    }
    return null;
  };

  _parseText = (tag: any) => {
    if (Ndef.isType(tag.ndefMessage[0], Ndef.TNF_WELL_KNOWN, Ndef.RTD_TEXT)) {
      return Ndef.text.decodePayload(tag.ndefMessage[0].payload);
    }
    return null;
  };

  _startNfc() {
    NfcManager.start().catch(() => {
      this.setState({ supported: false });
    });

    if (Platform.OS === 'android') {
      NfcManager.getLaunchTagEvent().then((tag) => {
        if (tag) {
          this.setState({ tag });
        }
      });

      NfcManager.isEnabled().then((enabled) => {
        this.setState({ enabled });
      });

      NfcManager.onStateChanged((event) => {
        if (event.state === 'on') {
          this.setState({ enabled: true });
        } else if (event.state === 'off') {
          this.setState({ enabled: false });
        }
      }).then((sub: any) => {
        this._stateChangedSubscription = sub;
      });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Header title="Inventory" leftIcon="menu" _openMenu={() => this._openMenu()} />
        <Loader loading={this.state.isLoading} />
        <View style={styles.containerButton}>
          <Button
            style={styles.actbtn}
            mode="contained"
            fontSize="10"
            onPress={this.showActionSheet}
          >
            Take Inventory
          </Button>
          <Button
            style={styles.actbtn}
            mode="contained"
            fontSize="10"
            onPress={this._showCheck}
          >
            Check In/Out
          </Button>
        </View>
        <Snackbar
          duration={3000}
          visible={this.state.visible}
          style={{ marginTop: 100 }}
          onDismiss={() => this.setState({ visible: false })}
        >
          Scan the tag of the item you need to CheckOut/CheckIn
        </Snackbar>
        <View>
          <ActionSheet
            ref={(o) => (this.ActionSheet = o)}
            title="What To Scan"
            tintColor="#00bfff"
            options={['Scan Tag', 'Scan QR Code', 'Cancel']}
            cancelButtonIndex={2}
            onPress={(index) => this.chooseOption(index)}
          />
        </View>
        <View>
          <ActionSheet
            ref={(o) => (this.checkInSheet = o)}
            title="Check In/ Check Out"
            tintColor="#00bfff"
            options={['Check In', 'Check Out', 'Cancel']}
            cancelButtonIndex={2}
            onPress={(index) => this.chooseCheck(index)}
          />
        </View>
      </View>
    );
  }
}
