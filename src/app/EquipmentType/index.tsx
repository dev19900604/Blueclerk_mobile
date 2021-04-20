import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import { Icon } from 'native-base';
import { DrawerNavigationOptions } from '@react-navigation/drawer';
import { DrawerActions } from '@react-navigation/compat';
import styles from './styles';
import { logEvent } from '../../helpers';
import { Header } from '../../common/common-header';
import { Service } from '../../config/services';

export default function EquipmentType({ navigation }: any) {
  const options: DrawerNavigationOptions = {
    drawerIcon: ({ color }: any) => (
      <Icon name="hammer" style={{ fontSize: 24, color }} />
    ),
  };

  const [data, setData] = useState([]);
  const [currentTab, setCurrentTab] = useState('type');
  const [types, setTypes] = useState([]);
  const [brands, setBrands] = useState([]);
  const [tabHeading, setTabHeading] = useState('Equipment Types');
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');

  const _openMenu = () => {
    Keyboard.dismiss();
    navigation.dispatch(DrawerActions.toggleDrawer());
  };

  const getEquipmentTypes = async () => {
    const response = await Service.getEquipmentTypes();
    const { status, types } = response.data;

    if (status == 1) {
      const count = Object.keys(types).length;
      const drop_down_data = [];
      for (let i = 0; i < count; i++) {
        drop_down_data.push({
          value: types[i].title,
          id: types[i]._id,
        });
      }

      setTypes(drop_down_data);
    } else {
      setVisible(true);
      setMessage('Error while getting Equipment Brands, please try again later.');
    }
  };

  const getEquipmentBrands = async () => {
    const response = await Service.getEquipmentBrands();
    const { status, brands } = response.data;

    if (status == 1) {
      const count = Object.keys(brands).length;
      const drop_down_data = [];
      for (let i = 0; i < count; i++) {
        drop_down_data.push({
          value: brands[i].title,
          id: brands[i]._id,
        });
      }
      setBrands(drop_down_data);
    } else {
      setVisible(true);
      setMessage('Error while getting Equipment Brands, please try again later.');
    }
  };

  useEffect(() => {
    logEvent('equipment_type_screen');
    getEquipmentTypes();
    getEquipmentBrands();
  }, []);

  const _renderItem = ({ item }: any) => (
    <View style={styles.itemContainer}>
      <View style={styles.textContaier}>
        <Text style={styles.itemText}>{item.name}</Text>
      </View>
      <View style={styles.boderLine} />
    </View>
  );

  const _renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>{tabHeading}</Text>
    </View>
  );

  const select = (op: any) => {
    if (op == 'type') {
      setCurrentTab(op);
      setTabHeading('Equipment Types');
      setData(types);
    } else if (op == 'brand') {
      setCurrentTab(op);
      setTabHeading('Brands');
      setData(brands);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Type and Brand" leftIcon="menu" _openMenu={() => _openMenu()} />
      <View style={styles.headingContainer}>
        <TouchableOpacity
          style={[styles.headingContent, currentTab == 'type' ? styles.active : '']}
          onPress={() => select('type')}
        >
          <Text style={[currentTab == 'type' ? styles.activeText : styles.tabText]}>
            Equipment Types
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.headingContent, currentTab == 'brand' ? styles.active : '']}
          onPress={() => select('brand')}
        >
          <Text style={[currentTab == 'brand' ? styles.activeText : styles.tabText]}>
            Brand/Manufacturer
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ListHeaderComponent={_renderHeader}
        data={data}
        renderItem={_renderItem}
        keyExtractor={(item, key) => item.id}
      />
      <Text style={styles.instructionText}>
        If you do not see a type or brand you need available, please contact your company
        administrator.
      </Text>
    </View>
  );
}
