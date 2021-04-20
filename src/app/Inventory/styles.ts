import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    backgroundColor: 'white',
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
  },
  containerButton: {
    marginTop: 20,
    textAlign: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'stretch',
  },
  textcontainer: {
    margin: 20,
    textAlign: 'center',
  },
  actbtn: {
    margin: 5,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: '#1fb2e2',
  },
  txtSize: {
    fontSize: 18,
    marginTop: 5,
    padding: 5,
  },
  txtSizeSecondTitle: {
    marginTop: 15,
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  actbtn3: {
    margin: 15,
    width: 150,
    textAlign: 'center',
    alignSelf: 'center',
    backgroundColor: '#1fb2e2',
  },
  imageBlueClerk: {
    width: 70,
    height: 50,
    alignSelf: 'center',
  },
  icon: {
    width: 24,
    height: 24,
  },
});

export default styles;
