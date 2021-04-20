import React, { useState, useEffect } from 'react';
import { Keyboard, View, Text, TouchableOpacity } from 'react-native';
import { Button, Snackbar } from 'react-native-paper';
import AwesomeAlert from 'react-native-awesome-alerts';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';
import { Header } from './common-header';
import Select from './select.component';
import colors, { lightGrey } from '../styles/colors';
import Loading from './loading';
import styles from '../styles/styles';
import TextField from './text-field';
import { Service } from '../config/services';
import DateTimeSelect from './date-time-select';

export default ({ navigation }: any) => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomerIndex, setselectedCustomerIndex] = useState(-1);
  const [scheduleDate, setScheduleDate] = useState(
    moment(new Date()).format('MM/DD/YYYY')
  );
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [bottomSnackbar, setBottomSnackbar] = useState({
    visible: false,
    text: '',
  });
  const [note, setNote] = useState('');

  const loadingError = (error: any) => {
    setLoading(false);
    setBottomSnackbar({
      visible: true,
      text: error.message,
    });
  };

  const handleConfirm = (date: any) => {
    console.warn('A date has been picked: ', moment(date).format('MM/DD/YYYY'));
    setScheduleDate(moment(date).format('MM/DD/YYYY'));
  };

  useEffect(() => {
    if (selectedCustomerIndex != -1) {
      if (note != '' && scheduleDate != '') {
        setDisabled(false);
      } else {
        setDisabled(true);
      }
    } else {
      setDisabled(true);
    }
  }, [selectedCustomerIndex, note]);

  useEffect(() => {
    Service.getCustomers()
      .then((customers) => {
        setLoading(false);
        setCustomers(customers);
      })
      .catch((error) => {
        loadingError(error);
      });
  }, []);

  const handleTicketJob = () => {
    Keyboard.dismiss();
    setBtnLoading(true);
    Service.createServiceTicket(customers[selectedCustomerIndex]._id, note, scheduleDate)
      .then((response) => {
        setLoading(false);
        Service.getServiceTickets()
          .then((serviceTickets) => {
            setScheduleDate('');
            setselectedCustomerIndex(-1);
            setNote('');
            navigation.navigate('GenerateJobFromTicket', {
              serviceTicket: serviceTickets[serviceTickets.length - 1],
            });
          })
          .catch((error) => {
            loadingError(error);
          });
      })
      .catch((error) => {
        loadingError(error);
      });
  };

  const handleTicket = () => {
    Keyboard.dismiss();
    setBtnLoading(true);
    Service.createServiceTicket(customers[selectedCustomerIndex]._id, note, scheduleDate)
      .then((response) => {
        setLoading(false);
        setShowSuccess(true);
        setScheduleDate('');
        setselectedCustomerIndex(-1);
        setNote('');
      })
      .catch((error) => {
        loadingError(error);
      });
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <Header
        title="Create Service Ticket"
        leftIcon="back"
        elevation="0"
        rightIcon="Cancel"
        _goBack={() => navigation.goBack()}
      />
      {loading ? (
        <Loading />
      ) : (
        <KeyboardAwareScrollView
          contentContainerStyle={{
            padding: 10,
            paddingBottom: 30,
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
          extraHeight={20}
          keyboardShouldPersistTaps="always"
          enableOnAndroid
        >
          <View>
            <Select
              title="Customer"
              placeholder="Customer Name"
              style={{ backgroundColor: lightGrey, marginTop: 15 }}
              options={customers.map((c) => c.profile.displayName)}
              onSelect={(index) => {
                setselectedCustomerIndex(index);
              }}
              value={
                customers.length > 0 && selectedCustomerIndex >= 0
                  ? customers[selectedCustomerIndex].profile.displayName
                  : ''
              }
            />
            <TextField
              style={styles.multilineTextInput}
              title="Notes"
              placeholder="Add note"
              onChangeText={(txt) => {
                setNote(txt);
              }}
              numberOfLines={4}
              multiline
            />

            <DateTimeSelect
              style={{ backgroundColor: lightGrey, marginTop: 15 }}
              placeholder="Schedule Date"
              label="Schedule Date"
              title="Schedule Date"
              value={scheduleDate}
              onConfirm={handleConfirm}
            />
          </View>
          <TouchableOpacity activeOpacity={1} onPress={() => Keyboard.dismiss()}>
            <Button
              disabled={disabled || false}
              style={disabled ? styles.disabledButton : styles.button}
              onPress={handleTicketJob}
              loading={loading}
              color={disabled ? 'darkgray' : 'white'}
            >
              Generate job
            </Button>
            <Text style={{ marginTop: 20, textAlign: 'center' }}>OR</Text>
            <Button
              disabled={disabled || false}
              style={disabled ? styles.disabledButton : styles.button}
              loading={loading}
              onPress={handleTicket}
              color={disabled ? 'darkgray' : 'white'}
            >
              save and complete
            </Button>
          </TouchableOpacity>
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
        message="A Service Ticket has been added successfully."
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
