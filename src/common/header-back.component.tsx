import React from 'react';
import { TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

import { Icon } from 'react-native-elements';
import { white } from '../styles/colors';

type Props = {
  onPress: () => void;
};

function HeaderBack({ onPress }: Props) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Icon type="antdesign" name="left" color={white} size={20} />
    </TouchableOpacity>
  );
}

export default HeaderBack;

const { height } = Dimensions.get('window');
const styles = StyleSheet.create({
  button: {
    marginTop: height * 0.02,
  },
});
