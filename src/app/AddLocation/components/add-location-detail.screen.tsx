import React, { useContext, useEffect } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import { observer } from 'mobx-react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { StackNavigationOptions, StackNavigationProp } from '@react-navigation/stack';
import RNLocation from 'react-native-location';
import { lightGrey, white } from '../../../styles/colors';
import HeaderCancel from '../../../common/header-cancel.component';
import ActionButton from '../../../common/action-button.component';
import AddLocationStoreContext from '../contexts/add-location-store-context';
import TextField from '../../../common/text-field';
import { formatAddress } from '../../../utils/util-methods';
import Select from '../../../common/select.component';
import AddEditPhotos from './add-edit-photos.component';
import HeaderBack from '../../../common/header-back.component';
import { Header } from '../../../common/common-header';

type RootStackParamList = {
  CreatedLocation: any;
};

type AddLocationDetailNavigationProp = StackNavigationProp<
  RootStackParamList,
  'CreatedLocation'
>;

type Props = {
  navigation: AddLocationDetailNavigationProp,
  route: any
};

function AddLocationDetail({ navigation, route }: Props) {
  const options: StackNavigationOptions = {
    title: 'Add Location',
    headerRight: () => <HeaderCancel onPress={() => navigation.pop()} titleHeader />,
    headerLeft: () => <HeaderBack onPress={() => navigation.goBack()} titleHeader />,
  };

  const { store } = useContext(AddLocationStoreContext);

  useEffect(() => {
    store.fetchCustomers();
    // if (Platform.OS == 'android') {
    //   turnOnAndGetLocation();
    // }
    // getCurrentLocation();

    // test if the scanned tag is successfully passed as route param and used to set state
    // store.nfcTag = route?.params?.nfcTag;
  }, []);

  useEffect(() => {
    if (store.selectedCustomer) {
      store.fetchCustomerJobLocations();
    }
  }, [store.selectedCustomer]);

  useEffect(() => {
    if (store.selectedJobLocation) {
      store.fetchCustomerJobSites();
    }
  }, [store.selectedJobLocation]);

  async function handleCreateLocationTag() {
    await store.createLocation()
      .then((data) => {
        if (data.message === 'Tag coded successfully.') {
          navigation.navigate('CreatedLocation');
        }
        // show an error toast message
      });
  }

  // const turnOnAndGetLocation = async () => {
  //   try {
  //     const granted = await PermissionsAndroid.requestMultiple([
  //       PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
  //       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  //     ]);

  //     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //       getCurrentLocation();
  //     } else {
  //       Alert.alert('Location permission denied');
  //     }
  //   } catch (err) {
  //     Alert.alert(err);
  //   }
  // };

  // const getCurrentLocation = () => {
  //   RNLocation.configure({
  //     distanceFilter: 1,
  //     interval: 100,
  //     androidProvider: 'auto',
  //     desiredAccuracy: {
  //       ios: 'best',
  //       android: 'highAccuracy',
  //     },
  //   });

  //   RNLocation.requestPermission({
  //     ios: 'whenInUse',
  //     android: {
  //       detail: 'fine',
  //     },
  //   })
  //     .then((value) => {
  //       if (value == true) {
  //         RNLocation.getLatestLocation(1000).then((location) => {
  //           store.latitude = location?.latitude?.toString();
  //           store.longitude = location?.longitude?.toString();
  //         });
  //       }
  //     })
  //     .catch((error) => {
  //       console.warn('getCurrentLocation -> error', error);
  //     });
  // };

  return (
    <>
      <Header
        title="Add Location"
        leftIcon="goback"
        rightIcon="Cancel"
        _goBack={() => {
          navigation.goBack();
        }}
      />
      <SafeAreaView style={styles.container}>
        <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
          <Select
            title="Customer"
            placeholder="Customer Name"
            style={[styles.textField, styles.textFieldContainer]}
            onChangeText={(username) => {
              store.customers.map((c, index) => {
                if (c.profile.displayName == username) {
                  store.selectedCustomer = store.customers[index];
                }
              });
            }}
            options={
              store.customers && store.customers.length != 0
                ? store.customers.map((c) => c.profile.displayName)
                : []
            }
            onSelect={(index) => {
              store.selectedCustomer = store.customers[index];
            }}
            value={store.selectedCustomer?.profile?.displayName}
          />

          <Select
            title="Job Location"
            placeholder="Select Location"
            style={[styles.textField, styles.textFieldContainer]}
            onChangeText={(locationName) => {
              if (store.selectedCustomerJobLocations.length > 0) {
                store.selectedCustomerJobLocations.find((loc: any, index: number) => {
                  if (loc.name == locationName) {
                    store.selectedJobLocation = store.selectedCustomerJobLocations[index];
                  }
                });
              }
            }}
            options={
              store.selectedCustomerJobLocations.length > 0
                ? store.selectedCustomerJobLocations.map((loc: any) => loc.name)
                : store.selectedCustomerJobLocations
            }
            onSelect={(index) => {
              store.selectedJobLocation = store.selectedCustomerJobLocations[index];
            }}
            value={store.selectedJobLocation?.name ?? ''}
          />

          <Select
            title="Job Site"
            placeholder="Select Site"
            style={[styles.textField, styles.textFieldContainer]}
            onChangeText={(siteName) => {
              if (store.selectedCustomerJobSites.length > 0) {
                store.selectedCustomerJobSites.find((site: any, index: number) => {
                  if (site.name == siteName) {
                    store.selectedJobSite = store.selectedCustomerJobSites[index];
                  }
                });
              }
            }}
            options={
              store.selectedCustomerJobSites.length > 0
                ? store.selectedCustomerJobSites.map((site: any) => site.name)
                : store.selectedCustomerJobSites
            }
            onSelect={(index) => {
              store.selectedJobSite = store.selectedCustomerJobSites[index];
            }}
            value={store.selectedJobSite?.name ?? ''}
          />

          <TextField
            title="Address"
            placeholder="Tag Location Address"
            style={[styles.textField, styles.textFieldContainer, { height: 80 }]}
            onChangeText={(address) => (store.address = address)}
            multiline
            editable={false}
            numberOfLines={2}
            value={
              store.selectedJobSite && store.selectedJobSite?.address
                ? formatAddress(store.selectedJobSite?.address)
                : formatAddress(store.selectedJobLocation?.address)
            }
            returnKeyType="done"
          />
          <TextField
            title="Notes"
            placeholder="Add Note"
            style={[styles.textField, styles.textFieldContainer, { height: 120 }]}
            onChangeText={(note) => (store.note = note)}
            multiline
            numberOfLines={3}
          />
          <AddEditPhotos style={styles.photos} />
        </KeyboardAwareScrollView>
        <ActionButton
          style={styles.button}
          disabled={!store.isCustomerDataValid}
          onPress={() => handleCreateLocationTag()}
        >
          Save and complete
        </ActionButton>
      </SafeAreaView>
    </>
  );
}

export default observer(AddLocationDetail);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white,
    padding: 10,
  },
  textFieldContainer: {
    alignSelf: 'stretch',
    marginTop: 15,
  },
  textField: {
    backgroundColor: lightGrey,
  },
  button: {
    margin: 15,
  },
  photos: {
    marginTop: 10,
  },
});
