import React, { useState, useEffect } from 'react';
import { View, Keyboard } from 'react-native';
import { Button, Snackbar } from 'react-native-paper';
import AwesomeAlert from 'react-native-awesome-alerts';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import styles from '../styles/styles';
import colors from '../styles/colors';
import { Header } from './common-header';
import Loading from './loading';
import TextField from './text-field';
import { Service } from '../config/services';

const { createPurchaseOrder } = Service;

export default ({ navigation, route }: any) => {
  const { equipmentDetails } = route.params;
  const { nfcTag } = route.params;
  const { customer } = equipmentDetails.equipment;
  const [customers, setCustomers] = useState([customer]);
  const [selectedCustomerIndex, setselectedCustomerIndex] = useState(0);
  const [jobId, setJobId] = useState('');
  const [jobType, setJobType] = useState('');
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [note, setNote] = useState('');
  const [selectedJob, setSelectedJob] = useState('');
  const [bottomSnackbar, setBottomSnackbar] = useState({
    visible: false,
    text: '',
  });

  const _getJobs = async () => {
    const response = await Service.getJobs('alljobs');
    const { jobs } = response.data;
    jobs.map((item: any) => {
      if (item.status == 1) {
        setSelectedJob(item._id);
        setJobId(item.jobId);
        setJobType(item.type ? item.type.title : '');
      }
    });
  };

  useEffect(() => {
    _getJobs();
  }, []);

  useEffect(() => {
    if (setselectedCustomerIndex != -1 && note) {
      setDisabled(false);
    }
  }, [note, setselectedCustomerIndex]);

  const loadingError = (error) => {
    setLoading(false);
    setBtnLoading(false);
    setBottomSnackbar({
      visible: true,
      text: error.message,
    });
  };

  const handleButton = () => {
    Keyboard.dismiss();
    setBtnLoading(true);
    createPurchaseOrder({
      customer: customer._id,
      note,
      equipmentId: equipmentDetails.equipment._id,
      job: selectedJob,
    })
      .then((res) => {
        setBtnLoading(false);
        setShowSuccess(true);
      })
      .catch((error) => {
        loadingError(error);
      });
  };

  return (
    <View style={styles.container}>
      <Header
        title="Create Purchase Order"
        leftIcon="back"
        rightIcon="Cancel"
        elevation="0"
        _goBack={() => navigation.goBack()}
      />
      {loading ? (
        <Loading />
      ) : (
        <KeyboardAwareScrollView
          contentContainerStyle={{ padding: 10, paddingBottom: 30 }}
          extraHeight={20}
          enableOnAndroid
          keyboardShouldPersistTaps="always"
        >
          <TextField
            title="Customer"
            placeholder="Customer"
            style={[styles.textField, styles.textFieldContainer]}
            editable={false}
            value={
              customers.length > 0 && selectedCustomerIndex >= 0
                ? customers[selectedCustomerIndex].profile.displayName
                : ''
            }
          />
          <TextField
            title="Job Id"
            placeholder="JobId"
            style={[styles.textField, styles.textFieldContainer]}
            editable={false}
            value={jobId}
          />
          <TextField
            title="Type"
            placeholder="Type"
            style={[styles.textField, styles.textFieldContainer]}
            editable={false}
            value={jobType}
          />
          <TextField
            style={styles.multilineTextInput}
            title="Notes"
            placeholder="Add note"
            onChangeText={(txt) => {
              setNote(txt);
            }}
            value={note}
            multiline
          />
          <Button
            disabled={disabled || false}
            style={disabled ? styles.disabledButton : styles.button}
            onPress={handleButton}
            color="white"
            loading={btnLoading}
            uppercase
          >
            Generate Order
          </Button>
        </KeyboardAwareScrollView>
      )}
      <Snackbar
        visible={bottomSnackbar.visible}
        onDismiss={() => {
          setBottomSnackbar({ visible: false, text: '' });
        }}
      >
        {bottomSnackbar.text}
      </Snackbar>
      <AwesomeAlert
        show={showSuccess}
        title="Success"
        message="Purchase order created successfully."
        showConfirmButton
        confirmText="Close"
        onConfirmPressed={() => {
          setShowSuccess(false);
          navigation.goBack();
        }}
        confirmButtonColor={colors.assertColor}
      />
    </View>
  );
};
