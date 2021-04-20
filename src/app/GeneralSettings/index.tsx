import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Keyboard,
  Linking,
} from 'react-native';
import { useSelector } from 'react-redux';
import { Icon } from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { DrawerActions } from '@react-navigation/compat';
import { StackNavigationOptions } from '@react-navigation/stack';
import UserAvatar from '../../common/avatar';
import { Header } from '../../common/common-header';
import styles from './styles';

function GeneralSettings() {
  const options: StackNavigationOptions = {
    headerLeft: ({ tintColor }: any) => (
      <Icon name="md-cog" style={{ fontSize: 24, color: tintColor }} />
    ),
  };

  const navigation = useNavigation();
  const user = useSelector((state) => state.UserReducer);

  const _openMenu = () => {
    Keyboard.dismiss();
    navigation.dispatch(DrawerActions.toggleDrawer());
  };

  const handleNavigation = (navCase: string) => {
    if (navCase == 'Edit') {
      navigation.navigate('UpdateProfile');
    } else if (navCase == 'changePass') {
      navigation.navigate('ResetPassword');
    } else if (navCase == 'notification') {
      navigation.navigate('ManageNotifications');
    } else if (navCase == 'help') {
      Linking.canOpenURL('https://blueclerk.com/').then((supported) => {
        if (supported) {
          Linking.openURL('https://blueclerk.com/');
        }
      });
    } else if (navCase == 'privacy') {
      navigation.navigate('AgreementSettings');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Header
        title="Settings"
        leftIcon="_goBack"
        _goBack={() => navigation.navigate('Jobs')}
      />
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.userContainer}>
            {user.profile.imageUrl ? (
              <Image source={{ uri: user.profile.imageUrl }} style={styles.avatarImg} />
            ) : (
              <UserAvatar name={user.profile.profile.displayName} />
            )}

            <Text style={styles.name}>{user.profile.profile.displayName}</Text>
            <Text style={styles.email}>{user.profile.auth.email}</Text>
          </View>
          <View>
            <TouchableOpacity
              style={styles.listItem}
              onPress={() => handleNavigation('privacy')}
            >
              <MaterialCommunityIcons
                name="shield-account"
                size={24}
                style={{ color: 'black' }}
              />
              <Text style={styles.listText}>Privacy Policy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export default GeneralSettings;
