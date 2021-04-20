import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Keyboard,
  Alert,
} from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { Icon } from 'native-base';
import ActionSheetCustom from 'react-native-actionsheet';
import AsyncStorage from '@react-native-community/async-storage';
import { StackNavigationOptions } from '@react-navigation/stack';
import { DrawerActions } from '@react-navigation/compat';
import { Header } from '../../common/common-header';
import { logEvent } from '../../helpers';
import styles from './styles';
import { Service } from '../../config/services';

export default function Equipment({ navigation }: any) {
  const options: StackNavigationOptions = {
    headerLeft: ({ tintColor }: any) => (
      <Icon name="ios-construct" style={{ fontSize: 24, color: tintColor }} />
    ),
  };

  const [search, setSearch] = useState('');
  const [equipment, setEquipment] = useState('');
  const [equipments, setEquipments] = useState([]);
  const ActionSheet = useRef();

  const updateSearch = (event: any = {}) => {
    const value = event;
    setSearch(value.substr(0, 20));
    setEquipment(value.substr(0, 20));
  };

  const _openMenu = () => {
    Keyboard.dismiss();
    navigation.dispatch(DrawerActions.toggleDrawer());
  };

  const showActionSheet = () => {
    ActionSheet.current.show();
  };

  useEffect(() => {
    logEvent('equipment-screen');
    _getEquipments();
  }, []);

  const _getEquipments = async () => {
    try {
      const response = await Service.getCompanyEquipment();
      const { status, companyEquipments } = response.data;
      if (status == 1) {
        setEquipments(companyEquipments);
      } else {
        Alert.alert('Error', 'Something has gone wrong');
      }
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const chooseOption = (index) => {
    if (index == 0) {
      navigation.navigate('ScanTagScreen');
    }
  };

  const retrieveData = async (name: string) => {
    const value = await AsyncStorage.getItem(name);
    if (value !== null) {
      return JSON.parse(value);
    }
  };

  return (
    <View>
      <Header title="Company Equipment" leftIcon="menu" _openMenu={() => _openMenu()} />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
        }}
      />
      <View style={styles.btcContainer}>
        <Button
          style={styles.actbtn}
          mode="contained"
          fontSize="10"
          onPress={showActionSheet}
        >
          Add New
        </Button>
      </View>
      <View>
        <ActionSheetCustom
          ref={ActionSheet}
          title="What To Scan"
          tintColor="#00bfff"
          options={['Scan Tag', 'Scan QR Code', 'Cancel']}
          cancelButtonIndex={2}
          onPress={(index) => chooseOption(index)}
        />
      </View>
      <TextInput
        type="text"
        name="location"
        label="Search Equipment"
        mode="outlined"
        dense
        style={styles.search}
        value={search}
        onChangeText={(event) => updateSearch(event)}
      />
      <ScrollView style={styles.listView} keyboardShouldPersistTaps="always">
        {equipments.map((equipment) => (
          <TouchableOpacity
            keyboardShouldPersistTaps="always"
            equipment={equipment}
            key={equipment._id}
            style={styles.card}
          >
            <Text style={styles.title}>{equipment.info.model}</Text>
            <Text style={styles.members}>{equipment.info.serialNumber}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
