import React, { useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Icon } from 'react-native-elements';
import { Header } from 'native-base';
import { DrawerActions } from '@react-navigation/compat';
import { StackNavigationOptions, StackScreenProps } from '@react-navigation/stack';
import Footer from '../../common/footer';
import { Images } from '../../../assets';
import colors, { background, white } from '../../styles/colors';
import ActionButton from '../../common/action-button.component';

type JobStackParamList = {
  jobs: undefined;
  ScanTagScreen: undefined;
  EquipmentDetail:
    | {
        nfcTag: string | undefined;
      }
    | undefined;
  WorkOrderPage: undefined;
  CreatePurchaseOrder: undefined;
  ViewPurchaseOrder: undefined;
  AddCustomer: undefined;
  CreateServiceTicket: undefined;
  GenerateJobFromTicket: undefined;
  ServiceTicktets: undefined;
  GuideScreen: undefined;
  AllJobs: undefined;
  Options:
    | {
        nfcTag: string | undefined;
      }
    | undefined;
  AddEquipment:
    | {
        nfcTag: string | undefined;
      }
    | undefined;
  AddLocation:
    | {
        nfcTag: string | undefined;
      }
    | undefined;
  Report:
    | {
        job: object | string | undefined;
        from: boolean | undefined;
      }
    | undefined;
};
type Props = StackScreenProps<JobStackParamList, 'Options'>;

export default function SelectOption({ route, navigation }: Props) {
  const options: StackNavigationOptions = {
    headerRight: () => (
      <TouchableOpacity onPress={() => navigation.pop()} style={styles.button}>
        <Text style={styles.title}>Cancel</Text>
      </TouchableOpacity>
    ),

    headerBackTitle: ' ',
    headerLeft: () => (
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.button}>
        <Icon type="antdesign" name="left" color={white} size={20} />
      </TouchableOpacity>
    ),
    headerStyle: { height: 0 },
  };

  const [active, setActive] = useState('');
  const navigate = () => {
    navigation.navigate(active == 'location' ? 'AddLocation' : 'AddEquipment', {
      nfcTag: route.params?.nfcTag,
    });
  };

  return (
    <>
      <Header
        androidStatusBarColor={background}
        style={{
          backgroundColor: background,
          height: Dimensions.get('window').height * 0.1,
          paddingTop: 10,
        }}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.button}>
            <Icon type="antdesign" name="left" color={white} size={20} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.button}>
            <Text style={styles.title}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Header>
      <View style={styles.container}>
        <TouchableOpacity activeOpacity={0.7} onPress={() => setActive('location')}>
          <LinearGradient
            colors={
              active == 'location' ? ['#41B2EF', '#4187EF'] : ['#FFFFFF', '#FFFFFF']
            }
            useAngle
            angle={180}
            style={[styles.buttonStyle, active == '' && { borderWidth: 1 }]}
          >
            <Text
              style={[
                styles.buttonTextStyle,
                active != 'location' && { color: colors.btnBackground },
              ]}
            >
              Add Location
            </Text>
            <Image
              source={Images.location_pin}
              style={[
                styles.iconStyle,
                active != 'location' && { tintColor: colors.btnBackground },
              ]}
            />
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.7} onPress={() => setActive('equipment')}>
          <LinearGradient
            colors={
              active == 'equipment' ? ['#41B2EF', '#4187EF'] : ['#FFFFFF', '#FFFFFF']
            }
            useAngle
            angle={180}
            style={[styles.buttonStyle, active == '' && { borderWidth: 1 }]}
          >
            <Text
              style={[
                styles.buttonTextStyle,
                active != 'equipment' && { color: colors.btnBackground },
              ]}
            >
              Add Equipment
            </Text>
            <Image
              source={Images.setting_icon}
              style={[
                styles.iconStyle,
                active != 'equipment' && { tintColor: colors.btnBackground },
              ]}
            />
          </LinearGradient>
        </TouchableOpacity>
      </View>
      <ActionButton
        disabled={active == ''}
        style={styles.buttonContinue}
        onPress={navigate}
      >
        Continue
      </ActionButton>
      <Footer
        onOpen={() => {
          navigation.dispatch(DrawerActions.openDrawer());
        }}
      />
    </>
  );
}

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    marginTop: height * 0.04,
  },
  title: {
    color: white,
  },
  buttonStyle: {
    width: width * 0.5,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    height: height * 0.15,
    borderColor: colors.btnBackground,
    borderRadius: 20,
  },
  buttonTextStyle: {
    fontSize: 16,
    fontWeight: '700',
    marginVertical: 10,
    color: colors.colorWhite,
    fontFamily: 'ChakraPetch-Bold',
  },
  iconStyle: {
    resizeMode: 'stretch',
    tintColor: colors.colorWhite,
  },
  buttonContinue: {
    marginVertical: 15,
    marginHorizontal: 5,
  },
});
