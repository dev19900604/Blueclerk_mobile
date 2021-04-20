import { StyleSheet } from 'react-native';
import colors, { blue } from '../../styles/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  input: {
    borderColor: '#000',
    borderWidth: 1,
    margin: 5,
    height: 200,
    width: '100%',
    padding: 5,
    borderRadius: 5,
    fontFamily: 'SlateForOnePlus-Regular',
  },
  custName: {
    marginTop: -5,
    backgroundColor: '#fff',
    zIndex: 9,
    paddingHorizontal: 3,
  },
  newcomment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    paddingBottom: 40
  },
  submitButton: {
    backgroundColor: colors.btnPrimary,
    padding: 10,
    paddingLeft: 30,
    paddingRight: 30,
    borderRadius: 15
  },
  submitButtonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white'
  }
});

export default styles;
