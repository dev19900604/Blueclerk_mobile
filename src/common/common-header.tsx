import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  Platform,
} from 'react-native';

import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import { Icon } from 'native-base';
import { Appbar } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { DrawerActions } from '@react-navigation/compat';

import { setIsAdmin } from '../redux/user-redux';
import device from '../helpers/device';

const SCREEN_HEIGHT = Dimensions.get('window').height;

type Props = {
  title: string;
  leftIcon: string;
  rightIcon: null | string;
  _openMenu: () => void;
  _goBack: () => void;
  logout: () => void;
  onContext: () => void;
  reset: () => void;
  showReset: boolean;
  otherIcon: string;
  onTime: () => void;
  elevation: string;
  showFilterDlg: () => void;
};

export function Header({
  title,
  leftIcon,
  rightIcon = null,
  _openMenu,
  _goBack,
  logout,
  onContext,
  reset,
  showReset,
  otherIcon,
  onTime,
  elevation,
  showFilterDlg
}: Props) {
  return (
    <Appbar.Header
      style={{
        backgroundColor: '#505560',
        height: SCREEN_HEIGHT * 0.08,
        elevation: elevation ? parseInt(elevation) : 4,
        marginTop: Platform.OS === 'android' ? 10 : 0,
        marginBottom: Platform.OS === 'android' ? 10 : 0,
      }}
    >
      {leftIcon == 'menu' ? (
        <Appbar.Action icon="menu" onPress={_openMenu} color="white" />
      ) : (
        <Appbar.BackAction onPress={_goBack} color="white" />
      )}
      <Appbar.Content titleStyle={styles.headerTitle} title={title} />
      {otherIcon == 'schedule' ? renderTimeItems(onTime) : null}
      {rightIcon == null && <View style={styles.emptyAction} />}
      {rightIcon == 'context' ? renderMenuItems(onContext) : null}
      {rightIcon == 'exit-to-app' && (
        <Appbar.Action icon="exit-to-app" onPress={logout} />
      )}
      {rightIcon == 'ios-return-left' && showReset && (
        <TouchableOpacity style={styles.ClearWrapper} onPress={reset}>
          <Text style={styles.clearTxt}>CLEAR</Text>
        </TouchableOpacity>
      )}
      {rightIcon == 'ios-return-left' && !showReset && (
        <View style={styles.emptyAction} />
      )}
      {rightIcon == 'Cancel' && !showReset && (
        <TouchableOpacity style={styles.ClearWrapper} onPress={_goBack}>
          <Text style={styles.clearTxt}>Cancel</Text>
        </TouchableOpacity>
      )}
      {rightIcon == 'filter' && !showReset && (
        <TouchableOpacity style={styles.ClearWrapper} onPress={showFilterDlg}>
          <Icon name="md-funnel" style={styles.contextIcon} />
        </TouchableOpacity>
      )}
    </Appbar.Header>
  );
}

export function CommonHeader({ navigation }: any) {
  const user = useSelector((state) => state.UserReducer);
  const dispatch = useDispatch();

  let role = null;

  if (user.profile && user.profile.permissions) {
    role = user.profile.permissions.role;
  }

  return (
    <Appbar.Header
      style={{
        backgroundColor: '#505560',
        height: SCREEN_HEIGHT * 0.1,
        marginTop: Platform.OS === 'android' ? 10 : 0,
        marginBottom: Platform.OS === 'android' ? 10 : 0,
      }}
    >
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: 10,
          paddingLeft: 20,
        }}
      >
        <Image
          source={require('../../assets/icons/blue_logo.png')}
          style={{
            width: 150,
            resizeMode: 'contain',
            tintColor: role == 3 ? '#ffff' : null,
          }}
        />
        {role == 3 && (
          <TouchableOpacity
            style={{ marginRight: 10 }}
            onPress={() => {
              dispatch(setIsAdmin(true));
              navigation.dispatch(DrawerActions.toggleDrawer());
            }}
          >
            <Image source={require('../../assets/icons/admin_menu.png')} />
          </TouchableOpacity>
        )}
      </View>
    </Appbar.Header>
  );
}

function renderTimeItems(onTime: any) {
  return (
    <Menu onSelect={(value) => onTime(value)}>
      <MenuTrigger style={styles.menuTrigger}>
        <Icon name="ios-time" style={styles.contextIcon} />
      </MenuTrigger>
      <MenuOptions>
        <MenuOption value={0}>
          <Text style={[styles.statusText]}>UPCOMING</Text>
        </MenuOption>
        <MenuOption value={1}>
          <Text style={[styles.statusText]}>RECENTLY SCHEDULED</Text>
        </MenuOption>
      </MenuOptions>
    </Menu>
  );
}

function renderMenuItems(onContext: any) {
  return (
    <Menu onSelect={(value) => onContext(value)}>
      <MenuTrigger style={styles.menuTrigger}>
        <Icon name="md-funnel" style={styles.contextIcon} />
      </MenuTrigger>
      <MenuOptions>
        <MenuOption value={0}>
          <Text style={[styles.statusText, styles.pending]}>NOT STARTED</Text>
        </MenuOption>
        <MenuOption value={1}>
          <Text style={[styles.statusText, styles.started]}>STARTED</Text>
        </MenuOption>
        <MenuOption value={2}>
          <Text style={[styles.statusText, styles.finished]}>COMPLETED</Text>
        </MenuOption>
        <MenuOption value={null}>
          <Text style={[styles.statusText, styles.clear]}>CLEAR FILTER</Text>
        </MenuOption>
      </MenuOptions>
    </Menu>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 20,
    textAlign: 'center',
    color: 'white',
    fontWeight: '600',
  },
  emptyAction: {
    width: 58,
  },
  menuTrigger: {
    marginHorizontal: 10,
  },
  statusText: {
    color: 'gray',
    fontSize: 13,
    marginLeft: 5,
    paddingVertical: 3,
    fontFamily: 'SlateForOnePlus-Regular',
    textTransform: 'uppercase',
  },
  contextIcon: {
    color: 'white',
    fontSize: 24,
  },
  finished: {
    color: 'green',
  },
  started: {
    color: '#00bfff',
  },
  pending: {
    color: 'red',
  },
  clear: {
    color: 'gray',
  },
  ClearWrapper: {
    marginRight: 10,
  },
  clearTxt: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'SlateForOnePlus-Regular',
  },
});
export default Header;
