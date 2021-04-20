import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  alignLabel: {
    alignSelf: 'auto',
  },
  input: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'column',
    marginHorizontal: 8,
  },
  inputBrand: {
    fontSize: 16,
    height: 50,
    paddingLeft: 6,
    backgroundColor: 'white',
    minHeight: 0,
    paddingVertical: 0,
  },
  inputMachine: {
    fontSize: 16,
    height: 50,
    paddingLeft: 6,
    backgroundColor: 'white',
    minHeight: 0,
    paddingVertical: 0,
  },
  textcontainer: {
    textAlign: 'center',
    marginTop: 20,
    marginLeft: 20,
  },
  txtSize: {
    padding: 5,
  },
  actbtn: {
    textAlign: 'center',
    margin: 15,
    backgroundColor: '#1fb2e2',
  },
  search: {
    marginLeft: 10,
    marginRight: 10,
    height: 60,
    paddingLeft: 6,
    backgroundColor: 'white',
    minHeight: 0,
    paddingVertical: 0,
    borderColor: '#9E9E9E',
  },
  listView: {
    width: 400,
    marginLeft: 15,
    marginRight: 15,
    backgroundColor: 'white',
    minHeight: 0,
    paddingVertical: 0,
    textAlign: 'center',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  eqName: {
    marginLeft: 15,
    marginRight: 15,
    fontSize: 16,
    paddingVertical: 10,
    textAlign: 'center',
    alignSelf: 'center',
    borderBottomColor: '#eee',
    width: 400,
    borderBottomWidth: 1,
    fontFamily: 'SlateForOnePlus-Regular',
  },
  card: {
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    paddingBottom: 10,
    marginHorizontal: 30,
    marginTop: 20,
  },
  title: {
    fontSize: 16,
    fontFamily: 'SlateForOnePlus-Regular',
  },
  members: {
    fontSize: 12,
    color: 'gray',
    fontFamily: 'SlateForOnePlus-Regular',
  },
});

export default styles;
