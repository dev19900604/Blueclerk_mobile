import React, { useEffect } from 'react';
import { Dimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useSelector } from 'react-redux';
import crashlytics from '@react-native-firebase/crashlytics';
import Login from '../auth/login';
import Signup from '../auth/sign-up.screen';
import createAccount from '../auth/create-account';
import ForgotPassword from '../auth/forgot-password.screen';
import DrawerContent from './drawer-content';
import ScanTagScreen from '../common/scan-tag.screen';
import GuideScreen from '../common/guide.screen';
import TodayJobs from '../app/TodayJobs';
import GeneralSettings from '../app/GeneralSettings';
import Agreement from '../app/Agreements';
import { History } from '../app/History';
import EquipmentDetail from '../app/TodayJobs/equipment-detail';
import Report from '../app/Report';
import Comment from '../app/Comment';
import AllJobs from '../app/AllJobs';
import MyGroups from '../app/MyGroup';
import { MySchedule } from '../app/MySchedule';
import Schedule from '../app/Schedule';
import Equipment from '../app/Equipment';
import { WorkOrderPage } from '../common/work-order-page';
import createPurchaseOrder from '../common/create-purchase-order';
import purchaseOrderDetail from '../common/purchase-order-detail';
import AddCustomer from '../common/add-customer';
import createServiceTicket from '../common/create-service-ticket';
import generateJobFromTicket from '../common/generate-job-from-ticket';
import serviceTicktets from '../common/service-ticktets';
import CodeTag from '../common/code-tag';
import EquipmentType from '../app/EquipmentType';
import ScanBlueTag from '../app/ScanBlueTag';
import Inventory from '../app/Inventory';
import SelectOption from '../app/SelectOption';
import AddEquipmentWrapper from '../app/AddEquipment/navigators/add-equipment-navigator';
import AddLocationWrapper from '../app/AddLocation/navigators/add-location-navigator';
import DelegateJob from '../app/DelegateJob';
import AddBrand from '../app/AddBrand';
import ScanJobEquipment from '../app/ScanJobEquipment';
import locationDetail from '../app/TodayJobs/location-detail';

import ToS from '../app/ToS';

type AuthStackParamList = {
  AuthLoading: undefined;
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  CreateAccount:
    | {
        first_name: string;
        last_name: string;
        email_address: string;
        password: string;
        socialId: string | undefined;
        connectorType: string | undefined;
      }
    | undefined;
  ToS: undefined;
  Agreement: undefined;
};

const AuthStack = createStackNavigator<AuthStackParamList>();

