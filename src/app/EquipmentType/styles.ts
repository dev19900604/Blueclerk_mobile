import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoutStyle: {
    textAlign: 'center',
    fontSize: 20,
    marginTop: 20,
  },
  headingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'stretch',
  },
  headingContent: {
    height: 50,
    borderRightColor: '#eee',
    borderRightWidth: 1,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    paddingTop: 15,
  },
  active: {
    backgroundColor: '#00bfff',
  },
  activeText: {
    fontFamily: 'SlateForOnePlus-Regular',
    color: '#fff',
  },
  instructionText: {
    fontFamily: 'SlateForOnePlus-Regular',
    fontSize: 14,
    textAlign: 'center',
    backgroundColor: '#d1ad1b',
    color: 'white',
    padding: 5,
  },
  tabText: {
    fontFamily: 'SlateForOnePlus-Regular',
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#00bfff',
  },
  headerTitle: {
    fontSize: 16,
    flex: 10,
    textAlign: 'center',
    color: '#00bfff',
    fontFamily: 'SlateForOnePlus-Regular',
  },
  itemContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  textContaier: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
  },
  itemText: {
    fontSize: 16,
    flex: 10,
    textAlign: 'center',
    fontFamily: 'SlateForOnePlus-Regular',
  },
  boderLine: {
    height: 1,
    backgroundColor: '#eee',
  },
});

export default styles;
