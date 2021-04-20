import React, { useContext, useEffect } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { observer } from 'mobx-react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { StackNavigationOptions } from '@react-navigation/stack';
import { lightGrey, white } from '../../../styles/colors';
import HeaderCancel from '../../../common/header-cancel.component';
import ActionButton from '../../../common/action-button.component';
import AddEquipmentStoreContext from '../contexts/add-equipment-store-context';
import { Header } from '../../../common/common-header';
import Select from '../../../common/select.component';
import AddEditPhotos from './add-edit-photos.component';
import TextField from '../../../common/text-field';
import { formatAddress } from '../../../utils/util-methods';

function AddCustomerDetail({ navigation }: any) {
  const { store } = useContext(AddEquipmentStoreContext);
  const options: StackNavigationOptions = {
    title: 'Add Equipment',
    headerRight: () => <HeaderCancel onPress={() => navigation.pop()} />,
    headerBackTitle: ' ',
  };

  useEffect(() => {
    store.fetchCustomers();
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

  async function handleCreateEquipmentTag() {
    await store.createEquipment()
      .then((data) => {
        if (data.message === 'Customer equipment created successfully.') {
          navigation.navigate('CreatedEquipment');
        }
        // show an error toast message if case of an error
      });
  }
  // console.log('selected-job-location', store.selectedJobLocation);
  // console.log('selected-job-siteeeeeee', store.selectedJobSite);
  // console.log('selected-customerrrrrr', store.selectedCustomer?._id);
  // console.log('nfc-tagga', store.nfcTag);

  return (
    <>
      <Header
        title="Add Equipment"
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
            placeholder="Location Address "
            style={[styles.textField, styles.textFieldContainer, { height: 80 }]}
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

          <AddEditPhotos style={styles.photos} />
        </KeyboardAwareScrollView>
        <ActionButton
          style={styles.button}
          disabled={!store.isCustomerDataValid && !store.isEquipmentDataValid}
          onPress={handleCreateEquipmentTag}
        >
          Save and complete
        </ActionButton>
      </SafeAreaView>
    </>
  );
}

export default observer(AddCustomerDetail);

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
