import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Label from './label';
import { blue, lightBlue, turquoise } from '../styles/colors';
import { Center } from '../styles/shared-styles';

type Props = {
  style?: StyleProp<ViewStyle>;
  children?: any;
};

function Tag({ children, style }: Props) {
  return (
    <View style={[styles.container, style]}>
      <Label style={styles.label}>{children}</Label>
    </View>
  );
}

export default Tag;

const styles = StyleSheet.create({
  container: {
    backgroundColor: lightBlue,
    borderRadius: 4,
    ...Center,
    borderWidth: 1,
    borderColor: blue,
    paddingHorizontal: 16,
  },
  label: {
    color: turquoise,
    fontSize: 12,
    fontWeight: '500',
  },
});
