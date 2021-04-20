import React, { Component } from 'react';
import { Alert, Keyboard, Platform, View } from 'react-native';
import NfcManager, { Ndef } from 'react-native-nfc-manager';
import AsyncStorage from '@react-native-community/async-storage';
import { logEvent } from '../../helpers';
import ScanTag from '../../common/scan-tag.screen';
import { Service } from '../../config/services';
import Job from '../../common/job';

const { getCustomerEquipmentJobs } = Service;
const RtdType = {
  URL: 0,
  TEXT: 1,
};

function buildUrlPayload(valueToWrite) {
  return Ndef.encodeMessage([Ndef.uriRecord(valueToWrite)]);
}

function buildTextPayload(valueToWrite) {
  return Ndef.encodeMessage([Ndef.textRecord(valueToWrite)]);
}

type state = {
  supported: boolean;
  enabled: boolean;
  isWriting: boolean;
  urlToWrite: string;
  rtdType: number;
  parsedText: null;
  tag: any;
  jobs: any[];
  user: any;
  isLoading: boolean;
  isEmpty: boolean;
  showReset: boolean;
};

class ScanBlueTag extends Component<any, state> {
  constructor(props) {
    super(props);
    logEvent('scan_blue_tag_screen');
    this.state = {
      supported: true,
      enabled: false,
      isWriting: false,
      urlToWrite: 'https://www.google.com',
      rtdType: RtdType.URL,
      parsedText: null,
      tag: {},
      jobs: [],
      user: {},
      isLoading: false,
      isEmpty: false,
      showReset: false,
    };
  }

  async componentDidMount() {
    let user = await this.getToken();
    user = JSON.parse(user as string);
    this.setState({ user });

    NfcManager.isSupported().then((supported) => {
      this.setState({ supported });
      if (supported) {
        this._startNfc();
      }
    });
  }

  componentWillUnmount() {
    if (this._stateChangedSubscription) {
      this._stateChangedSubscription.remove();
    }
  }

  getToken = async () => await AsyncStorage.getItem('user');

  _goToReport = (job: any) => {
    let restriction = true;
    const jobCompanyId = job.company ? job.company._id : null;
    const userCompanyId = this.state.user.company
      ? this.state.user.company
      : this.state.user._id;
    jobCompanyId == userCompanyId ? (restriction = false) : (restriction = true);

    this.props.navigation.navigate('Report', { job, from: restriction });
  };

  _openMenu = () => {
    Keyboard.dismiss();
    this.props.navigation.toggleLeftDrawer();
  };

  _showAlert = () => {
    Alert.alert('Enable NFC', 'Please enable the NFC Feature by going into settings', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      { text: 'Go To Settings', onPress: () => this._goToNfcSetting() },
    ]);
  };

  _handleScan = () => {
    if (Platform.OS == 'android' && this.state.enabled == false && this.state.supported) {
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

  _renderItem = (item) => {
    item = item.item;
    const status = this.getJobStatus(item);
    const type = item.type ? this._getTypeIcon(item.type.title) : 'ios-hammer';

    return (
      <Job
        item={item}
        status={status}
        type={type}
        onClick={() => this._goToReport(item)}
      />
    );
  };

  _getTypeIcon = (title: any) => {
    if (title.trim() == 'Repair') return 'ios-hammer';
    if (title.trim() == 'Diagnosis') return 'md-bug';
    if (title.trim() == 'Maintenance') return 'ios-build';
    if (title.trim() == 'Installation') return 'ios-download';
    return 'ios-hammer';
  };

  getJobStatus = (item: any) => {
    let status = 'Not Started';
    if (item.status == '0') status = 'Not Started';
    else if (item.status == '1') status = 'Started';
    else if (item.status == '2') status = 'Completed';
    else if (item.status == '3') status = 'Cancelled';

    return status;
  };

  _resetHistory = () => {
    this.setState({ jobs: [], showReset: false, isEmpty: false });
  };

  _requestFormat = () => {
    const { isWriting } = this.state;
    if (isWriting) {
      return;
    }
    this.setState({ isWriting: true });
    NfcManager.requestNdefWrite(null, { format: true }).then(() =>
      this.setState({ isWriting: false })
    );
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
    NfcManager.requestNdefWrite(bytes).then(() => this.setState({ isWriting: false }));
  };

  _cancelNdefWrite = () => {
    this.setState({ isWriting: false });
    NfcManager.cancelNdefWrite();
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
    NfcManager.setNdefPushMessage(bytes);
  };

  _cancelAndroidBeam = () => {
    this.setState({ isWriting: false });
    NfcManager.setNdefPushMessage(null);
  };

  _parseText = (tag: any) => {
    if (Ndef.isType(tag.ndefMessage[0], Ndef.TNF_WELL_KNOWN, Ndef.RTD_TEXT)) {
      return Ndef.text.decodePayload(tag.ndefMessage[0].payload);
    }
    return null;
  };

  _parseUri = (tag: any) => {
    if (Ndef.isType(tag.ndefMessage[0], Ndef.TNF_WELL_KNOWN, Ndef.RTD_URI)) {
      return Ndef.uri.decodePayload(tag.ndefMessage[0].payload);
    }
    return null;
  };

  _onTagDiscovered = (tag) => {
    this.setState(
      {
        parsedText: JSON.stringify(tag.ndefMessage),
        isLoading: true,
        isEmpty: false,
      },
      () => {
        this.getCustomerEquipmentJobs();
      }
    );
    this._stopDetection();
  };

  getCustomerEquipmentJobs = async () => {
    const params = {
      nfcTag: this.state.parsedText,
    };

    try {
      const response = await getCustomerEquipmentJobs(params);
      let jobs;

      if (this.state.user.permissions.role != 1) {
        jobs = this.filterJobs(response.data.jobs, this.state.user._id);
      } else {
        jobs = this.filterJobs(response.data.jobs, this.state.user.company);
      }

      const { status } = response.data;

      if (status == 1) {
        this.setState({ jobs, isLoading: false, showReset: true });
      } else {
        this.setState({ isLoading: false, isEmpty: true, showReset: true });
      }
    } catch (err) {
      this.setState({ isLoading: false, isEmpty: true, showReset: true });
    }
  };

  filterJobs = (jobs: any, id: any) => {
    const filteredJobs = jobs.filter((job: any) => {
      if (job.company) {
        return job.company._id == id;
      }
      return false;
    });
    return filteredJobs;
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

  _startNfc() {
    NfcManager.start()
      .then((result) => {
        console.log('start OK', result);
      })
      .catch((error) => {
        console.warn('start fail', error);
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
      }).then((sub) => {
        this._stateChangedSubscription = sub;
      });
    }
  }

  render() {
    const { isLoading, jobs, isEmpty, showReset } = this.state;

    return (
      <View style={{ flex: 1 }}>
        {!isLoading && jobs.length == 0 && !isEmpty && (
          <ScanTag
            handleScan={() => this._handleScan()}
            message="Click on above icon to get started. Approach a Blue tag to see work history"
          />
        )}
      </View>
    );
  }
}

export default ScanBlueTag;
