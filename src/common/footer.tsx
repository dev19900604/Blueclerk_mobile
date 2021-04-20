import React, { useEffect, useState } from 'react';
import {
  Platform,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleProp,
  ViewStyle,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { setIsAdmin } from '../redux/user-redux';
import Device from '../helpers/device';

const BAR_HEIGHT_ANDROID = 82;
const BAR_HEIGHT_IOS = 75;

function TagScanButton() {
  const navigation = useNavigation();
  const skipGuide = useSelector((state) => state.UserReducer.skipGuide);

  return (
    <TouchableOpacity
      style={styles.tagScanButton}
      onPress={async () => {
        if (skipGuide) {
          navigation.navigate('ScanTagScreen');
        } else {
          navigation.navigate('GuideScreen');
        }
      }}
    >
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

type Props = {
  onOpen: () => void;
  style?: StyleProp<ViewStyle>;
};

export default (props: Props) => {
  const [isLandscape, setisLandscape] = useState(Device.isLandscape());
  const dispatch = useDispatch();

  const handleDimensionChange = () => {
    if (Device.isLandscape() && !isLandscape) {
      setisLandscape(true);
    } else if (Device.isPortrait() && isLandscape) {
      setisLandscape(false);
    }
  };

  const extraStyle = [
    isLandscape ? orientationStyle.portrait : orientationStyle.landscape,
  ];

  useEffect(() => {
    Dimensions.addEventListener('change', handleDimensionChange);

    return Dimensions.removeEventListener('change', handleDimensionChange);
  }, []);

  return (
    <View style={[styles.bar, ...extraStyle, props.style]}>
      <View style={styles.wrapper}>
        <TagScanButton />
        <TouchableOpacity
          onPress={() => {
            dispatch(setIsAdmin(false));
            props.onOpen();
          }}
        >
          <Image
            source={require('../../assets/icons/icon_menu.png')}
            style={{
              width: 30,
              height: 30,
              resizeMode: 'contain',
            }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const orientationStyle = StyleSheet.create({
  landscape: {
    ...Device.select({
      iPhoneX: {
        height: BAR_HEIGHT_IOS + Device.IPHONE_X_BOTTOM_LANDSCAPE,
        paddingBottom: Device.IPHONE_X_BOTTOM_LANDSCAPE,
      },
      androidSoftKeys: undefined,
    }),
  },
  portrait: {
    ...Device.select({
      iPhoneX: {
        height: BAR_HEIGHT_IOS + Device.IPHONE_X_BOTTOM_PORTRAIT,
        paddingBottom: Device.IPHONE_X_BOTTOM_PORTRAIT,
      },
      androidSoftKeys: undefined,
    }),
  },
});

const styles = StyleSheet.create({
  bar: {
    backgroundColor: '#505560',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 15,
    justifyContent: 'flex-start',
    ...Platform.select({
      ios: {
        height: BAR_HEIGHT_IOS,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        height: BAR_HEIGHT_ANDROID,
        elevation: 8,
      },
    }),
  },
  tagScanButtonBackground: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagScanButton: {
    width: Dimensions.get('window').width / 2 - 20,
    height: 50,
  },
  wrapper: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
