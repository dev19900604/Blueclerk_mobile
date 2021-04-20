import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  icon: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  details: {
    marginLeft: 25,
    flex: 8,
  },
  title: {
    fontSize: 14,
    fontFamily: 'SlateForOnePlus-Regular',
  },
  name: {
    marginVertical: 5,
    fontSize: 14,
    fontFamily: 'SlateForOnePlus-Regular',
  },
  date: {
    marginTop: 3,
    fontSize: 12,
    color: 'gray',
    fontFamily: 'SlateForOnePlus-Regular',
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0.5, height: 0.5 },
    shadowColor: 'gray',
    shadowOpacity: 0.5,
    elevation: 3,
  },
  jobIcon: {
    color: 'black',
    fontSize: 30,
  },
  titleWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontFamily: 'SlateForOnePlus-Regular',
    textTransform: 'uppercase',
  },
  pending: {
    color: 'red',
  },
  finished: {
    color: 'green',
  },
  started: {
    color: '#00bfff',
  },
  cancelled: {
    color: '#d1ad1b',
  },
  listHeader: {
    marginVertical: 20,
    marginStart: 20,
  },
  listTitle: {
    color: 'black',
    fontFamily: 'SlateForOnePlus-Regular',
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAllWrapper: {
    borderRadius: 5,
    borderColor: '#149CE6',
    borderWidth: 1,
    backgroundColor: '#EAF7FF',
    paddingVertical: 5,
    width: width / 3,
    marginVertical: 25,
    alignSelf: 'center',
  },
  seeAllText: {
    textAlign: 'center',
    textTransform: 'uppercase',
    color: '#149CE6',
  },
});

export default styles;
