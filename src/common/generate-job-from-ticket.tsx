import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, Keyboard } from 'react-native';
import { Button, Snackbar } from 'react-native-paper';
import AwesomeAlert from 'react-native-awesome-alerts';
import moment from 'moment';
import { Header } from './common-header';
import Select from './select.component';
import DateTimeSelect from './date-time-select';
import colors from '../styles/colors';
import Loading from './loader';
import styles from '../styles/styles';
import { Service } from '../config/services';
import TextField from './text-field';

const {
  createServiceTicket,
  getServiceTickets,
  getJobTypes,
  createJob,
  getCompanyContracts,
  getAllEmployees,
} = Service;

export default ({ navigation, route }: any) => {
  const serviceTicket = useRef(null);
  const [contracts, setContracts] = useState<any>([]);
  const [employees, setemployees] = useState<any>([]);
  const [disabled, setDisabled] = useState(true);
  const [customers, setCustomers] = useState<any>([]);
  const [jobTypes, setJobTypes] = useState<any>([]);
  const [selectedJobtypeIndex, setSelectedJobtypeIndex] = useState(-1);
  const [selectedCustomerIndex, setselectedCustomerIndex] = useState(-1);
  const [selectedTechnicianIndex, setSelectedTechnicianIndex] = useState(-1);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [dateTime, setdateTime] = useState('');
  const [bottomSnackbar, setBottomSnackbar] = useState({
    visible: false,
    text: '',
  });
  const [note, setNote] = useState('');
  const [employeeType, setEmployeeType] = useState(0);

  const getmoreforJob = () => {
    getJobTypes()
      .then((types) => {
        setJobTypes(types);
        try {
          getCompanyContracts()
            .then((contracts) => {
              setContracts(contracts);
              getAllEmployees().then((admin) => {
                setemployees([admin]);
                setSelectedTechnicianIndex(-1);
                setLoading(false);
              });
            })
            .catch((error) => {
              getAllEmployees().then((admin) => {
                setemployees([admin]);
                setSelectedTechnicianIndex(-1);
                setLoading(false);
              });
            });
        } catch (error) {
          setLoading(false);
          setBottomSnackbar({
            visible: true,
            text: error.message,
          });
        }
      })
      .catch((error) => {
        setLoading(false);
        setBottomSnackbar({
          visible: true,
          text: error.message,
        });
      });
  };

  useEffect(() => {
    const ticket = route.params && route.params.serviceTicket ? route.params.serviceTicket : '';
    if (ticket) {
      serviceTicket.current = ticket;
      setCustomers([ticket.customer]);
      setselectedCustomerIndex(0);
      setNote(ticket.note);
      getmoreforJob();
      return;
    }

    Service.getCustomers()
      .then((customers) => {
        setCustomers(customers);
        getmoreforJob();
      })
      .catch((error) => {
        setLoading(false);
        setBottomSnackbar({
          visible: true,
          text: error.message,
        });
      });
  }, []);

  useEffect(() => {
    if (
      selectedCustomerIndex != -1
      && note
      && selectedJobtypeIndex != -1
      && dateTime
      && selectedTechnicianIndex != -1
    ) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [
    selectedCustomerIndex,
    note,
    selectedJobtypeIndex,
    selectedTechnicianIndex,
    dateTime,
  ]);

  const handleButton = () => {
    Keyboard.dismiss();
    setBtnLoading(true);
    if (serviceTicket.current) {
      generateJob();
    } else {
      createServiceTicket(customers[selectedCustomerIndex]._id, note)
        .then((response) => {
          getServiceTickets()
            .then((tickets) => {
              serviceTicket.current = tickets[tickets.length - 1];
              generateJob();
            })
            .catch((error) => {
              loadingError(error);
            });
        })
        .catch((error) => {
          loadingError(error);
        });
    }
  };

  const loadingError = (error) => {
    setLoading(false);
    setBtnLoading(false);
    setBottomSnackbar({
      visible: true,
      text: error.message,
    });
  };

  const generateJob = () => {
    createJob({
      scheduleDate: dateTime,
      ticketId: serviceTicket.current._id,
      technicianId: technicians[selectedTechnicianIndex]._id,
      customerId: customers[selectedCustomerIndex]._id,
      jobTypeId: jobTypes[selectedJobtypeIndex]._id,
      employeeType,
    })
      .then((res) => {
        setBtnLoading(false);
        setShowSuccess(true);
      })
      .catch((error) => {
        loadingError(error);
      });
  };

  const handleDatetime = (datetime) => {
    setdateTime(moment(datetime).format('YYYY-MM-DD HH:mm:ss'));
  };

  const technicians = employeeType == 0 ? employees : contracts;

  return (
    <>
      <Header
        title="Generate Job"
        leftIcon="back"
        elevation="0"
        rightIcon="Cancel"
        _goBack={() => navigation.goBack()}
      />
      <SafeAreaView style={styles.container}>
        {loading ? (
          <Loading />
        ) : (
          <KeyboardAwareScrollView
            contentContainerStyle={{ padding: 10, paddingBottom: 30 }}
            extraHeight={20}
            enableOnAndroid
            keyboardShouldPersistTaps="always"
          >
            <Select
              title="Customer"
              placeholder="Customer Name"
              style={styles.select}
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
              value={note}
              multiline
            />
            <Select
              title="Employee Type"
              placeholder="Selecte an employee type"
              style={styles.select}
              options={['Employee', 'Vendor']}
              onSelect={(index) => {
                setEmployeeType(index);
              }}
              value={employeeType == 0 ? 'Employee' : 'Vendor'}
            />
            <Select
              title="Job Type"
              placeholder="Selecte a Job Type"
              style={styles.select}
              options={jobTypes.map((c) => c.title)}
              onSelect={(index) => {
                setSelectedJobtypeIndex(index);
              }}
              value={
                jobTypes.length > 0 && selectedJobtypeIndex >= 0
                  ? jobTypes[selectedJobtypeIndex].title
                  : ''
              }
            />
            <Select
              title="Technician"
              placeholder="Select a Technician"
              style={styles.select}
              options={technicians.map((c) => c.profile.displayName)}
              onSelect={(index) => {
                setSelectedTechnicianIndex(index);
              }}
              value={
                technicians.length > 0 && selectedTechnicianIndex >= 0
                  ? technicians[selectedTechnicianIndex].profile.displayName
                  : ''
              }
            />
            <DateTimeSelect
              style={styles.select}
              value={dateTime}
              title="Schedule date and time"
              placeholder="Date/Time"
              onConfirm={handleDatetime}
            />
            <Button
              disabled={disabled || false}
              style={disabled ? styles.disabledButton : styles.button}
              onPress={handleButton}
              color="white"
              loading={btnLoading}
              uppercase={false}
            >
              Generate
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
          message="A Job has been added successfully."
          showConfirmButton
          confirmText="Close"
          onConfirmPressed={() => {
            setShowSuccess(false);
            navigation.goBack();
          }}
          confirmButtonColor={colors.assertColor}
        />
      </SafeAreaView>
    </>
  );
};
