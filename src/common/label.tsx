import React from 'react';
import { Text, TextProps } from 'react-native';

type Props = TextProps & {
  customFont?: boolean;
  style: any;
};

function Label({ customFont = false, style, ...rest }: Props) {
  return (
    <Text
      style={[{ fontFamily: 'ChakraPetch-Regular', textTransform: 'uppercase' }, style]}
      {...rest}
    />
  );
}

export default Label;
