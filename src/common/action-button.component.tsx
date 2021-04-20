import React, { ReactNode } from 'react';
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import {
  destructiveRed,
  disabledBackground,
  disabledText,
  lightBlue,
  turquoise,
  white,
} from '../styles/colors';
import { RowCenter } from '../styles/shared-styles';
import Label from './label';

type Props = {
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  icon?: ReactNode;
  disabled?: boolean;
  destructive?: boolean;
  secondary?: boolean;
  children?: any;
};

function ActionButton({
  destructive = false,
  disabled,
  icon,
  style,
  onPress,
  children,
  secondary,
}: Props) {
  let background = turquoise;
  let textColor = white;
  if (disabled) {
    background = disabledBackground;
    textColor = disabledText;
  } else if (destructive) {
    background = white;
    textColor = destructiveRed;
  } else if (secondary) {
    background = lightBlue;
    textColor = turquoise;
  }

  return (
    <TouchableOpacity
      style={[styles.button, style, { backgroundColor: background }]}
      onPress={onPress}
      disabled={disabled}
    >
      {icon !== undefined && icon}
      <Label style={[styles.label, { color: textColor }]}>{children}</Label>
    </TouchableOpacity>
  );
}

export default ActionButton;

const styles = StyleSheet.create({
  button: {
    height: 48,
    ...RowCenter,
    borderRadius: 4,
  },
  label: {
    fontSize: 17,
    fontFamily: 'ChakraPetch-Bold',
  },
});
