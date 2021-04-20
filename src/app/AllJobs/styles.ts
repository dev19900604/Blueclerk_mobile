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

  segment: {
    backgroundColor: '#505560',
    display: 'flex',
    flexDirection: 'row',
    padding: 15,
  },
  segmentsButton: {
    width: 100,
    height: 40,
    backgroundColor: '#505560',
    flex: 1,
    borderRadius: 5,
    paddingVertical: 10,
  },
  segmentsButtonActive: {
    backgroundColor: '#fff',
  },
  segmentsText: {
    textAlign: 'center',
    flex: 1,
    color: '#fff',
    fontWeight: '700',
    marginVertical: 0,
    paddingLeft: 5,
    paddingRight: 5
  },
  segmentsTextActive: {
    color: '#505560',
  },
  dialogContent: {
    flex: 1,
    paddingTop: 20,
    
  },
  dialogFooter: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  filterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
  },
  checkbox: {
    width: 15,
    height: 15,
    margin: 10
  },
  checkboxLabel: {
    fontSize: 15,
  },
  filterBy: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingBottom: 10,
    paddingTop: 10
  }
});

export default styles;
