import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  userContainer: {
    alignItems: 'center',
    paddingVertical: 15,
    marginVertical: 5,
  },
  useravatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  name: {
    marginTop: 20,
    fontFamily: 'SlateForOnePlus-Regular',
    color: '#262D38',
    fontSize: 18,
  },
  email: {
    marginVertical: 2,
    color: '#788499',
    fontFamily: 'SlateForOnePlus-Regular',
  },
  listText: {
    color: '#788499',
    fontFamily: 'SlateForOnePlus-Regular',
    marginLeft: 25,
  },
  listItem: {
    paddingVertical: 14,
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomColor: '#d3dff2',
    borderBottomWidth: 0.4,
  },
  versionContainer: {
    marginTop: '20%',
    width: '100%',
    alignItems: 'center',
  },
  versionText: {
    fontSize: 12,
    color: '#788499',
    fontFamily: 'SlateForOnePlus-Regular',
  },
  avatarImg: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
});

export default styles;
