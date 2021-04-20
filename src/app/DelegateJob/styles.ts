import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    marginTop: 30,
  },
  actions: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  selectTechTxt: {
    marginBottom: -5,
    fontFamily: 'SlateForOnePlus-Regular',
    color: '#999999',
  },
  selDateText: {
    marginTop: 20,
    fontFamily: 'SlateForOnePlus-Regular',
    color: '#999999',
  },
  dateTrigger: {
    padding: 5,
    fontFamily: 'SlateForOnePlus-Regular',
  },
  dateWrapper: {
    marginTop: 13,
    height: 40,
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 10,
    borderColor: '#dddddd',
    borderWidth: 1,
    justifyContent: 'center',
  },
  typeDropDown: {
    marginTop: 10,
  },
  dropdown: {
    borderWidth: 0.5,
    borderBottomColor: '#999999',
  },
});

export default styles;
