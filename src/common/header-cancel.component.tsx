import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

import { white } from '../styles/colors';

type Props = {
  onPress: () => void;
};

function HeaderCancel({ onPress }: Props) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Text style={styles.title}>Cancel</Text>
    </TouchableOpacity>
  );
}

export default HeaderCancel;

const styles = StyleSheet.create({
  button: {
    marginRight: 10,
  },
  title: {
    color: white,
  },
});
