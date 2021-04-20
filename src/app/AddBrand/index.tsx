import React, { useEffect } from 'react';
import { View } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { DrawerActions } from '@react-navigation/compat';
import { logEvent } from '../../helpers';
import styles from './styles';
import { Header } from '../../common/common-header';

export default function AddBrand({ navigation }: any) {
  useEffect(() => {
    logEvent('add_brand_screen');
  }, []);

  const _openMenu = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };
  return (
    <View>
      <Header title="Add brand" leftIcon="menu" _openMenu={() => _openMenu()} />
      <TextInput mode="flat" label="Brand name" style={styles.brandInput} />
      <Button mode="contained" style={styles.btnAdd} uppercase={false}>
        Add
      </Button>
    </View>
  );
}
