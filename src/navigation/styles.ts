import { Platform, StyleSheet, Dimensions } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#505560',
    height: Dimensions.get('window').height,
  },
  wrapper: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  topContainer: {
    //flex:1,
    marginLeft: 20,
    marginTop: 10,
  },
  logo: {
    width: Dimensions.get('window').width / 2.5 + 15,
    height: Dimensions.get('window').height * 0.13,
    resizeMode: 'contain',
  },
  logoutButton: {
    padding: 6,
    backgroundColor: '#149CE6',
  },
  contentContainer: {
    width: '100%',
    flex: 1,
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
  tagContainer: {
    position: 'absolute',
    right: 10,
    top: 40
  },
  tagScanButton: {
    width: Dimensions.get('window').width / 2 - 20,
    height: 50,
  },
  tagScanButtonBackground: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  header_main: {
    height: 140,
    backgroundColor: '#00bfff',
    flexDirection: 'row',
    marginTop: Platform.OS === 'ios' ? -45 : 0,
  },
  image_container1: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 15,
    alignSelf: 'center',
  },
  image_container2: {
    alignItems: 'center',
  },
  image_logo: {
    height: 74,
    width: 74,
  },
  header_text: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: -15,
    marginTop: 15,
    alignSelf: 'center',
  },
  inner_text: {
    color: 'white',
    fontSize: 18,
    alignItems: 'flex-start',
    fontFamily: 'SlateForOnePlus-Regular',
  },
  f_image_container2: {
    alignItems: 'center',
  },
  f_image_profile: {
    height: 64,
    width: 64,
    borderRadius: 60,
  },
});

export default styles;
