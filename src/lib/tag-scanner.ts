import { observable } from 'mobx';
import NfcManager, { NfcEvents, TagEvent } from 'react-native-nfc-manager';
import { Alert, Platform } from 'react-native';

export default class TagScanner {
  @observable tag: TagEvent | null = null;

  constructor() {
    this.setup();
  }

  private async setup() {
    const supported = await NfcManager.isSupported();
    if (supported) {
      if (Platform.OS === 'android') {
        const enabled = await NfcManager.isEnabled();
        if (!enabled) {
          Alert.alert(
            'Enable NFC',
            'Please enable the NFC Feature by going into settings',
            [
              {
                text: 'Cancel',
                onPress: () => ({}),
                style: 'cancel',
              },
              { text: 'Open Settings', onPress: () => NfcManager.goToNfcSetting() },
            ]
          );
          return;
        }
      }

      NfcManager.setEventListener(NfcEvents.DiscoverTag, (tag: TagEvent) => {
        this.tag = tag;
        console.warn('New Tag', this.tag);
      });
    }
  }

  public async start() {
    if (Platform.OS === 'android') {
      this.tag = await NfcManager.getLaunchTagEvent();
      if (this.tag) {
        return;
      }
    }
    // eslint-disable-next-line no-unused-expressions
    () => {
      console.log('ios session closed');
    };
    try {
      await NfcManager.registerTagEvent();
    } catch (ex) {
      NfcManager.unregisterTagEvent().catch(() => 0);
    }
  }

  public destroy() {
    NfcManager.unregisterTagEvent().catch(() => 0);
  }
}
