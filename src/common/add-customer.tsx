import React, { useState, useRef, useEffect } from 'react';
import { Keyboard, View, StyleSheet } from 'react-native';
import { Button, Snackbar } from 'react-native-paper';
import AwesomeAlert from 'react-native-awesome-alerts';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from '../styles/styles';
import { Header } from './common-header';
import colors, { lightGrey, white } from '../styles/colors';
import TextField from './text-field';
import { Service } from '../config/services';

export default ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const emailRef = useRef();
  const conpanyNameRef = useRef();
  const phoneNumberRef = useRef();
  const contactNameRef = useRef();
  const streetRef = useRef();
  const cityRef = useRef();
  const stateRef = useRef();
  const zipCodeRef = useRef();
  const [conpanyName, setConpanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [emailerror, setEmailerror] = useState<any>(null);
  const [contactnameError, setContactnameError] = useState<any>(null);
  const [disabled, setDisabled] = useState(true);
  const [bottomSnackbar, setBottomSnackbar] = useState({
    visible: false,
    text: '',
  });
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAdd = () => {
    Keyboard.dismiss();
    setLoading(true);
    Service.createCustomer({
      email,
      name: contactName,
      street,
      city,
      state,
      zipCode,
      phone: phoneNumber,
    })
      .then((response) => {
        setLoading(false);
        setShowSuccess(true);
      })
      .catch((error) => {
        setLoading(false);
        setBottomSnackbar({ visible: true, text: error.message });
      });
  };

  const validateEmail = (emailText: string) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(emailText);
  };

  const handleChangeEmail = (emailText: string) => {
    if (!validateEmail(emailText)) {
      setEmailerror(true);
    } else {
      setEmailerror(false);
    }
    setEmail(email);
  };

  const handleChangeContactName = (txt: any) => {
    if (!txt) {
      setContactnameError(true);
    } else {
      setContactnameError(false);
    }
    setContactName(txt);
  };

  useEffect(() => {
    if (emailerror == false && contactnameError == false) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [emailerror, contactnameError]);

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <Header
        title="Add Customer"
        leftIcon="back"
        rightIcon="Cancel"
        elevation="0"
        _goBack={() => navigation.navigate('Jobs')}
      />
      <KeyboardAwareScrollView
        contentContainerStyle={{ padding: 10, paddingBottom: 30 }}
        extraHeight={20}
        enableOnAndroid
      >
        <TextField
          title="Company Name"
          placeholder="Company Name"
          style={[style.textField, style.textFieldContainer]}
          ref={conpanyNameRef}
          onChangeText={(txt) => setConpanyName(txt)}
        />
        <TextField
          title="Customer Name"
          placeholder="Customer Name"
          ref={contactNameRef}
          style={[style.textField, style.textFieldContainer]}
          onChangeText={handleChangeContactName}
        />
        <TextField
          title="Email"
          placeholder="Customer Email"
          error={!!emailerror}
          ref={emailRef}
          keyboardType="email-address"
          style={[style.textField, style.textFieldContainer]}
          onChangeText={handleChangeEmail}
        />
        <TextField
          title="Phone number"
          placeholder="Phone number"
          ref={phoneNumberRef}
          style={[style.textField, style.textFieldContainer]}
          keyboardType="phone-pad"
          onChangeText={(txt) => setPhoneNumber(txt)}
        />
        <TextField
          title="Street"
          placeholder="Street"
          style={[style.textField, style.textFieldContainer]}
          keyboardType="phone-pad"
          ref={streetRef}
          onChangeText={(txt) => setStreet(txt)}
        />
        <TextField
          title="City"
          placeholder="City"
          ref={cityRef}
          style={[style.textField, style.textFieldContainer]}
          keyboardType="phone-pad"
          onChangeText={(txt) => setCity(txt)}
        />
        <TextField
          title="State"
          placeholder="State"
          ref={stateRef}
          style={[style.textField, style.textFieldContainer]}
          keyboardType="phone-pad"
          onChangeText={(txt) => setState(txt)}
        />
        <TextField
          title="Zip Code"
          placeholder="Zip Code"
          ref={zipCodeRef}
          style={[style.textField, style.textFieldContainer]}
          keyboardType="phone-pad"
          onChangeText={(txt) => setZipCode(txt)}
        />
        <Button
          disabled={disabled || false}
          style={disabled ? styles.disabledButton : styles.button}
          onPress={handleAdd}
          loading={loading}
          color={disabled ? 'darkgray' : 'white'}
        >
          Save and complete
        </Button>
      </KeyboardAwareScrollView>
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
        message="A customer has been added successfully."
        showConfirmButton
        confirmText="Close"
        onConfirmPressed={() => navigation.navigate('Jobs')}
        confirmButtonColor={colors.assertColor}
      />
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white,
    padding: 10,
  },
  textFieldContainer: {
    alignSelf: 'stretch',
    marginTop: 15,
  },
  textField: {
    backgroundColor: lightGrey,
  },
  button: {
    margin: 15,
  },
  photos: {
    marginTop: 10,
  },
});
