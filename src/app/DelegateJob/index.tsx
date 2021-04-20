import React, { useState, useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import { Dropdown } from 'react-native-material-dropdown-v2';
import { Button } from 'react-native-paper';
import { StackScreenProps } from '@react-navigation/stack';
import { Header } from '../../common/common-header';
import styles from './styles';
import { Service } from '../../config/services';
import Loader from '../../common/loader';
import colors from '../../styles/colors';
import store from '../../redux/store';

const { getTechnicians, assignJob } = Service;

type MainNavigatorParamsList = {
  Dashboard: {
    screen: 'Jobs';
  };
  DelegateJob:
    | {
        item: object;
      }
    | undefined;
  ScanGuide: undefined;
};

type Props = StackScreenProps<MainNavigatorParamsList, 'DelegateJob'>;

export default function DelegateJob({ route, navigation }: Props) {
  const [isDatePickerVisible, setisDatePickerVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const [Technicians, setTechnicians] = useState([]);
  const [tech, setTech] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [jobId, setJobId] = useState('');
  const customer = store.getState().UserReducer.profile;

  const _getTechnicians = async () => {
    const response = await getTechnicians();

    const drop_down_data = [];
    for (let i = 0; i < response.data.users.length; i++) {
      if (
        response.data.users[i].profile.displayName != customer.displayName &&
        response.data.users[i].profile.firstName != customer.firstName &&
        response.data.users[i].profile.lastName != customer.lastName
      ) {
        drop_down_data.push({
          value: response.data.users[i].profile.displayName,
          id: response.data.users[i]._id,
        });
      }
    }
    setTechnicians(drop_down_data);
    setTech(drop_down_data[0].value);
  };

  useEffect(() => {
    setJobId(route.params?.item._id);
    setDate(route.params?.item.scheduleDate);
    _getTechnicians();
  }, []);

  const navigateBack = () => {
    navigation.goBack();
  };

  const _handleConfirm = (date: any) => {
    setDate(date);
    setisDatePickerVisible(false);
  };

  const _handleCancel = () => {
    setisDatePickerVisible(false);
  };

  const _openDatePicker = () => {
    setisDatePickerVisible(true);
  };

  const _assignJob = async () => {
    setIsLoading(true);

    const params = {
      jobId,
      technicianId: Technicians[getIndex(Technicians, tech)].id,
      scheduleDate: date,
    };

    try {
      const response = await assignJob(params);
      if (response.data.status == '1') {
        setIsLoading(false);
        setTimeout(() => {
          Alert.alert('Success', 'Job assigned successfully', [
            {
              text: 'Ok',
              onPress: () => {
                navigation.navigate('Dashboard', { screen: 'Jobs' });
              },
            },
          ]);
        }, 500);
      } else {
        setIsLoading(false);
        setTimeout(() => {
          Alert.alert('Success', 'Something has went wrong', [
            {
              text: 'Ok',
              onPress: () => {
                navigation.navigate('Dashboard', { screen: 'Jobs' });
              },
            },
          ]);
        }, 500);
      }
    } catch (err) {
      setIsLoading(false);
      setTimeout(() => {
        Alert.alert('Success', 'Something has went wrong', [
          {
            text: 'Ok',
            onPress: () => {
              navigation.navigate('Dashboard', { screen: 'Jobs' });
            },
          },
        ]);
      }, 500);
    }
  };

  const getIndex = (arr: any, term: any) => {
    const index = arr.findIndex((item) => item.value == term);
    return index;
  };
  return (
    <View style={styles.container}>
      <Header title="Transfer Job" _goBack={() => navigateBack()} />
      <View style={styles.content}>
        <Loader loading={isLoading} />
        <Text style={styles.selectTechTxt}>Select new Technician for your job</Text>
        <Dropdown
          dropdownOffset={{ top: 5 }}
          containerStyle={styles.typeDropDown}
          itemTextStyle={{ fontFamily: 'SlateForOnePlus-Regular', fontSize: 12 }}
          rippleCentered
          inputContainerStyle={{ borderBottomColor: 'transparent' }}
          data={Technicians}
          value={tech}
          onChangeText={(tech) => {
            setTech(tech);
          }}
        />
        <View style={styles.dropdown} />
        <View style={styles.actions}>
          <Button
            mode="outlined"
            color={colors.assertColor}
            onPress={() => navigateBack()}
          >
            Cancel
          </Button>
          <Button
            mode="contained"
            style={{ backgroundColor: colors.assertColor }}
            onPress={() => _assignJob()}
          >
            Assign Job
          </Button>
        </View>
      </View>
    </View>
  );
}
