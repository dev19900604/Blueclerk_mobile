import React, { FC, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Row } from '../styles/shared-styles';
import ActionButton from '../common/action-button.component';

export type SocialLoginsProps = {
  login?: boolean;
  onFailed?: (message: string) => void;
};

const SocialLogins: FC<SocialLoginsProps> = (props: SocialLoginsProps) => {
  const navigation = useNavigation();
  const navigateToApp = useCallback(async () => {
    navigation.navigate('App');
  }, []);

  return (
    <View style={styles.socialButtonsContainer}>
      <ActionButton
        onPress={() => console.warn('heeloo')}
        icon={<Icon name="google" size={25} color="#FFF" style={{ marginRight: 10 }} />}
        style={styles.socialButton}
      >
        GOOGLE
      </ActionButton>

      <View style={{ width: 10 }} />

      <ActionButton
        style={styles.socialButton}
        onPress={() => console.warn('heeloo')}
        icon={<Icon name="facebook" size={25} color="#FFF" style={{ marginRight: 10 }} />}
      >
        FACEBOOK
      </ActionButton>
    </View>
  );
};

export default SocialLogins;

const styles = StyleSheet.create({
  socialButtonsContainer: {
    ...Row,
    marginTop: 10,
  },
  socialButton: {
    flex: 1,
  },
});