function AuthStackScreen() {
  return (
    <AuthStack.Navigator
      screenOptions={(params) => ({
        gestureDirection: 'horizontal',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      })}
      mode="card"
      headerMode="none"
    >
      <AuthStack.Screen name="Login" component={Login} />
      <AuthStack.Screen name="SignUp" component={Signup} />
      <AuthStack.Screen
        name="ForgotPassword"
        component={ForgotPassword}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen name="CreateAccount" component={createAccount} />
      <AuthStack.Screen name="Agreement" component={Agreement} />
      <AuthStack.Screen name="ToS" component={ToS} />
    </AuthStack.Navigator>
  );
}
// *******JOB STACK*******//
type JobStackParamList = {
  jobs: undefined;
  ScanTagScreen: undefined;
  EquipmentDetail:
    | {
        nfcTag: string | undefined;
      }
    | undefined;
  LocationDetail: {
    nfcTag: string | undefined;
  };
  WorkOrderPage: {
    job: object | undefined;
  };
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
const JobStack = createStackNavigator<JobStackParamList>();

function JobScreen() {
  return (
    <JobStack.Navigator
      screenOptions={(params) => ({
        gestureDirection: 'horizontal',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      })}
      mode="card"
      headerMode="none"
    >
      <JobStack.Screen
        name="jobs"
        component={TodayJobs}
        options={{ headerShown: false }}
      />
      <JobStack.Screen
        name="ScanTagScreen"
        component={ScanTagScreen}
        options={{ headerShown: false }}
      />
      <JobStack.Screen
        name="EquipmentDetail"
        component={EquipmentDetail}
        options={{ headerShown: false }}
      />
      <JobStack.Screen
        name="LocationDetail"
        component={locationDetail}
        options={{ headerShown: false }}
      />
      <JobStack.Screen
        name="WorkOrderPage"
        component={WorkOrderPage}
        options={{ headerShown: false }}
      />
      <JobStack.Screen
        name="CreatePurchaseOrder"
        component={createPurchaseOrder}
        options={{ headerShown: false }}
      />
      <JobStack.Screen
        name="ViewPurchaseOrder"
        component={purchaseOrderDetail}
        options={{ headerShown: false }}
      />
      <JobStack.Screen
        name="AddCustomer"
        component={AddCustomer}
        options={{ headerShown: false }}
      />
      <JobStack.Screen
        name="CreateServiceTicket"
        component={createServiceTicket}
        options={{ headerShown: false }}
      />
      <JobStack.Screen
        name="GenerateJobFromTicket"
        component={generateJobFromTicket}
        options={{ headerShown: false }}
      />
      <JobStack.Screen
        name="ServiceTicktets"
        component={serviceTicktets}
        options={{ headerShown: false }}
      />
      <JobStack.Screen
        name="Options"
        component={SelectOption}
        options={{ headerShown: false }}
      />
      <JobStack.Screen
        name="AllJobs"
        component={AllJobs}
        options={{ headerShown: false }}
      />
      <JobStack.Screen
        name="Report"
        component={Report}
        options={{ headerShown: false }}
      />
      <JobStack.Screen
        name="Comment"
        component={Comment}
        options={{ headerShown: false }}
      />
      <JobStack.Screen
        name="AddEquipment"
        component={AddEquipmentWrapper}
        options={{ headerShown: false }}
      />
      <JobStack.Screen
        name="AddLocation"
        component={AddLocationWrapper}
        options={{ headerShown: false }}
      />
      <JobStack.Screen
        name="GuideScreen"
        component={GuideScreen}
        options={{ headerShown: false }}
      />
    </JobStack.Navigator>
  );
}
// ******* END OF JOB STACK*******//

// ***********SETTING STACK **********//
type SettingStackParamList = {
  Settings: undefined;
  AgreementSettings:
    | {
        agreed: boolean;
        data: object | undefined;
      }
    | undefined;
  ResetPassword:
    | {
        data: object | undefined;
      }
    | undefined;
};

const SettingStack = createStackNavigator<SettingStackParamList>();

function SettingScreen() {
  return (
    <SettingStack.Navigator
      screenOptions={(params) => ({
        gestureDirection: 'horizontal',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      })}
      mode="card"
      headerMode="none"
      initialRouteName="Settings"
    >
      <SettingStack.Screen name="Settings" component={GeneralSettings} />
      <SettingStack.Screen
        name="AgreementSettings"
        component={Agreement}
        options={{ headerShown: false }}
      />
    </SettingStack.Navigator>
  );
}
// ******* END OF SETTING STACK*******//

// ***********History STACK **********//

const HistoryStack = createStackNavigator();

function HistoryScreen() {
  return (
    <HistoryStack.Navigator
      screenOptions={(params) => ({
        gestureDirection: 'horizontal',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      })}
      mode="card"
      headerMode="none"
      initialRouteName="History"
    >
      <HistoryStack.Screen name="History" component={History} />
      <HistoryStack.Screen name="Unit History" component={History} />
    </HistoryStack.Navigator>
  );
}
// ******* END OF History STACK*******//

// ***********Generate JOb STACK **********//

const GenerateJobStack = createStackNavigator();

function GenerateJobScreen() {
  return (
    <GenerateJobStack.Navigator
      screenOptions={(params) => ({
        gestureDirection: 'horizontal',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      })}
      mode="card"
      headerMode="none"
      initialRouteName="GenerateJob"
    >
      <GenerateJobStack.Screen name="GenerateJob" component={serviceTicktets} />
      <GenerateJobStack.Screen
        name="GenerateJobFromTicket"
        component={generateJobFromTicket}
      />
    </GenerateJobStack.Navigator>
  );
}
// ******* END OF History STACK*******//
const Drawer = createDrawerNavigator();

function DrawerStackScreen(props) {
  return (
    <Drawer.Navigator
      drawerStyle={{ width: Dimensions.get('window').width }}
      initialRouteName="Jobs"
      drawerContent={() => <DrawerContent {...props} navigation={props.navigation} />}
    >
      <Drawer.Screen name="Settings" component={SettingScreen} />
      <Drawer.Screen name="History" component={HistoryScreen} />
      <Drawer.Screen name="MyGroup" component={MyGroups} />
      <Drawer.Screen name="Equipment" component={Equipment} />
      <Drawer.Screen name="Schedule" component={Schedule} />
      <Drawer.Screen name="Inventory" component={Inventory} />
      <Drawer.Screen name="CodeTag" component={CodeTag} />
      <Drawer.Screen name="TypeAndBrand" component={EquipmentType} />
      <Drawer.Screen name="Unit History" component={ScanBlueTag} />
      <Drawer.Screen name="MySchedule" component={MySchedule} />
      <Drawer.Screen name="Jobs" component={JobScreen} />
      <Drawer.Screen name="AddCustomer" component={AddCustomer} />
      <Drawer.Screen name="CreateServiceTicket" component={createServiceTicket} />
      <Drawer.Screen name="GenerateJob" component={GenerateJobScreen} />
    </Drawer.Navigator>
  );
}

type MainNavigatorParamsList = {
  Dashboard: undefined;
  DelegateJob:
    | {
        item: object;
      }
    | undefined;
  ScanGuide: undefined;
  AddBrand: undefined;
  AddEquipmentType: undefined;
  ScanBlueTag: undefined;
  ScanTagScreen: undefined;
  ScanJobEquipment: undefined;
  EquipmentDetail:
    | {
        nfcTag: string | undefined;
      }
    | undefined;
};

const MainNavigator = createStackNavigator<MainNavigatorParamsList>();

function AppStackScreen() {
  return (
    <MainNavigator.Navigator
      screenOptions={(params) => ({
        gestureDirection: 'horizontal',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      })}
      mode="card"
      headerMode="none"
    >
      <MainNavigator.Screen name="Dashboard" component={DrawerStackScreen} />
      <MainNavigator.Screen name="DelegateJob" component={DelegateJob} />
      <MainNavigator.Screen name="ScanGuide" component={GuideScreen} />
      <MainNavigator.Screen name="AddBrand" component={AddBrand} />
      <MainNavigator.Screen name="AddEquipmentType" component={EquipmentType} />
      <MainNavigator.Screen name="ScanBlueTag" component={ScanBlueTag} />
      <MainNavigator.Screen name="ScanTagScreen" component={ScanTagScreen} />
      <MainNavigator.Screen name="EquipmentDetail" component={EquipmentDetail} />
    </MainNavigator.Navigator>
  );
}

const RootStack = createStackNavigator();

function RootStackScreen() {
  const user = useSelector((state) => state.UserReducer);

  return (
    <RootStack.Navigator headerMode="none">
      {user.token ? (
        <RootStack.Screen name="App" component={AppStackScreen} />
      ) : (
        <RootStack.Screen name="Auth" component={AuthStackScreen} />
      )}
    </RootStack.Navigator>
  );
}

export default () => {
  useEffect(() => {
    crashlytics().log('App mounted.');
  }, []);

  return (
    <NavigationContainer>
      <RootStackScreen />
    </NavigationContainer>
  );
};
