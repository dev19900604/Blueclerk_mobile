import React, { useState } from 'react';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Snackbar } from 'react-native-paper';
import Loader from '../common/loader';
import Header from '../common/common-header';
import TextField from '../common/text-field';
import { turquoise } from '../styles/colors';
import ActionButton from '../common/action-button.component';
import { Service } from '../config/services';

function ForgotPassword({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');

  const handleEmail = (text: string) => {
    setEmail(text);
  };

  const handleForgotPass = () => {
    if (validateEmail()) {
      setVisible(true);
      setMessage('Please fill all fields');

      return;
    }

    handleRecovery();
  };

  const handleRecovery = async () => {
    setLoading(true);

    if (email) {
      try {
        const response = await Service.forgotPassword({ email });

        if (response.status == 200) {
          setMessage('We have sent verification code to your email');
          setLoading(false);
          setVisible(true);
          setEmail('');

          setTimeout(() => {
            navigation.goBack();
          }, 1500);
        } else {
          setMessage('Invalid email address');
          setLoading(false);
          setVisible(true);
        }
      } catch (err) {
        setMessage('Something has gone wrong');
        setLoading(false);
        setVisible(true);
      }
    } else {
      setVisible(true);
      setMessage('Please provide an email address');
    }
  };

  const validateEmail = () => {
    const email_address = checkField(email);

    if (email_address) {
      return true;
    }
    return false;
  };

  const checkField = (field: any) => {
    if (field.toString() == '') {
      return true;
    }
    return false;
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.background}>
      <Image
        style={styles.backgroundImage}
        source={require('../../assets/images/login_bg.png')}
        resizeMode="stretch"
      />
      <Header leftIcon="goback" _goBack={() => handleBack()} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <SafeAreaView style={styles.container}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ flex: 1 }}>
              <Image
                style={styles.imgStyle}
                source={require('../../assets/icons/blue_logo.png')}
              />
              <Loader loading={isLoading} />
              <View style={styles.passContainer}>
                <Text style={styles.passText}>
                  Enter your email below to receive your password reset instructions
                </Text>
              </View>

              <TextField
                title="EMAIL"
                placeholder="Email Address"
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={handleEmail}
                value={email}
              />

              <Snackbar
                duration={2000}
                visible={visible}
                onDismiss={() => setVisible(false)}
              >
                {message}
              </Snackbar>

              <ActionButton style={styles.loginbutton} onPress={handleForgotPass}>
                SUBMIT
              </ActionButton>
            </View>
          </TouchableWithoutFeedback>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
}

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 12,
  },
  input: {
    fontFamily: 'SlateForOnePlus-Regular',
  },
  loginbutton: {
    marginTop: 20,
    padding: 5,
    backgroundColor: turquoise,
    height: 48,
  },
  passContainer: {
    margin: 10,
    paddingVertical: 15,
    alignItems: 'center',
  },
  passText: {
    color: '#FFF',
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'SlateForOnePlus-Regular',
  },
  imgStyle: {
    alignSelf: 'center',
    height: 130,
    width: 270,
    marginBottom: 20,
    opacity: 0.7,
    resizeMode: 'contain',
  },
  background: {
    flex: 1,
    backgroundColor: '#002433',
  },
  backgroundImage: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    resizeMode: 'stretch',
  },
  header: {
    backgroundColor: 'transparent',
  },
  inputContainer: {
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 8,
    marginBottom: 8,
    backgroundColor: '#FFF',
  },
});
