import React, { useEffect, useRef, useState } from 'react';
import {
  Image, SafeAreaView, StyleSheet, Text, View,
} from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { reaction } from 'mobx';
import { Ndef } from 'react-native-nfc-manager';
import ScanTagStore from '../app/ScanTag/stores/scan-tag-store';
import { fetchScanTag } from '../app/ScanTag/api';
import TagScanner from '../lib/tag-scanner';
import ActionButton from './action-button.component';
import { background, white } from '../styles/colors';

const nfcEmulator = '';
// new account location tags
// const nfcEmulator = '0494AF82926780';
// const nfcEmulator = '04:7C:46:2A:5D:67:80';

// new account equipment tags
// const nfcEmulator = '04:74:74:82:92:67:81';
// const nfcEmulator = '04:71:AF:82:92:67:80';

// const nfcEmulator = 'mycotest1';

const _onTagDiscovered = (tag: any) => {
  let parsed = null;

  if (tag.ndefMessage && tag.ndefMessage.length > 0) {
    const ndefRecords = tag.ndefMessage;

    function decodeNdefRecord(record) {
      if (Ndef.isType(record, Ndef.TNF_WELL_KNOWN, Ndef.RTD_TEXT)) {
        return Ndef.text.decodePayload(record.payload);
      }
      return ['unknown', '---'];
    }
    parsed = ndefRecords.map(decodeNdefRecord);
  }
};

function ScanTagScreen() {
  const [scanned, setScanned] = useState(false);

  const navigation = useNavigation();
  const scannerRef = useRef(new TagScanner());
  const storeRef = useRef(new ScanTagStore());

  useEffect(() => {
    if (nfcEmulator) {
      setTimeout(() => {
        setScanned(true);
      }, 1000);
      reaction(
        () => storeRef.current.equipments,
        (equipments) => {
          setTimeout(() => {
            setScanned(true);
          }, 1000);
        },
      );
      if (storeRef.current) {
        storeRef.current.getCustomerEquipments();
      } else {
        console.log('storeRef: null');
      }
    } else {
      reaction(
        () => scannerRef.current.tag,
        (tag) => {
          if (tag) {
            setScanned(true);
          }
        },
      );

      scannerRef.current.start();
      storeRef.current.getCustomerEquipments();

      return () => {
        scannerRef.current.destroy();
      };
    }
  }, []);

  if (scanned) {
    // navigation.replace('Options');
    // navigation.replace('EquipmentDetail', { nfcTag: nfcEmulator });
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <LottieView
          source={require('../../assets/animations/check_mark.json')}
          autoPlay
          style={styles.animation}
          loop={false}
          onAnimationFinish={async () => {
            let nfcTag = '';
            if (nfcEmulator != '') {
              nfcTag = nfcEmulator;
            } else {
              _onTagDiscovered(scannerRef.current.tag);
              nfcTag = Ndef.text.decodePayload(
                scannerRef.current.tag?.ndefMessage[0].payload,
              );
            }
            const { tagStatus, tagType } = await fetchScanTag(nfcTag);
            switch (tagStatus) {
              case 3:
                navigation.replace('Options', {
                  nfcTag,
                });
                break;
              case 2:
                if (tagType == 0) {
                  navigation.replace('EquipmentDetail', {
                    nfcTag,
                  });
                } else {
                  navigation.replace('LocationDetail', {
                    nfcTag,
                  });
                }
                break;
              default:
                break;
            }
          }}
        />
        <Text style={styles.title}>Tag Scanned</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/icons/white_logo.png')}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.heading}>Ready to Scan</Text>
      <Text style={styles.text}>Touch phone to BlueClerk Tag</Text>
      <View style={{ flex: 1 }} />
      <ActionButton style={styles.button} destructive onPress={() => navigation.goBack()}>
        Cancel
      </ActionButton>
      <SafeAreaView />
    </View>
  );
}

export default ScanTagScreen;

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
    marginBottom: 40,
  },
  animation: {
    height: 200,
  },
  title: {
    color: white,
    marginTop: 10,
    fontSize: 36,
  },
});
