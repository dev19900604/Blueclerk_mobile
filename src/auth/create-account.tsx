import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  Platform,
  TouchableOpacity,
  View,
  ImageBackground,
  Image,
  StyleSheet,
  Keyboard,
} from 'react-native';
import { Checkbox, Snackbar, Text } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AwesomeAlert from 'react-native-awesome-alerts';
import { StackScreenProps } from '@react-navigation/stack';
import Header from '../common/common-header';
import ActionButton from '../common/action-button.component';
import colors, { lightGrey, turquoise, white } from '../styles/colors';
import TextField from '../common/text-field';
import Select from '../common/select.component';
import Loader from '../common/loader';
import { login } from '../redux/user-redux';

import { Service } from '../config/services';

const itemSkus = Platform.select({
  ios: ['appsignupapplesummer2020'],
  android: ['appsignupapplesummer2020'],
});

type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  CreateAccount: {
    first_name: string;
    last_name: string;
    email_address: string;
    password: string;
    socialId?: string;
    connectorType?: string;
  };
  App: undefined;
  ToS: undefined;
};

type Props = StackScreenProps<AuthStackParamList, 'CreateAccount'>;

export default ({ route, navigation }: Props) => {
  const { first_name } = route?.params;
  const { last_name } = route?.params;
  const { email_address } = route?.params;
  const { socialId } = route?.params;
  const connectorType = socialId ? route.params?.connectorType : null;
  const password = socialId ? null : route?.params?.password;
  const [snackbar, setshowSnackbar] = useState({ show: false, message: '', back: false });
  const [checked, setchecked] = useState(false);
  const [phone_number, setphone_number] = useState('');
  const [companyName, setcompanyName] = useState('');
  const [industryIds, setindustryIds] = useState<any>([]);
  const [industryIndex, setindustryIndex] = useState(null);
  const [isLoading, setisLoading] = useState(false);
  const dispatch = useDispatch();
  const [showSuccess, setshowSuccess] = useState(false);

  useEffect(() => {
    Service.getIndustries(setindustryIds, () => setshowSnackbar({
      show: true,
      message: 'Error while getting industries, please try again later.',
      back: true,
    }));
  }, []);

  const callSignUpAPI = () => {
    setisLoading(true);

    const param = socialId
      ? {
        email: email_address,
        firstName: first_name,
        lastName: last_name,
        phone: phone_number,
        companyName,
        industryId: industryIds[industryIndex]._id,
        connectorType,
        socialId,
      }
      : {
        email: email_address,
        password,
        firstName: first_name,
        lastName: last_name,
        phone: phone_number,
        companyName,
        industryId: industryIds[industryIndex]._id,
      };

    Service.SignUp(
      param,
      setisLoading,
      setshowSuccess,
      (profile: any, token: any) => dispatch(login(profile, token)),
      setshowSnackbar,
    );
  };

  const handleSignup = () => {
    Keyboard.dismiss();

    if (checked == false) {
      setshowSnackbar({
        show: true,
        message: 'You must agree our Terms of Service.',
        back: false,
      });
      return;
    }

    if (phone_number && companyName && industryIndex >= 0) {
      callSignUpAPI();

      return;
    }
    setshowSnackbar({ show: true, message: 'Please fill all fields', back: false });
  };

  const handleTerms = () => {
    navigation.navigate('ToS');
  };

  return (
    <ImageBackground
      onStartShouldSetResponder={() => Keyboard.dismiss()}
      style={{ flex: 1, justifyContent: 'center' }}
      source={require('../../assets/images/login_bg.png')}
      resizeMode="stretch"
    >
      <Header leftIcon="goback" _goBack={() => navigation.goBack()} />
      <Loader loading={isLoading} />

      <Image
        style={{
          alignSelf: 'center',
          height: 150,
          width: 150,
          resizeMode: 'contain',
        }}
        source={require('../../assets/icons/BLUECLERK_white.png')}
      />
      <KeyboardAwareScrollView
        contentContainerStyle={{ padding: 12 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
      >
        <TextField
          style={styles.input}
          placeholder="Phone"
          title="PHONE"
          keyboardType="numeric"
          value={phone_number}
          onChangeText={(text) => setphone_number(text)}
        />
        <TextField
          style={styles.input}
          placeholder="Company Name"
          title="COMPANY NAME"
          keyboardType="default"
          autoCapitalize="words"
          value={companyName}
          onChangeText={(text) => setcompanyName(text)}
        />
        <Select
          title="INDUSTRY"
          placeholder="Industry"
          style={{ backgroundColor: lightGrey, marginTop: 5 }}
          containerStyle={{ alignSelf: 'stretch' }}
          options={industryIds.map((t) => t.title)}
          onSelect={(index) => {
            setindustryIndex(index);
          }}
          value={industryIndex == null ? '' : industryIds[industryIndex].title}
        />
        <View style={styles.termsView}>
          <Checkbox.Android
            uncheckedColor={white}
            color="#1fb2e2"
            status={checked ? 'checked' : 'unchecked'}
            onPress={() => {
              setchecked(!checked);
            }}
          />
          <TouchableOpacity onPress={() => handleTerms()}>
            <Text style={styles.termsText}>
              I read & agree to the BlueClerk's Terms of Service
            </Text>
          </TouchableOpacity>
        </View>
        <ActionButton style={styles.actionButton} onPress={handleSignup}>
          Create Account
        </ActionButton>
      </KeyboardAwareScrollView>
      <Snackbar
        duration={2000}
        visible={snackbar.show}
        onDismiss={() => {
          if (snackbar.back) {
            navigation.goBack();
          }
          setshowSnackbar({ ...snackbar, show: false });
        }}
      >
        {snackbar.message}
      </Snackbar>
      <AwesomeAlert
        show={showSuccess}
        title="Success"
        message="Account created successfully."
        showConfirmButton
        onConfirmPressed={() => {
          setshowSuccess(false);
          navigation.navigate('App');
        }}
        confirmText="Ok"
        confirmButtonColor={colors.assertColor}
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  input: {
    marginTop: 5,
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
  actionButton: {
    backgroundColor: turquoise,
    textAlign: 'center',
    marginTop: 20,
  },
});
