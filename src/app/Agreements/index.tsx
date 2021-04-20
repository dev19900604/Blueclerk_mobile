import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import HTML from 'react-native-render-html';
import { StackScreenProps } from '@react-navigation/stack';
import styles from './styles';
import { Header } from '../../common/common-header';
import htmlContent from './html';

type SettingStackParamList = {
  Settings: undefined;
  AgreementSettings:
    | {
        agreed: boolean;
        data: object | undefined;
      }
    | undefined
    | any;
};

type Props = StackScreenProps<SettingStackParamList, 'AgreementSettings'>;

function Agreement({ navigation }: Props) {
  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Header
        title="Terms And Conditions"
        leftIcon="goback"
        _goBack={() => handleBack()}
      />
      <SafeAreaView style={styles.container}>
        <ScrollView style={{ flex: 1 }}>
          <HTML html={htmlContent} imagesMaxWidth={Dimensions.get('window').width} />
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

export default Agreement;
