import React from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
  StackScreenProps,
} from '@react-navigation/stack';
import { DrawerActions } from '@react-navigation/compat';
import AddLocationDetail from '../components/add-location-detail.screen';
import { background, white } from '../../../styles/colors';
import AddLocationtStoreContext from '../contexts/add-location-store-context';
import LocationtDetailStore from '../stores/location-detail-store';
import CreatedLocation from '../components/created-location.screen';
import Footer from '../../../common/footer';

const AddLocationNavigator = createStackNavigator();

function AddLocationNavigatorScreen() {
  return (
    <AddLocationNavigator.Navigator
      screenOptions={(params) => ({
        gestureDirection: 'horizontal',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        headerStyle: {
          backgroundColor: background,
        },
        headerTintColor: white,
        headerBackTitle: '',
      })}
      mode="card"
      headerMode="none"
      initialRouteName="AddLoationDetail"
    >
      <AddLocationNavigator.Screen
        name="AddLoationDetail"
        component={AddLocationDetail}
      />
      <AddLocationNavigator.Screen name="CreatedLocation" component={CreatedLocation} />
    </AddLocationNavigator.Navigator>
  );
}

type JobStackParamList = {
  jobs: undefined;
  ScanTagScreen: undefined;
  EquipmentDetail:
    | {
        nfcTag: string | undefined;
      }
    | undefined;
  WorkOrderPage: undefined;
  CreatePurchaseOrder: undefined;
  ViewPurchaseOrder: undefined;
  AddCustomer: undefined;
  CreateServiceTicket: undefined;
  GenerateJobFromTicket: undefined;
  ServiceTicktets: undefined;
  GuideScreen: undefined;
  AllJobs: undefined;
  Options:
    | {
        nfcTag: string | undefined;
      }
    | undefined;
  AddEquipment:
    | {
        nfcTag: string | undefined;
      }
    | undefined;
  AddLocation:
    | {
        nfcTag: string | undefined;
      }
    | undefined;
  Report:
    | {
        job: object | string | undefined;
        from: boolean | undefined;
      }
    | undefined;
};

type Props = StackScreenProps<JobStackParamList, 'AddLocation'>;

function AddLocationWrapper({ navigation, route }: Props) {
  const store = new LocationtDetailStore(route?.params?.nfcTag);
  return (
    <AddLocationtStoreContext.Provider value={{ store }}>
      <AddLocationNavigatorScreen />
      <Footer onOpen={(): void => navigation.dispatch(DrawerActions.toggleDrawer())} />
    </AddLocationtStoreContext.Provider>
  );
}

export default AddLocationWrapper;
