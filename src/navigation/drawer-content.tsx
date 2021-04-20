import React, { useState } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Text,
  Alert,
  Dimensions,
} from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch } from 'react-redux';
import { LoginManager } from 'react-native-fbsdk';
import { GoogleSignin } from '@react-native-community/google-signin';
import { Button } from 'react-native-paper';
import { logout, setIsAdmin } from '../redux/user-redux';
import styles from './styles';
import store from '../redux/store';
import { white } from '../styles/colors';
import { ScrollView } from 'react-native-gesture-handler';

function TagScanButton(props: any) {
  const { onPressed } = props;

  return (
    <TouchableOpacity style={styles.tagScanButton} onPress={onPressed}>
      <LinearGradient
        style={styles.tagScanButtonBackground}
        colors={['#41A6EF', '#4099EE', '#418CEF']}
        useAngle
        angle={180}
        locations={[0, 0.5, 1]}
      >
        <Image
          source={require('../../assets/icons/menu_logo.png')}
          style={{
            height: 35,
            width: 50,
            resizeMode: 'contain',
          }}
        />
        <Text style={{ color: '#FFF', fontSize: 17, fontWeight: 'bold' }}>SCAN TAG</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

function MenuItem(props: any) {
  const { text, path, routeName } = props;

  return (
    <TouchableOpacity
      style={styles.menuItemContainer}
      onPress={() => {
        props.navigation.navigate(routeName);
        props.navigation.dispatch(DrawerActions.closeDrawer());
      }}
    >
      <Image
        source={path}
        style={{
          width: 30,
          height: 30,
          resizeMode: 'contain',
          marginRight: 20,
        }}
      />
      <Text style={{ color: '#FFF', fontSize: 22, fontWeight: 'bold' }}>{text}</Text>
    </TouchableOpacity>
  );
}

function DrawerContent(props: DrawerContentComponentProps) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [menuItems, setMenuItem] = useState([
    {
      text: 'Settings',
      path: require('../../assets/icons/icon_settings.png'),
      route: 'Settings',
    },
    {
      text: 'History',
      path: require('../../assets/icons/icon_history.png'),
      route: 'History',
    },
    {
      text: 'My Group',
      path: require('../../assets/icons/icon_my_group.png'),
      route: 'MyGroup',
    },
    {
      text: 'My Equipment',
      path: require('../../assets/icons/icon_my_equipment.png'),
      route: 'Equipment',
    },
    {
      text: 'My Schedule',
      path: require('../../assets/icons/icon_my_schedule.png'),
      route: 'Schedule',
    },
    { text: 'Home', path: require('../../assets/icons/icon_home.png'), route: 'Jobs' },
  ]);
  const [adminMenu, setAdminMenu] = useState([
    {
      text: 'Add Customer',
      path: require('../../assets/icons/person_outline.png'),
      route: 'AddCustomer',
    },
    {
      text: 'Create Service Ticket',
      path: require('../../assets/icons/calender_icon.png'),
      route: 'CreateServiceTicket',
    },
    {
      text: 'Generate Job',
      path: require('../../assets/icons/generate_job.png'),
      route: 'GenerateJob',
    },
  ]);
  const { isAdmin } = store.getState().UserReducer;

  const renderView = () => {
    if (isAdmin) {
      return (
        <View
          style={{
            width: '100%',
            padding: 10,
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <View style={[styles.tagContainer, { marginTop: 0 }]}>
            <Image
              source={require('../../assets/icons/blue_logo.png')}
              style={[styles.logo, { tintColor: white }]}
            />
            <TouchableOpacity
              onPress={() => {
                navigation.dispatch(DrawerActions.closeDrawer());
              }}
            >
              <Icon name="clear" size={35} color="#FFF" />
            </TouchableOpacity>
          </View>
          <View style={[styles.contentContainer, { width: '100%' }]}>
            {adminMenu.map((f) => (
              <MenuItem
                text={f.text}
                path={f.path}
                routeName={f.route}
                navigation={navigation}
              />
            ))}
          </View>
        </View>
      );
    }
    return (
      <>
        <View style={styles.tagContainer}>
          <TouchableOpacity
            onPress={() => {
              navigation.dispatch(DrawerActions.closeDrawer());
            }}
          >
            <Icon name="clear" size={35} color="#FFF" />
          </TouchableOpacity>
        </View>
        <View style={[styles.topContainer]}>
          <Image
            source={require('../../assets/icons/blue_logo.png')}
            style={styles.logo}
          />
          <Button
            mode="contained"
            style={styles.logoutButton}
            labelStyle={{
              color: '#FFF',
              fontSize: 13,
              fontFamily: 'SlateForOnePlus-Regular',
              fontWeight: 'bold',
            }}
            onPress={() => {
              Alert.alert('Logout', 'Are you sure you want to logout?', [
                {
                  text: 'Cancel',
                  onPress: () => { },
                  style: 'cancel',
                },
                {
                  text: 'Logout',
                  onPress: async () => {
                    dispatch(logout());
                    GoogleSignin.signOut();
                    LoginManager.logOut();
                    navigation.navigate('Auth');
                  },
                  style: 'destructive',
                },
              ]);
            }}
          >
            LOG OUT
          </Button>
        </View>
        <View
          style={[
            styles.contentContainer,
            {
              marginTop: isAdmin
                ? Dimensions.get('window').height * 0.1
                : Dimensions.get('window').height * 0.03,
            },
          ]}
        >
          <ScrollView style={{ width: '100%' }}>
            {menuItems.map((f) => (
              <MenuItem
                text={f.text}
                path={f.path}
                routeName={f.route}
                navigation={navigation}
              />
            ))}
          </ScrollView>
        </View>
      </>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="transparent" translucent />
      <SafeAreaView style={styles.wrapper}>{renderView()}</SafeAreaView>
      {isAdmin && (
        <View style={[styles.tagContainer, { padding: 20 }]}>
          <TagScanButton
            onPressed={() => {
              navigation.navigate('ScanTagScreen');
            }}
          />
          <TouchableOpacity
            onPress={() => {
              dispatch(setIsAdmin(false));
            }}
          >
            <Icon name="menu" size={50} color="#FFF" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

export default DrawerContent;
