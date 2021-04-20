import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  viewContainer: {
    flex: 1,
    padding: 16,
  },
  heading: {
    marginTop: 15,
    marginBottom: 25,
  },
  workTitle: {
    fontFamily: 'SlateForOnePlus-Regular',
    fontSize: 16,
    color: '#686767',
  },
  subTitle: {
    fontFamily: 'SlateForOnePlus-Regular',
    color: '#ACABAE',
  },
  row: {
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopColor: 'lightgray',
    borderTopWidth: 0.5,
  },
  rows: {
    paddingVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontFamily: 'SlateForOnePlus-Regular',
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
  },
  value: {
    fontFamily: 'SlateForOnePlus-Regular',
    fontSize: 15,
    fontWeight: 'bold',
    color: '#7987DA',
  },
  note: {
    fontFamily: 'SlateForOnePlus-Regular',
    marginTop: 5,
    fontSize: 14,
    color: '#7987DA',
  },
  btnWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 25,
  },
  notelbl: {
    paddingVertical: 12,
    borderTopColor: 'lightgray',
    borderTopWidth: 0.5,
  },
  nlabel: {
    fontFamily: 'SlateForOnePlus-Regular',
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
  },
  emptyInfo: {
    borderTopColor: 'lightgray',
    borderTopWidth: 0.5,
    paddingVertical: 25,
    alignItems: 'center',
  },
  emptyText: {
    color: 'gray',
    fontFamily: 'SlateForOnePlus-Regular',
  },
  unitTitle: {
    marginTop: 10,
    paddingBottom: 12,
  },
  unitText: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'SlateForOnePlus-Regular',
    color: 'black',
  },
  phoneAction: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  }
});

export default styles;
