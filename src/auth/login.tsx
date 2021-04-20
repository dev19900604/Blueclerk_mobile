import React, { useState } from 'react';
import {
  Image,
  Keyboard,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useDispatch } from 'react-redux';

import { Snackbar, Checkbox } from 'react-native-paper';
import { GoogleSignin } from '@react-native-community/google-signin';
import HTML from 'react-native-render-html';
import { StackScreenProps } from '@react-navigation/stack';
import Loader from '../common/loader';
import TextField from '../common/text-field';
import { grey, turquoise } from '../styles/colors';
import { Center, Row } from '../styles/shared-styles';
import ActionButton from '../common/action-button.component';
import SocialLogins from './social-logins.component';
import { login } from '../redux/user-redux';
import { Service } from '../config/services';
import htmlContent from '../app/Agreements/html';

GoogleSignin.configure({
  webClientId: '767956916860-h1sjf744g97qs4sccnrd6neaf7s39r2e.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
  offlineAccess: false,
});

type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  App: undefined;
  ToS: undefined;
};

type Props = StackScreenProps<AuthStackParamList, 'Login'>;

export default function Login({ navigation }: Props) {
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [message, setmessage] = useState('');
  const [showTos, setshowTos] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [visible, setvisible] = useState(false);
  const [checked, setChecked] = useState(false);
  const [terms, setTerms] = useState(false);
  const dispatch = useDispatch();

  const handleLogin = () => {
    if (validateLogin()) {
      setvisible(true);
      setmessage('Please fill all fields');
      return;
    }

    setisLoading(true);
    Service.Login(
      { email, password },
      setisLoading,
      setmessage,
      (profile, token) => dispatch(login(profile, token)),
      navigation,
      setvisible,
      () => setshowTos(!showTos)
    );
  };

  const handleAgreed = async () => {
    const response = await Service.agreedTerms({ agreedStatus: true });

    if (response.data.status == 1) {
      setshowTos(!showTos);
      handleLogin();
    }
  };

  const checkField = (field: any) => {
    if (field == '' || field == undefined || field == null) {
      return true;
    }
    return false;
  };

  const validateLogin = () => {
    const email_address = checkField(email);
    const pass = checkField(password);

    if (email_address || pass) {
      return true;
    }
    return false;
  };

  return (
    <View style={styles.background} onStartShouldSetResponder={() => Keyboard.dismiss()}>
      <Image
        style={styles.backgroundImage}
        source={require('../../assets/images/login_bg.png')}
        resizeMode="stretch"
      />
      <SafeAreaView style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flex: 1 }}
          keyboardShouldPersistTaps="always"
          scrollEnabled={false}
        >
          <View style={{ justifyContent: 'center', flex: 1 }}>
            <Image
              style={styles.imgStyle}
              source={require('../../assets/icons/BLUECLERK_white.png')}
            />
            <Loader loading={isLoading} />
            <TextField
              title="USERNAME/EMAIL"
              placeholder="User Name / Email"
              keyboardType="email-address"
              autoCapitalize="none"
              inputContainerStyle={{ borderBottomWidth: 0 }}
              value={email}
              onChangeText={(mail) => setemail(mail)}
            />
            <TextField
              title="PASSWORD"
              placeholder="Password"
              secureTextEntry
              style={{ marginTop: 8 }}
              value={password}
              inputContainerStyle={{ borderBottomWidth: 0 }}
              onChangeText={(pass) => setpassword(pass)}
            />
            <ActionButton style={styles.loginButton} onPress={() => handleLogin()}>
              LOG IN
            </ActionButton>

            {/* <SocialLogins
              login
              onFailed={(message) => {
                setmessage(message);
                setvisible(true);
              }}
            /> */}

            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPassword')}
              style={{
                marginVertical: 15,
                padding: 15,
              }}
            >
              <Text mode="text" color="#858a8c" style={styles.forgotbutton}>
                RECOVER PASSWORD
              </Text>
            </TouchableOpacity>
            <ActionButton
              style={[styles.loginButton, { marginTop: 0 }]}
              onPress={() => navigation.navigate('SignUp')}
            >
              SIGN UP
            </ActionButton>
          </View>
          <View style={{ height: 5 }} />
        </ScrollView>
      </SafeAreaView>
      <Modal animationType="slide" transparent visible={showTos}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Please agree to our terms of use and privacy
            </Text>
            <View style={styles.termsView}>
              <Checkbox.Android
                uncheckedColor={grey}
                color={grey}
                status={checked ? 'checked' : 'unchecked'}
                onPress={() => {
                  setChecked(!checked);
                }}
              />
              <TouchableOpacity
                onPress={() => {
                  setTerms(!terms);
                  setshowTos(!showTos);
                }}
              >
                <Text style={styles.termsText}>
                  I read & agree to the BlueClerk's Terms of Service
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity
                style={{
                  ...styles.openButton,
                  backgroundColor: '#008000',
                  marginEnd: 10,
                }}
                disabled={!checked}
                onPress={() => {
                  handleAgreed();
                }}
              >
                <Text style={styles.textStyle}>Okay</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ ...styles.openButton, backgroundColor: '#f05050' }}
                onPress={() => {
                  setshowTos(!showTos);
                }}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent
        visible={terms}
        onRequestClose={() => {
          setTerms(false);
        }}
      >
        <View style={[styles.centeredView, { flexGrow: 1 }]}>
          <TouchableOpacity
            style={{ ...styles.openButton, backgroundColor: '#f05050', marginTop: 10 }}
            onPress={() => {
              setTerms(!terms);
              setshowTos(!showTos);
            }}
          >
            <Text style={styles.textStyle}>Cancel</Text>
          </TouchableOpacity>
          <ScrollView contentContainerStyle={[styles.modalView, { padding: 20 }]}>
            <HTML html={htmlContent} imagesMaxWidth={width * 0.6} />
          </ScrollView>
        </View>
      </Modal>
      <Snackbar duration={4000} visible={visible} onDismiss={() => setvisible(false)}>
        {message}
      </Snackbar>
    </View>
  );
}

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    width: width * 0.9,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    marginHorizontal: 12,
  },
  loginButton: {
    marginTop: 20,
    backgroundColor: turquoise,
    height: 48,
    ...Center,
  },
  termsView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  termsText: {
    fontSize: 12,
    color: '#1fb2e2',
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    textDecorationColor: '#1fb2e2',
  },
  forgotbutton: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '300',
    color: '#FFF',
    fontFamily: 'ChakraPetch-Regular',
  },
  imgStyle: {
    alignSelf: 'center',
    width: 150,
    height: 150,
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
  socialButtonsContainer: {
    ...Row,
    marginTop: 10,
  },
  socialButton: {
    flex: 1,
  },
});
