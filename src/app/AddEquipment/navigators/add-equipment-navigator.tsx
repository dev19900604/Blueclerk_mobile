import React from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
  StackScreenProps,
} from '@react-navigation/stack';
import { DrawerActions } from '@react-navigation/compat';
import AddEquipmentDetail from '../components/add-equipment-detail.screen';
import { background, white } from '../../../styles/colors';
import AddEquipmentStoreContext from '../contexts/add-equipment-store-context';
import EquipmentDetailStore from '../stores/equipment-detail-store';
import AddCustomerDetail from '../components/add-customer-detail.screen';
import CreatedEquipment from '../components/created-equipment.screen';
import Footer from '../../../common/footer';

const AddEquipmentNavigator = createStackNavigator();
const AddEquipmentNavigatorScreen = () => (
  <AddEquipmentNavigator.Navigator
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
    initialRouteName="AddEquipmentDetail"
  >
    <AddEquipmentNavigator.Screen
      name="AddEquipmentDetail"
      component={AddEquipmentDetail}
    />
    <AddEquipmentNavigator.Screen
      name="AddCustomerDetail"
      component={AddCustomerDetail}
    />
    <AddEquipmentNavigator.Screen name="CreatedEquipment" component={CreatedEquipment} />
  </AddEquipmentNavigator.Navigator>
);

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

type Props = StackScreenProps<JobStackParamList, 'AddEquipment'>;

function AddEquipmentWrapper({ navigation, route }: Props) {
  const store = new EquipmentDetailStore(route?.params?.nfcTag);
  return (
    <AddEquipmentStoreContext.Provider value={{ store }}>
      <AddEquipmentNavigatorScreen />
      <Footer onOpen={(): void => navigation.dispatch(DrawerActions.toggleDrawer())} />
    </AddEquipmentStoreContext.Provider>
  );
}

export default AddEquipmentWrapper;
