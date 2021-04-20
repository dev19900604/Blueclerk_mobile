import React, { useState } from 'react';
import {
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  ImageBackground,
  View,
} from 'react-native';

import { Snackbar } from 'react-native-paper';

import { StackScreenProps } from '@react-navigation/stack';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import TextField from '../common/text-field';
import { turquoise, white } from '../styles/colors';
import ActionButton from '../common/action-button.component';
import SocialLogins from './social-logins.component';

type AuthStackParamList = {
  Login: undefined;
  CreateAccount: {
    first_name: string;
    last_name: string;
    email_address: string;
    password: string;
    socialId?: string;
    connectorType?: string;
  };
};

type Props = StackScreenProps<AuthStackParamList, 'CreateAccount'>;

export default function Signup({ navigation }: Props) {
  const [message, setmessage] = useState('');
  const [visible, setvisible] = useState(false);
  const [email_address, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [conf_pass, setConfPass] = useState('');

  const navigate = () => {
    navigation.navigate('Login');
  };

  const handleSignup = () => {
    if (validateLogin()) {
      setmessage('Please fill all fields');
      setvisible(true);
      return;
    }

    navigation.push('CreateAccount', {
      first_name,
      last_name,
      email_address,
      password,
    });
  };

  const validateLogin = () => {
    const email_addresss = checkField(email_address);
    const pass = checkField(password);
    const fname = checkField(first_name);
    const lname = checkField(last_name);

    if (email_addresss || pass || fname || lname) {
      return true;
    }
    return false;
  };

  const checkField = (field: any) => {
    if (field == '' || field == undefined || field == null) {
      return true;
    }
    return false;
  };

  return (
    <ImageBackground
      style={styles.container}
      source={require('../../assets/images/login_bg.png')}
      resizeMode="stretch"
    >
      <KeyboardAwareScrollView
        contentContainerStyle={{ padding: 12 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
      >
        <View onStartShouldSetResponder={() => Keyboard.dismiss()}>
          <Image
            style={styles.imgStyle}
            source={require('../../assets/icons/BLUECLERK_white.png')}
          />
          {/* <View style={{ marginBottom: 15 }}>
            <SocialLogins
              onFailed={(text) => {
                setmessage(text);
                setvisible(true);
              }}
            />
          </View> */}
          <TextField
            style={styles.input}
            placeholder="First name"
            title="FIRST NAME"
            keyboardType="default"
            autoCapitalize="words"
            value={first_name}
            onChangeText={(firstName) => setFirstName(firstName)}
          />
          <TextField
            style={styles.input}
            placeholder="Last name"
            title="LAST NAME"
            keyboardType="default"
            autoCapitalize="words"
            value={last_name}
            onChangeText={(lastName) => setLastName(lastName)}
          />

          <TextField
            style={styles.input}
            placeholder="Email"
            title="EMAIL"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email_address}
            onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
          />

          <TextField
            style={styles.input}
            placeholder="Password"
            title="PASSWORD"
            secureTextEntry
            value={password}
            onChangeText={(pass) => setPassword(pass)}
          />

          <TextField
            style={styles.input}
            placeholder="Confirm Password"
            title="CONFIRM PASSWORD"
            secureTextEntry
            value={conf_pass}
            onChangeText={(confirmPass) => setConfPass(confirmPass)}
          />
          <ActionButton
            style={[styles.loginbutton, { marginTop: 20 }]}
            onPress={handleSignup}
          >
            SIGN UP
          </ActionButton>

          <Snackbar duration={4000} visible={visible} onDismiss={() => setvisible(false)}>
            {message}
          </Snackbar>

          <TouchableOpacity onPress={() => navigate()}>
            <Text style={styles.signText}>Already have account? Sign In</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    marginTop: 5,
  },
  loginbutton: {
    backgroundColor: turquoise,
    textAlign: 'center',
  },
  imgStyle: {
    alignSelf: 'center',
    height: 150,
    width: 150,
    resizeMode: 'contain',
  },
  signText: {
    padding: 5,
    marginTop: 15,
    fontSize: 15,
    alignSelf: 'center',
    color: white,
  },
  termsText: {
    fontSize: 12,
    color: '#1fb2e2',
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    textDecorationColor: '#1fb2e2',
  },
  termsView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
});
