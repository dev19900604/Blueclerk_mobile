import React, { useEffect } from 'react';
import { View, Keyboard } from 'react-native';
import { Icon } from 'native-base';
import { StackNavigationOptions } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { DrawerActions } from '@react-navigation/compat';
import { logEvent } from '../../helpers';
import { Header } from '../../common/common-header';
import EmptyView from '../../common/empty-view';

export const History = () => {
  const options: StackNavigationOptions = {
    headerLeft: ({ tintColor }: any) => (
      <Icon name="copy" style={{ fontSize: 24, color: tintColor }} />
    ),
  };

  const navigation = useNavigation();

  const _openMenu = () => {
    Keyboard.dismiss();
    navigation.dispatch(DrawerActions.openDrawer());
  };

  useEffect(() => {
    logEvent('history');
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Header title="History" leftIcon="menu" _openMenu={() => _openMenu()} />
      <EmptyView
        title="No History"
        icon="md-time"
        message="Your job history will appear here"
      />
    </View>
  );
};
