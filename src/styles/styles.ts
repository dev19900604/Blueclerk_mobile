import { StyleSheet } from 'react-native';
import colors, { lightGrey } from './colors';

export default StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: 'white',
  },
  textInput: {
    backgroundColor: lightGrey,
    padding: 2,
    textAlign: 'center',
    marginTop: 20,
  },
  textFieldContainer: {
    alignSelf: 'stretch',
    marginTop: 15,
  },
  textField: {
    backgroundColor: lightGrey,
  },
  multilineTextInput: {
    backgroundColor: lightGrey,
    padding: 2,
    textAlign: 'right',
    textAlignVertical: 'top',
    marginTop: 20,
    height: 120,
  },
  button: {
    padding: 5,
    marginTop: 20,
    backgroundColor: colors.assertColor,
  },
  disabledButton: {
    padding: 5,
    marginTop: 20,
    backgroundColor: 'lightgray',
  },
  select: {
    backgroundColor: lightGrey,
    marginTop: 20,
  },
  arrowDropdown: {
    position: 'absolute',
    right: 8,
    bottom: 8,
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
