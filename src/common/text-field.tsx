import React, { useState } from 'react';
import {
  Platform,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { white } from '../styles/colors';
import Label from './label';

export type TextFieldProps = TextInputProps & {
  title: string;
  error?: boolean;
};

function TextField({
  title, style, error, secureTextEntry, ...rest
}: TextFieldProps) {
  const [showPass, setShowPass] = useState(false);

  return (
    <View style={[styles.container, style]}>
      <Label style={error ? styles.errorLabel : styles.label}>{title}</Label>
      <View style={{ flexDirection: 'row' }}>
        <TextInput
          {...rest}
          numberOfLines={4}
          style={styles.input}
          secureTextEntry={secureTextEntry && !showPass}
        />
        {secureTextEntry && (
          <MaterialIcons
            name={showPass ? 'visibility' : 'visibility-off'}
            size={24}
            onPress={() => setShowPass(!showPass)}
          />
        )}
      </View>
    </View>
  );
}

export default TextField;

const styles = StyleSheet.create({
  container: {
    height: 56,
    backgroundColor: white,
    borderRadius: 4,
    paddingHorizontal: 13,
    paddingVertical: 8,
  },
  input: {
    ...Platform.select({
      ios: {
        marginTop: 4,
      },
      android: {
        marginTop: 0,
      },
    }),
    flex: 1,
    padding: 0,
    color: 'black',
  },
  label: {
    fontSize: 11,
    height: 15,
  },
  errorLabel: {
    fontSize: 11,
    height: 15,
    color: 'red',
  },
});
