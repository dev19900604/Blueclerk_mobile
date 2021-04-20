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
    color: '#fff',
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
    fontWeight: 'bold',
  },
});

export default styles;
