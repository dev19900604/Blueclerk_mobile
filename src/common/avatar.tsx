import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const UserAvatar = (props: any) => (
  <View style={[styles.avatarName]}>
    <Text style={styles.avatarText}>
      {props.name.toUpperCase().toString().substr(0, 1)}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  avatarName: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'blue',
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarText: {
    color: 'white',
    fontSize: 18,
  },
});

export default UserAvatar;
