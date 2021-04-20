import React, { FC, useEffect } from 'react';
import { ActivityIndicator, StatusBar, View } from 'react-native';
import { useSelector } from 'react-redux';

import { useNavigation } from '@react-navigation/native';

function AuthLoading() {
  const navigation = useNavigation();
  const user = useSelector((state: any) => state.UserReducer);
  useEffect(() => {
    bootstrapAsync();
  }, []);

  const bootstrapAsync = async () => {
    navigation.navigate(user.token ? 'App' : 'Auth');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size={40} />
      <StatusBar barStyle="default" />
    </View>
  );
}

export default AuthLoading;
